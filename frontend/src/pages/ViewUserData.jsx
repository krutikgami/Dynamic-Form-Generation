import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TableRender from "../components/Manager/TableRender";
import { formAnalyticsTableHeadings,Page,Limit } from "../utilities/AdminPanelConstants/FieldTypes.js";
import { useToast } from "../components/ToastContainerUtility/ToastContainer.jsx";
export default function ViewUserData({ role }) {
  const location = useLocation();
  const { showToast } = useToast();
  const { formId } = location.state || {};
  const [formData, setFormData] = useState(null);
  const [page,setPage] = useState(Page);
  const [meta,setMeta] = useState({});


  useEffect(() => {
    if (!formId) return;

    const fetchFormData = async () => {
      try {
        const response = await fetch("/api/v1/admin/form/submission/data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formId,page,limit:Limit }),
        });
        const data = await response.json();
        if (!response.ok) {
          showToast(data?.message, data?.success);
        } else {
          setFormData(data?.data || null);
          setMeta(data?.meta)
          showToast(data?.message, data?.success);
        }
      } catch (error) {
        console.error("Error While Getting Submission Data", error);
        showToast("Error While Getting Submission Data", false);
      }
    };

    fetchFormData();
  }, [formId,page]);

  if (!formData) {
    return <p className="p-6">Loading form data...</p>;
  }

  return (
    <div className="p-6">
     <TableRender
        page={page}
        setPage={setPage}
        totalPages={meta?.totalPages || 1} 
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
