import { useState, useEffect } from "react";
import DynamicForm from "../components/Renderer/DynamicForm";
import { useLocation } from "react-router-dom";
import { formSchemaService } from "../utilities/services/formSchemaService.js";

export default function RenderPage() {
  const location = useLocation();
  const schemas = location?.state?.schema;
  const formId = location?.state?.formId;
  const isPreview = location?.state?.isPreview;
  const isEdit = location?.state?.isEdit;
  const isView = location?.state?.isView;
  const email = location?.state?.email;

  const [schema, setSchema] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);

    useEffect(() => {
      if (isPreview) {
        setSchema(schemas);
      }
    }, [isPreview, schemas]);

  useEffect(() => {
    if(!formId || isPreview) return

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

    const fetchSubmissionData = async () => {
      try {
        const status = "viewData";
        const response = await fetch("/api/v1/admin/form/submission/data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formId, status, email }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to fetch submission data");
        } else {
          const obj = {
            id: data?.data?.id,
            title: data?.data?.title,
            description: data?.data?.description,
            schema: data?.data?.schema,
          };
          setSchema(obj);
          setSubmissionData(data?.data?.submissions || []);
        }
      } catch (error) {
        console.error("Error while fetching submission data:", error);
      }
    };

    if (isEdit || isView) {
      fetchSubmissionData();
    } else {
      loadSchema()
    }
  }, [formId, isEdit, isView,isPreview, email]);

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-lg mt-5">
        {schema ? (
          <DynamicForm
            schema={schema}
            isPreview={isPreview}
            isEdit={isEdit}
            isView={isView}
            submissionData={submissionData?.data?.[0] || null}
            formId={formId}
          />
        ) : (
          <p>Loading form...</p>
        )}
      </div>
    </div>
  );
}
