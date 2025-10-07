import { useEffect } from "react";
import { useState } from "react";
import { validateField } from "../../utilities/validations/validateField.js";
import RenderField from "./RenderField.jsx";
import { useToast } from "../ToastContainerUtility/ToastContainer.jsx";

export default function DynamicForm({ schema,isPreview,isEdit,submissionData,isView }) {
  const {showToast} = useToast();
  const [isLoading,setIsLoading] = useState(false)
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  console.log(schema);
  console.log(submissionData)
   //call when user or admin try to update data of form
   useEffect(() => {
    if (submissionData) {
      setFormData(submissionData || {});
    }
  }, [isEdit,isView,submissionData]);

  const validateForm = () => {
    let newErrors = {};
    const fields = Array.isArray(schema?.schema) ? schema?.schema : schema?.fields || [];
    fields.forEach((field) => {
      const value = formData[field.label];
      const error = validateField(field, value);
      if (error) newErrors[field.name] = error;
    });
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
   try {
     e.preventDefault();
     const newErrors = validateForm();

     if (Object.keys(newErrors).length === 0) { 
      console.log(formData)
      
        // const sanitizedFormData = Array.isArray(formData)
        // ? formData.map(({ deleted_at, ...rest }) => rest) 
        // : (({ deleted_at,id, ...rest }) => rest)(formData); 

      const payload = isEdit
        ? { formId: schema.id, data: formData, userId: submissionData?.id }
        : { formId: schema.id, data: [formData] };
        
      setIsLoading(true)
        const response = await fetch('/api/v1/admin/form/submission',{
          method : isEdit ? 'PATCH' : 'POST',
          headers :{
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify(payload)
        })
        const data = await response.json();
        console.log('Form submission response:',data)
        if(!response.ok){
          if(Array.isArray(data?.errors) && data?.errors.length > 0){
            data?.errors.map((err)=> showToast(err.message,data.success))
          }else{
            showToast(data.message,data.success)
          }
          return
        }
        showToast(data.message,data.success)
      }
   } catch (error) {
      console.error('Error in submitting Form',error.message)
      showToast('Error in submitting Form',false)
   }finally{
      setIsLoading(false)
   }
  };

  const handleCheckboxChange = (field, option) => {
    const prevVal = formData[field.label] || [];
    const newValues = prevVal.includes(option)
      ? prevVal.filter((val) => val !== option)
      : [...prevVal, option];

    handleChange(field, newValues);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field.label]: value }));
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field.name]: error,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{schema?.title}</h2>
      <p className="text-sm text-gray-300 m-2">{schema?.description}</p>
      {(isPreview ? schema?.fields : schema?.schema)?.map((field) => (
        <RenderField
          key={field.id}
          field={field}
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          handleCheckboxChange={handleCheckboxChange}
          isEdit={isEdit}
          isView={isView}
          isLoading={isLoading}
        />
      ))}
    </form>
  );
}
