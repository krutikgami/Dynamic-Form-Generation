import { useState } from "react";

export default function DynamicForm({ schema,isPreview }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  console.log(schema);
   
  const validateField = (field, value) => {
    let error = "";

    if (field.validations) {
      for (let [rule, ruleObj] of Object.entries(field.validations)) {
        if (!ruleObj.value) continue; 
        switch (rule) {
          case "required":
            if (!value || (Array.isArray(value) && value.length === 0)) {
              error = ruleObj.message;
            }
            break;

          case "min":
            if (value && value.length < parseInt(ruleObj.ruleValue)) {
              error = ruleObj.message;
            }
            break;
            
          case "max":
            if(value && value.length > parseInt(ruleObj.ruleValue)){
                error = ruleObj.message;
            }
            break;
        
          case "pattern": {
            const regex = new RegExp(
              ruleObj.ruleValue.replace(/^\/|\/$/g, "")
            );
            if (value && !regex.test(value)) {
              error = ruleObj.message;
            }
            break;
          }

          default:
            break;
        }

        if (error) break; 
      }
    }

    return error;
};


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
        const response = await fetch('/api/v1/admin/form/submission',{
          method : 'POST',
          headers :{
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify({formId : schema.id, data : [formData]})
        }) 
        const data = await response.json();
        if(!response.ok){
          alert(data.message)
        }
        alert(data.message)
      }
   } catch (error) {
      console.error('Error in submitting Form',error.message)
      alert(error.message)
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

  
//TODO: for temp purpose switchCase comp in DynamicForm after testing make another Comp for this 
  const renderField = (field) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "date":
        return (
          <div key={field.id} className="mb-4">
            <label className="block mb-1 font-medium">{field.label}</label>
            <input
              type={field.type}
              name={field.label}
              placeholder={field.placeholder}
              value={formData[field.label] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-full p-2 border rounded"
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm">{errors[field.name]}</p>
            )}
          </div>
        );

      case "radio":
      case "checkbox":
        return (
          <div key={field.id} className="mb-4">
            <label className="block mb-1 font-medium">{field.label}</label>
            <div className="flex flex-row gap-2">
              {field?.options.map((val, i) => (
                <label key={i} className="flex items-center">
                  <input
                    type={field.type}
                    name={field.name}
                    value={val}
                    checked={
                      field.type === "checkbox"
                        ? (formData[field.label] || []).includes(val)
                        : formData[field.label] === val
                    }
                    onChange={(e) =>
                      field.type === "checkbox"
                        ? handleCheckboxChange(field, val)
                        : handleChange(field, e.target.value)
                    }
                  />
                  {val}
                </label>
              ))}
            </div>
            {errors[field.name] && (
              <p className="text-red-500 text-sm">{errors[field.name]}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.id} className="mb-4">
            <label className="block mb-1 font-medium">{field.label}</label>
            <select
              name={field.name}
              value={formData[field.label] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select an option</option>
              {field.options?.map((val, i) => (
                <option key={i} value={val}>
                  {val}
                </option>
              ))}
            </select>
            {errors[field.name] && (
              <p className="text-red-500 text-sm">{errors[field.name]}</p>
            )}
          </div>
        );

      case "button":
        return (
          <button
            key={field.id}
            type="submit"
            style={{
              width: `${field.style?.width || 100}px`,
              height: `${field.style?.height || 40}px`,
              backgroundColor: field.style?.backgroundColor || "#000000",
              color: field.style?.color || "#ffffff",
            }}
            className="rounded-lg shadow-md"
          >
            {field.label}
          </button>
        );

      case "textarea":
        return (
          <div key={field.id} className="mb-4">
            <label className="block mb-1 font-medium">{field.label}</label>
            <textarea
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.label] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-full p-2 border rounded"
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm">{errors[field.name]}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{schema?.title}</h2>
      <p className="text-sm text-gray-300 m-2">{schema?.description}</p>
      {isPreview ? schema?.fields?.map((field) => renderField(field)) : schema?.schema?.map((field) => renderField(field))}
    </form>
  );
}
