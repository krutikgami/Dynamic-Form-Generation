import { useState,useEffect } from "react";
import FieldPalette from "./FieldPalette";
import BuilderCanvas from "./BuilderCanvas";
import FieldSettings from "./FieldSettings";
import {useNavigate} from 'react-router-dom'
import PublishModal from "./PublishModal";
import { usePublish } from "../../utilities/services/publishService.js";
import { useToast } from "../ToastContainerUtility/ToastContainer.jsx";
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'

export default function FormBuilder({ form, onFormSaved,isEdit,token }) {
    const navigate = useNavigate();
    const {showToast} = useToast();
    const {publish} = usePublish()
    const [isOpen,setIsOpen] = useState(false);
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
        }
    }
    
    console.log(schema);
    return(
     <>
       <div className="form-builder grid grid-cols-12 gap-2 h-[calc(100vh-6rem)] p-4 bg-gray-50 relative">
            <div className="col-span-2 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
                <FieldPalette formIndex={0}/>
            </div>

            <div className="col-span-8 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
                <BuilderCanvas schema={schema} onSchemaChange={setSchema} selectedFieldId={selectedFieldId} onFieldChange={setSelectedFieldId}/>
                <div className="flex justify-end mt-4 gap-2">

                    <Button
                        title="Preview" 
                        className="bg-blue-600 text-white w-22 h-10 rounded-2xl mb-0 cursor-pointer" 
                        onClickFunction={()=>setIsOpen(true)}
                    />

                    <Modal
                        message="This is One Time Preview if you come back then form is lost."
                        isOpen={isOpen}
                        onClose={()=>setIsOpen(false)}
                        actionButtons={[
                            {
                                label : "Confirm",
                                onClick : ()=> navigate('/renderer',{state : {schema : schema , isPreview : true}})
                            }
                        ]}
                    />

                    <Button
                        title={isEdit ? "Edit Form" :"Save Draft"}
                        disabled={isSaved}
                        className={`px-4 py-2 rounded-2xl ${
                            isSaved
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                        onClickFunction={handleDraft}
                    />

                    <Button
                        title="Publish"
                        disabled={!isSaved}
                        className={`
                            ${!isSaved ? "bg-gray-400 cursor-not-allowed" :
                            "bg-blue-600 text-white hover:bg-blue-700"} px-4 py-2 rounded-2xl`}
                        onClickFunction={() => setShowPublishModal(true)}
                    />
                </div>
            </div>

            <div className="col-span-2 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
                <FieldSettings schema={schema} onschemaChange={setSchema} selectedFieldId={selectedFieldId} />
            </div>

            <PublishModal
                isOpen={showPublishModal}
                onClose={() => setShowPublishModal(false)}
                onPublish={async(publishData)=>{
                    await publish(publishData,()=>setShowPublishModal(false))
                }}
                formData={formdata}
            />
        </div>
     </>   
    )
}