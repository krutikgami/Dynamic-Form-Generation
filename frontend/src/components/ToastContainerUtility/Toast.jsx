import { useEffect } from "react"

export default function Toast({message,success,onClose}){

    useEffect(()=>{
        const delay = setTimeout(()=>{
            onClose()
        },3000)
        return ()=> clearTimeout(delay);
    },[onClose])

    return(
        <div
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white mb-2
            ${success? "bg-green-500" : "bg-red-500"}`}
        >
            {
                success ? 
                <div className="w-5 h-5 cursor-pointer" onClick={onClose}>
                    ✅
                </div> :
                <div className="flex items-center w-5 h-5 bg-white cursor-pointer" onClick={onClose}>
                    ❌
                </div>
            }
            <span>{message}</span>
        </div>
    )
}