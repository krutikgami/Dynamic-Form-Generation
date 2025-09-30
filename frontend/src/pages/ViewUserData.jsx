import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TableRender from "../components/Manager/TableRender";
import { formAnalyticsTableHeadings } from "../utilities/AdminPanelConstants/FieldTypes.js";
export default function ViewUserData({ role }) {
  const location = useLocation();
  const { formId } = location.state || {};
  const [formData, setFormData] = useState(null);


  useEffect(() => {
    if (!formId) return;

    const fetchFormData = async () => {
      try {
        const response = await fetch("/api/v1/admin/form/submission/data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formId }),
        });

        const data = await response.json();
        if (!response.ok) {
          alert(data.message);
        } else {
          setFormData(data?.data || null);
        }
      } catch (error) {
        console.error("Error While Getting Submission Data", error);
      }
    };

    fetchFormData();
  }, [formId]);

  if (!formData) {
    return <p className="p-6">Loading form data...</p>;
  }

  return (
    <div className="p-6">
     <TableRender 
        tableHeadings={formAnalyticsTableHeadings}
        title={formData.title}
        description={formData.description}
        submissionData={formData.submissions}
        id={formData.id}
        role={role}
        viewOperation={true}
        manager={'Manager'}
     />
    </div>
  );
}
