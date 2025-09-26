import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublishModal from "../components/Builder/PublishModal";
import { handlePublish } from "../utilities/services/publishService.js";
import { formsService } from "../utilities/services/formsService.js";
import FilterByStatus from "../components/Filter/FilterByStatus.jsx";

export default function ViewAllForms({role}) {
  const [forms, setForms] = useState([]);
  const [idx,setIdx] = useState(null);
  const [showPublishModal,setShowPublishModal] = useState(false);
  const [value,setValue] = useState('All')
  const navigate = useNavigate();


    const fetchForms = async(value)=>{
      try {
        const data = await formsService(value)
        setForms(data || [])
      } catch (error) {
        console.error('Error Fetching Forms',error)
      }
    } 

    useEffect(()=>{
      fetchForms(value)
    },[value])
   
  const handleView = async(formId)=>{
    console.log(formId)
    try {
      const response = await fetch('/api/v1/admin/form/view',{
        method : 'POST',
        headers :{
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({formId})
      })
      const data = await response.json();
      if(!response.ok){
        alert(data.message)
      }
      console.log(data)
    } catch (error) {
      console.error('Error in ViewForm',error)
      alert('Error: ',error.message)
    }
  } 

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-6">All Forms</h1>
        <FilterByStatus onChange={setValue} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {forms.map((form,index) => (
          <div
            key={form.id}
            className="bg-white shadow-md rounded-lg flex items-center justify-evenly h-32 cursor-pointer border hover:shadow-lg transition"
            onClick={() => {
              handleView(form.id)
              navigate('/renderer',{state:{schema: form}})
            }}
          >
            <span className="text-lg font-semibold text-gray-800">
              {form?.title || "Untitled Form"}
            </span>
            {role === 'ADMIN' && 
            <div>
              <button key={index} className="bg-green-400 border rounded-2xl text-white w-24 h-10 cursor-pointer" onClick={(e)=> {
                e.stopPropagation();
                setIdx(index) 
                setShowPublishModal(true)}}>
                Publish</button>

              <button className="bg-blue-500 border rounded-2xl text-white w-24 h-10 cursor-pointer" onClick={(e)=>{
                e.stopPropagation();
                navigate('/builder',{state: {formData : forms[index], isEdit : true}})
              }}>Edit Form</button>
            </div>
            }
          </div>
        ))}
      </div>
      {showPublishModal && (
        <PublishModal
          isOpen={showPublishModal}
          onClose={()=>setShowPublishModal(false)}
          onPublish={handlePublish}
          formData={forms[idx]}
        />
      )}
    </div>
  );
}
