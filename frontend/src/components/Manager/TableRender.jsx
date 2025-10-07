import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ToastContainerUtility/ToastContainer";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { roleAdmin,getFormService,createField,createFieldSmall } from "../../utilities/AdminPanelConstants/FieldTypes.js";
import Pagination from "../common/Pagination.jsx";

export default function TableRender(props) {
  const {showToast} = useToast()
  const [isOpen,setIsOpen] = useState(false)
  const [tableHeadings, setTableHeadings] = useState([]);
  const [submissionData, setSubmissionData] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [id, setId] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (props) {
      setTableHeadings(props?.tableHeadings || []);
      setDescription(props?.description || "");
      setTitle(props?.title || "");
      setSubmissionData(props?.submissionData || []);
      setRole(props?.role || "");
      setId(props?.id || "");
    }
  }, [props]);

  const handleEdit = (formId,idx) => {
    navigate(role === roleAdmin ? "/renderer" : "/userrenderer", { state: { formId , isEdit: true , email: submissionData[idx]?.email} });
  };

  const handleView = (formId,idx)=>{
    navigate(role === roleAdmin ? "/renderer" : "/userrenderer", { state: { formId , isView: true , email: submissionData[idx]?.email } });
  }

  const handleDelete = async (formId, idx) => {
  try {
    console.log(formId)
    console.log(idx)
    console.log(submissionData[idx]?.email)
    const response = await fetch("/api/v1/admin/form/submission", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ formId, userId: submissionData[idx]?.email }),
    });

    const data = await response.json();
    if (!response.ok) {
      showToast(data.message,data.success);
      return
    }
     showToast(data.message,data.success);
  } catch (error) {
    console.error("Error deleting user Submission", error);
  }
};


  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              {tableHeadings.map((heading, idx) => (
                <th
                  key={idx}
                  className="border px-4 py-2 text-left text-sm font-semibold text-gray-700"
                >
                  {heading}
                </th>
              ))}
              {props.viewOperation && (
                <th className="border px-4 py-2 text-sm font-semibold text-gray-700">
                  Operations
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {submissionData.length > 0 ? (
              submissionData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 transition border-b"
                >
                  {props.manager !== getFormService.manager ? (
                    <>
                  {tableHeadings.map((heading, hIdx) => (
                    <td
                      key={hIdx}
                      className="border px-4 py-2 text-sm text-gray-800"
                    >
                      {row[heading === "ID" ? heading.toLowerCase() : heading] ??
                        idx + 1}
                    </td>
                  ))}
                  </>
                  ):(
                    <>
                    {tableHeadings.map((heading, hIdx) => {
                      const key = heading.toLowerCase(); // always lowercase
                      const value = row[key]; // default value

                      let cellValue = value;

                      if (key === "id") {
                        cellValue = idx + 1;
                      } else if (key === createFieldSmall || key === createField) {
                        const rawDate = row[createField];
                        cellValue = rawDate ? rawDate.split("T")[0] : ""; 
                      }

                      return (
                        <td
                          key={hIdx}
                          className="border px-4 py-2 text-sm text-gray-800"
                        >
                          {cellValue}
                        </td>
                      );
                    })}
                    </>
                  )}
                  {props.viewOperation && (
                  <td className="flex justify-center px-4 py-2 text-sm text-gray-800 space-x-2">
                    <Button
                      title="Edit"
                      onClickFunction={() => handleEdit(id, idx)}
                      className={`px-2 py-1 rounded 
                        ${submissionData[idx]?.deleted_at !== null || submissionData[idx]?.isEditable === false
                          ? "bg-gray-400 text-white cursor-not-allowed" 
                          : "bg-blue-500 text-white hover:bg-blue-600"}`}
                      disabled={ role === roleAdmin ? submissionData[idx]?.deleted_at !== null : (submissionData[idx]?.isEditable === false || submissionData[idx]?.deleted_at !== null)}
                    />

                    <Button
                      title="View"
                      onClickFunction={() => handleView(id, idx)}
                      className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                    />
                    

                    {role === roleAdmin && (
                      <>
                      <Button
                        title="Delete"
                        onClickFunction={() => setIsOpen(true)}
                        className={`px-2 py-1 rounded 
                          ${submissionData[idx]?.deleted_at !== null 
                            ? "bg-gray-400 text-white cursor-not-allowed" 
                            : "bg-red-500 text-white hover:bg-red-600"}`}
                        disabled={submissionData[idx]?.deleted_at !== null}
                      />
                      <Modal 
                        isOpen={isOpen}
                        onClose={()=>setIsOpen(false)}
                        message="Are You sure You want to Delete User Submission?"
                        actionButtons={[
                          {
                            label : "Confirm",
                            onClick :() => handleDelete(id,idx)
                          }
                        ]}
                      />
                      </>
                    )}
                  </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeadings.length + 1}
                  className="text-center py-4 text-gray-500"
                >
                  No Submissions Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-4">
          <Pagination page={props.page} setPage={props.setPage} totalPages={props.totalPages}/>
        </div>
      </div>
    </div>
  );
}
