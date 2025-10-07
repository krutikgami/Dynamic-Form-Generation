import { useEffect, useState } from "react";
import { formsService } from "../utilities/services/formsService.js";
import { useNavigate } from "react-router-dom";
import { Limit, Page } from "../utilities/AdminPanelConstants/FieldTypes.js";
import Pagination from "../components/common/Pagination.jsx";

export default function UserFormManager() {
  const [forms, setForms] = useState([]);
  const [page, setPage] = useState(Page);
  const [meta,setMeta] = useState({});
  const navigate = useNavigate();

  const fetchForms = async () => {
    try {
      const {data,meta} = await formsService('ACTIVE',"All",null,page,Limit);
      setForms(data || []);
      setMeta(meta)
    } catch (error) {
      console.error("Error Fetching Forms", error);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [page]);

  const handleView = (formId) => {
    navigate("/viewData", { state: { formId } });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-6">All Forms</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {forms.map((form) => (
          <div
            key={form.id}
            className="bg-white shadow-md rounded-lg flex items-center justify-evenly h-32 cursor-pointer border hover:shadow-lg transition"
            onClick={() => handleView(form.id)}
          >
            <span className="text-lg font-semibold text-gray-800">
              {form?.title || "Untitled Form"}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Pagination page={page} setPage={setPage} totalPages={meta?.totalPages || 1}/>
      </div>
    </div>
  );
}
