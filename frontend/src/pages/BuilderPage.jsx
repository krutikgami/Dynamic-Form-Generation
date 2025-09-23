import { useState,useEffect  } from "react"
import FormBuilder from "../components/Builder/FormBuilder"
import { useLocation } from "react-router-dom"
export default function BuilderPage() {
    const location = useLocation();
    const formData = location?.state?.formData;
    const isEdit = location?.state?.isEdit;
    const [form, setForm] = useState({
        id : null,
        title: '',
        description: '',
        schema :{fields: []}
    })

    useEffect(()=>{
        if(formData){
            setForm({
                id : formData.id,
                title : formData.title,
                description : formData.description,
                schema : {
                    fields : formData.schema
                }
            })
        }
    },[formData,isEdit])

    const handledFormSaved = (updatedForm) =>{
        setForm(updatedForm)
        console.log(form);
    }

    return(
        <>
        <div className="w-full h-full">
            <FormBuilder form={form} onFormSaved={handledFormSaved} isEdit={isEdit}/>
        </div>
        </>
    )
}