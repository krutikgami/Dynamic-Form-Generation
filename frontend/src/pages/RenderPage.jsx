import { useState,useEffect } from "react";
import DynamicForm from "../components/Renderer/DynamicForm";
import { useLocation } from "react-router-dom";
export default function RenderPage(){
    const location = useLocation();

    const stateSchema = location?.state?.schema
    const isPreview = location?.state?.isPreview
    const [schema,setSchema] = useState(null);


    useEffect(()=>{
        setSchema(stateSchema)
    },[])

    console.log("Render Page Data :",schema);
    return(
     <div className="flex justify-center items-center w-full">
        <div className="w-full max-w-lg mt-5">
            <DynamicForm schema={schema} isPreview={isPreview} />
        </div>
      </div>
    )
}