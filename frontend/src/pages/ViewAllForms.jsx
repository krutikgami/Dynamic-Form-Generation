import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublishModal from "../components/Builder/PublishModal";
import { usePublish } from "../utilities/services/publishService.js";
import { formsService } from "../utilities/services/formsService.js";
import FilterByStatus from "../components/Filter/FilterByStatus.jsx";
import { formStatusFilter, getFormService, Limit, Page, roleAdmin } from "../utilities/AdminPanelConstants/FieldTypes.js";
import Button from "../components/common/Button.jsx";
import Search from "../components/Filter/Search.jsx";
import Modal from "../components/common/Modal.jsx";
import { useToast } from "../components/ToastContainerUtility/ToastContainer.jsx";
import Pagination from "../components/common/Pagination.jsx";

export default function ViewAllForms({role}) {
  const {showToast} = useToast();
  const {publish} = usePublish();
  const [forms, setForms] = useState([]);
  const [idx, setIdx] = useState(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [value, setValue] = useState('All');
  const [selectedId, setSelectedId] = useState(null);
  const [isOpenModalIdx, setIsOpenModalIdx] = useState(null);
  const [page, setPage] = useState(Page);
  const [meta,setMeta] = useState({});
  const navigate = useNavigate();

  const fetchForms = async(statusValue, userId = null) => {
    try {
      const {data,meta} = await formsService(statusValue, getFormService.renderer, userId,page,Limit);
      setForms(data || []);
      setMeta(meta)
    } catch (error) {
      console.error('Error Fetching Forms', error);
    }
  } 

  useEffect(() => {
    fetchForms(value, selectedId);
  }, [value, selectedId,page,showPublishModal]);
   
  const handleView = async(formId) => {
    console.log(formId);
    try {
      const response = await fetch('/api/v1/admin/form/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({formId})
      });
      const data = await response.json();
      if (!response.ok) {
        showToast(data.message, data.success);
        return;
      }
      showToast(data.message, data.success);
    } catch (error) {
      console.error('Error in ViewForm', error);
      showToast('Error in Viewing Form', false);
    }
  } 

  const handleDelete = async(formId) => {
    try {
      const response = await fetch('/api/v1/admin/form', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({formId})
      });
      const data = await response.json();
      if (!response.ok) {
        showToast(data.message, data.success);
        return;
      }
      showToast(data.message, data.success);
      setIsOpenModalIdx(null);
    } catch (error) {
      console.error('Error in Deleting Form', error);
      showToast('Error in Deleting Form', false);
    }
  }

  const handleSelected = (userId) => {
    console.log(userId);
    setSelectedId(userId);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-6">All Forms</h1>
        {role === roleAdmin &&
          <div className="flex items-center gap-5">
            <div className="flex-shrink-0">
              <Search
                placeholder="Search by User email"
                label="Filter By User Email: "
                onSelect={handleSelected}
              />
            </div>
            <div className="flex-shrink-0">
              <FilterByStatus
                onChange={setValue}
                formStatusFilter={formStatusFilter}
              />
            </div>
          </div>
        }
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {forms.map((form, index) => (
          <div
            key={form.id}
            className="bg-white shadow-md rounded-lg flex items-center justify-evenly h-32 cursor-pointer border hover:shadow-lg transition"
            onClick={() => {
              handleView(form.id);
              navigate(role === roleAdmin ? '/renderer' : '/userrenderer', {state: {formId: form.id}});
            }}
          >
            <span className="text-lg font-semibold text-gray-800">
              {form?.title || "Untitled Form"}
            </span>
            {role === roleAdmin && 
            <div>
              <Button 
                key={index}
                title="Publish" 
                className="bg-green-400 border rounded-2xl text-white cursor-pointer" 
                onClickFunction={(e) => {
                  e.stopPropagation();
                  setIdx(index);
                  setShowPublishModal(true);
                }}
              />

              <Button 
                title="Edit Form"
                className="bg-blue-500 border rounded-2xl text-white cursor-pointer" 
                onClickFunction={(e) => {
                  e.stopPropagation();
                  navigate('/builder', {state: {formId: form.id, isEdit: true}});
                }}
              />

              <Button
                title="🗑️"
                className="bg-red-500 border rounded-2xl text-white cursor-pointer"
                onClickFunction={(e) => {
                  e.stopPropagation();
                  setIsOpenModalIdx(index);
                }}
              />

              <Modal 
                isOpen={isOpenModalIdx === index}
                onClose={() => setIsOpenModalIdx(null)}
                message="Confirm You want to delete this form?"
                actionButtons={[
                  {
                    label: "Delete",
                    className: "bg-red-500 text-white",
                    onClick: () => handleDelete(form.id)
                  }
                ]}
              />
            </div>
            }
          </div>
        ))}
      </div>
      {showPublishModal && (
        <PublishModal
          isOpen={showPublishModal}
          onClose={() => setShowPublishModal(false)}
          onPublish={publish}
          formData={forms[idx]}
        />
      )}

      <div className="mt-4">
        <Pagination page={page} setPage={setPage} totalPages={meta?.totalPages || 1}/>
      </div>
    </div>
  );
}
