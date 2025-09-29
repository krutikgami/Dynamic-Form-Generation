import { useState, useEffect } from "react";
import FormBuilder from "../components/Builder/FormBuilder";
import { useLocation } from "react-router-dom";
import { formSchemaService } from "../utilities/services/formSchemaService.js";

export default function BuilderPage({ token }) {
  const location = useLocation();
  const formId =  location?.state?.formId; 
  const isEdit = location?.state?.isEdit;

  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    schema: { fields: [] },
  });

  useEffect(() => {
    const fetchFormDetails = async () => {
      if (!formId) return;

      try {
        const response = await formSchemaService(formId);
        console.log("BuilderPage schema response:", response);

        if (response) {
          setForm({
            id: response.id,
            title: response.title || "",
            description: response.description || "",
            schema: {
              fields: response.schema || response.fields || [],
            },
          });
        }
      } catch (error) {
        console.error("Error fetching form details:", error);
      }
    };

    if (isEdit) {
      fetchFormDetails();
    }
  }, [formId, isEdit]);

  const handledFormSaved = (updatedForm) => {
    setForm(updatedForm);
    console.log("Form updated:", updatedForm);
  };

  return (
    <div className="w-full h-full">
      <FormBuilder
        form={form}
        onFormSaved={handledFormSaved}
        isEdit={isEdit}
        token={token}
      />
    </div>
  );
}
