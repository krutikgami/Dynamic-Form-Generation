import { useState, useEffect } from "react";
import { formsService } from "../utilities/services/formsService.js";
import { Eye, FileText } from "lucide-react";
import FilterByStatus from "../components/Filter/FilterByStatus.jsx";
import { useNavigate } from "react-router-dom";
import { formStatusFilter, getFormService, Limit, Page } from "../utilities/AdminPanelConstants/FieldTypes.js";
import Pagination from "../components/common/Pagination.jsx";

export default function FormManager() {
  const navigate = useNavigate()
  const [forms, setForms] = useState([]);
  const [value, setValue] = useState("All");
  const [filterHide,setFilterHide] = useState(false)
  const [page, setPage] = useState(Page);
  const [meta,setMeta] = useState({});
  const fetchForms = async (val) => {
    try {
      const {data,meta} = await formsService(val,getFormService.manager,null,page,Limit);
      setForms(data || []);
      setMeta(meta)
    } catch (error) {
      console.error("Error Fetching Forms", error);
    }
  };
  
  useEffect(() => {
    fetchForms(value);
  }, [value,page]);

  
  const handleClick = async (formId) => {
    setFilterHide(true)
    navigate('/viewData',{state : {formId}})
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-6">All Forms</h1>
        {!filterHide &&<FilterByStatus onChange={setValue} formStatusFilter={formStatusFilter}/>}
      </div>
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
        <div className="mt-4">
          <Pagination page={page} setPage={setPage} totalPages={meta?.totalPages || 1}/>
        </div>
    </div>
  );
}
