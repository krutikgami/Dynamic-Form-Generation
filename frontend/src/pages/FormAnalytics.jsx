import { useState, useEffect } from "react";
import { formsService } from "../utilities/services/formsService.js";
import FilterByStatus from "../components/Filter/FilterByStatus.jsx";
import { tableHeads,defaultDate } from "../utilities/AdminPanelConstants/FieldTypes.js";
import TableRender from "../components/Manager/TableRender.jsx";

export default function FormAnalytics() {
  const [value, setValue] = useState("All");
  const [formData, setFormData] = useState([]);

  const fetchForms = async (val) => {
    try {
      const data = await formsService(val,'Analytics');
      const rows = (data || []).map((form) => ({
        ID: form.id,
        Title: form.title,
        Description: form.description || "-",
        Status: form.status,
        SubmissionLimit: form.maxSubmissions ?? "Unlimited",
        StartDate: new Date(form.startDate).toLocaleDateString() === defaultDate ? 'No Limit' : new Date(form.startDate).toLocaleDateString(),
        EndDate: new Date(form.endDate).toLocaleDateString() === defaultDate ? 'No Limit' : new Date(form.endDate).toLocaleDateString(),
        CreatedAt: new Date(form.created_at).toLocaleDateString(),
        TotalViews: form.analytics?.totalViews ?? 0,
        TotalSubmissions: form.analytics?.totalSubmissions ?? 0,
      }));

      setFormData(rows);
    } catch (error) {
      console.error("Error Fetching Forms", error);
    }
  };

  useEffect(() => {
    fetchForms(value);
  }, [value]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-6">All Forms</h1>
        <FilterByStatus onChange={setValue} />
      </div>
        <TableRender 
          tableHeadings={tableHeads}
          submissionData={formData}
        />
    </div>
  );
}
