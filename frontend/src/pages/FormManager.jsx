import { useState, useEffect } from "react";
import { formsService } from "../utilities/services/formsService.js";
import { Eye, FileText } from "lucide-react";
import TableRender from "../components/Manager/TableRender.jsx";
import FilterByStatus from "../components/Filter/FilterByStatus.jsx";

export default function FormManager() {
  const [forms, setForms] = useState([]);
  const [submissionData, setSubmissionData] = useState(null);
  const [value, setValue] = useState("All");
  const [filterHide,setFilterHide] = useState(false)

  const fetchForms = async (val) => {
    try {
      const data = await formsService(val);
      setForms(data || []);
    } catch (error) {
      console.error("Error Fetching Forms", error);
    }
  };
  
  useEffect(() => {
    fetchForms(value);
  }, [value]);

  const handleClick = async (formId) => {
    try {
      setFilterHide(true)
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
        return;
      }
      setSubmissionData(data?.data || []);
    } catch (error) {
      console.error("Error in Getting Form Submission Data", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-6">All Forms</h1>
        {!filterHide &&<FilterByStatus onChange={setValue} />}
      </div>
      {!submissionData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white shadow-md rounded-lg p-4 cursor-pointer border hover:shadow-lg transition flex flex-col justify-between"
              onClick={() => {
                handleClick(form.id)
              }}
            >
              <span className="text-lg font-semibold text-gray-800 mb-3">
                {form?.title || "Untitled Form"}
              </span>
              <div className="flex justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span>{form?.analytics?.totalViews ?? 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4 text-green-500" />
                  <span>{form?.analytics?.totalSubmissions ?? 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <TableRender
          tableHeadings={submissionData.tableHeadings}
          description={submissionData.description}
          title={submissionData.title}
          submissionData={submissionData.submissions}
        />
      )}
    </div>
  );
}
