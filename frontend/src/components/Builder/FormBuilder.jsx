import { useState,useEffect } from "react";
import FieldPalette from "./FieldPalette";
import BuilderCanvas from "./BuilderCanvas";
import FieldSettings from "./FieldSettings";
import {useNavigate} from 'react-router-dom'
import PublishModal from "./PublishModal";
import { usePublish } from "../../utilities/services/publishService.js";
import Loader from '../Loader.jsx'
import { useToast } from "../ToastContainerUtility/ToastContainer.jsx";

export default function FormBuilder({ form, onFormSaved,isEdit,token }) {
    const navigate = useNavigate();
    const {showToast} = useToast();
    const {publish} = usePublish()
    const [isLoading,setIsLoading] = useState(false);
    const [schema,setSchema] =useState({
        title : 'New Form',
        description: '',
        fields : []
    })

    const [isSaved,setIsSaved] = useState(false);
    const [showPublishModal,setShowPublishModal] = useState(false);
    const [formdata,setFormData] = useState(null)

    const [selectedFieldId,setSelectedFieldId] = useState(null)


    useEffect(()=>{
        setSchema({
            title : form.title || 'New Form',
            description : form.description || '',
            fields : form.schema.fields || []
        })
        
    },[form])

    const handleDraft = async() =>{
        try {
            setIsLoading(true)
            const formData = {
                id: form ? form.id : null,
                title : schema.title,
                description : schema.description,
                fields: schema.fields,
                userId : token?.id
            }
            const api = isEdit ? '/api/v1/admin/updateForm' : '/api/v1/admin/form'
            const res = await fetch(api,{
                headers:{
                    'Content-Type' : 'application/json'
                },
                method : isEdit ? "PATCH" : "POST",
                body : JSON.stringify(formData)
            })
            const data = await res.json();
            console.log(data)
            if(!res.ok){
                setIsSaved(false);
                if(data?.errors){
                    data?.errors.map((err)=> showToast(err.message,data.success))
                }else{
                    showToast(data.message,data.success)
                }
                return
            }
            setIsSaved(true);
            setFormData(data.data)
            showToast(data.message,data.success)
        }catch (error) {
            console.error("save Draft error", error);
        }finally{
            setIsLoading(false)
        }
    }
    
    console.log(schema);
    return(
     <>
       <div className="form-builder grid grid-cols-12 gap-2 h-[calc(100vh-6rem)] p-4 bg-gray-50 relative">
            <div className="col-span-2 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
                <FieldPalette />
            </div>

            <div className="col-span-8 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
                <BuilderCanvas schema={schema} onSchemaChange={setSchema} selectedFieldId={selectedFieldId} onFieldChange={setSelectedFieldId}/>
                <div className="flex justify-end mt-4 gap-2">

                    <button 
                    className="bg-blue-600 text-white w-22 h-10 rounded-2xl mb-0 cursor-pointer" 
                    onClick={()=>{
                        const isOk = window.confirm('This is One Time Preview if you come back then form is lost.')
                        if(!isOk) return;
                        navigate('/renderer',{state : {schema : schema , isPreview : true}})
                    }}>Preview</button>

                    <button
                    disabled={isSaved}
                    className={`px-4 py-2 rounded-2xl ${
                        isSaved
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                    onClick={handleDraft}
                    >
                    {isLoading ? <Loader /> : (isEdit ? "Edit Form" :"Save Draft")}
                    </button>
                    <button
                    disabled={!isSaved}
                    className={`
                        ${!isSaved ? "bg-gray-400 cursor-not-allowed" :
                        "bg-blue-600 text-white hover:bg-blue-700"} px-4 py-2 rounded-2xl`}
                    onClick={() => setShowPublishModal(true)}
                    >
                    Publish
                    </button>
                </div>
            </div>

            <div className="col-span-2 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
                <FieldSettings schema={schema} onschemaChange={setSchema} selectedFieldId={selectedFieldId} />
            </div>

            <PublishModal
                isOpen={showPublishModal}
                onClose={() => setShowPublishModal(false)}
                onPublish={async(publishData)=>{
                    setIsLoading(true)
                    await publish(publishData,()=>setShowPublishModal(true),showToast)
                    setIsLoading(false)
                }}
                formData={formdata}
                isLoading={isLoading}
            />
        </div>
     </>   
    )
}