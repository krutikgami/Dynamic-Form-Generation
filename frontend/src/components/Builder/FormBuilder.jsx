import { useState,useEffect } from "react";
import FieldPalette from "./FieldPalette";
import BuilderCanvas from "./BuilderCanvas";
import FieldSettings from "./FieldSettings";
import {useNavigate} from 'react-router-dom'
import PublishModal from "./PublishModal";

export default function FormBuilder({ form, onFormSaved }) {
    const navigate = useNavigate();
    const [schema,setSchema] =useState({
        title : 'New Form',
        description: '',
        fields : []
    })

    const [isSaved,setIsSaved] = useState(false);
    const [showPublishModal,setShowPublishModal] = useState(false);
    const [formId,setFormId] = useState(null)

    const [selectedFieldId,setSelectedFieldId] = useState(null)


    useEffect(()=>{
        setSchema({
            title : form.schema.title || 'New Form',
            description : form.schema.description || '',
            fields : form.schema.fields || []
        })
        
    },[form])

    const handleDraft = async() =>{
        try {
            const formData = {
                title : schema.title,
                description : schema.description,
                fields: schema.fields,
                userId : '4fe465cf-fcd4-4414-8483-e2bf3b1db10d'
            }
            const res = await fetch('/api/v1/admin/form',{
                headers:{
                    'Content-Type' : 'application/json'
                },
                method : "POST",
                body : JSON.stringify(formData)
            })
            const data = await res.json();
            console.log(data)
            if(!res.ok){
                alert(data.message)
                setIsSaved(false);
            }
            setIsSaved(true);
            setFormId(data.data.id)
            alert(data.message)
            
        }catch (error) {
            console.error("save Draft error", error);
        }
    }

    const handlePublish = async (publishData) => {
    try {
      
      const publishPayload = {
        id : formId,
        ...publishData
      };

      const res = await fetch("/api/v1/admin/form", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "PATCH",
        body: JSON.stringify(publishPayload)
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Form published successfully!");
      setShowPublishModal(false);
    } catch (error) {
      console.error("Publish error", error);
    }
  };
    
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
                    Save Draft
                    </button>
                    <button
                    disabled={!isSaved}
                    className="px-4 py-2 rounded-2xl bg-blue-600 text-white hover:bg-blue-700"
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
                onPublish={handlePublish}
            />
        </div>
     </>   
    )
}