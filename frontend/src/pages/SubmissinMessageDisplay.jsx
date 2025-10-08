import { useState,useEffect } from "react"
export default function SubmissinMessageDisplay() {
    const [submissionMessage,setSubmissionMessage] = useState("");
    useEffect(()=>{
        const subMessage = JSON.parse(localStorage.getItem("submissionMessage"));
        if(subMessage) setSubmissionMessage(subMessage);
    },[])
    return (
        <div>
            {submissionMessage && 
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative my-4" role="alert">
            <span className="block sm:inline">{submissionMessage}</span>
            </div>
            }
        </div>
    )
}
