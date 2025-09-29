import { useState, useEffect } from "react";
import DynamicForm from "../components/Renderer/DynamicForm";
import { useLocation } from "react-router-dom";
import { formSchemaService } from "../utilities/services/formSchemaService.js";

export default function RenderPage() {
  const location = useLocation();
  const formId = location?.state?.formId;
  const isPreview = location?.state?.isPreview;
  const [schema, setSchema] = useState(null);

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const response = await formSchemaService(formId);
        console.log("Form schema response:", response);
        setSchema(response); 
      } catch (error) {
        console.error("Error fetching form schema:", error);
        setSchema(null);
      }
    };

    if (formId) loadSchema();
  }, [formId]);

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-lg mt-5">
        {schema ? (
          <DynamicForm schema={schema} isPreview={isPreview} />
        ) : (
          <p>Loading form...</p>
        )}
      </div>
    </div>
  );
}
