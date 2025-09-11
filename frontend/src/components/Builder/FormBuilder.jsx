import { useState,useEffect, use } from "react";
import FieldPalette from "./FieldPalette";
import BuilderCanvas from "./BuilderCanvas";
import FieldSettings from "./FieldSettings";

export default function FormBuilder({ form, onFormSaved }) {
    const [schema,setSchema] =useState({
        title : 'New Form',
        description: '',
        fields : []
    })

    const [selectedFieldId,setSelectedFieldId] = useState(null)

    useEffect(()=>{
        setSchema({
            title : form.schema.title || 'New Form',
            description : form.schema.description || '',
            fields : form.schema.fields || []
        })
        
    },[form])

    const handleSubmit = () =>{
        localStorage.setItem('schema',JSON.stringify(schema))
    }
    
    console.log(schema);
    return(
     <>
       <div className="form-builder grid grid-cols-12 gap-2 h-[calc(100vh-6rem)] p-4 bg-gray-50 relative">
            <div className="col-span-2 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
                <FieldPalette />
            </div>

            <div className="col-span-8 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
                <BuilderCanvas schema={schema} onSchemaChange={setSchema} selectedFieldId={selectedFieldId} onFieldChange={setSelectedFieldId} onhandleSave={handleSubmit}/>
            </div>

            <div className="col-span-2 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
                <FieldSettings schema={schema} onschemaChange={setSchema} selectedFieldId={selectedFieldId} />
            </div>
        </div>
     </>   
    )
}