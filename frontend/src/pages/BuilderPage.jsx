import { useState  } from "react"
import FormBuilder from "../components/Builder/FormBuilder"
export default function BuilderPage() {
    const [form, setForm] = useState({
        id : null,
        title: '',
        description: '',
        schema :{fields: []}
    })

    const handledFormSaved = (updatedForm) =>{
        setForm(updatedForm)
        console.log(form);
    }

    return(
        <>
        <div className="w-full h-full">
            <FormBuilder form={form} onFormSaved={handledFormSaved}/>
        </div>
        </>
    )
}