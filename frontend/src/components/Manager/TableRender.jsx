import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TableRender(props) {
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
    navigate(role === "ADMIN" ? "/renderer" : "/userrenderer", { state: { formId , isEdit: true ,submissionData : submissionData[idx]} });
  };

  const handleDelete = async (formId, idx) => {
  try {
    const confirmDelete = window.confirm("Are you sure you want to delete this submission?");
    if (!confirmDelete) return; 

    const response = await fetch("/api/v1/admin/form/submission", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ formId, userId: submissionData[idx]?.id }),
    });

    const data = await response.json();
    if (!response.ok) {
      alert(data.message);
      return;
    }
    alert(data.message);
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
                  {tableHeadings.map((heading, hIdx) => (
                    <td
                      key={hIdx}
                      className="border px-4 py-2 text-sm text-gray-800"
                    >
                      {row[heading === "ID" ? heading.toLowerCase() : heading] ??
                        idx + 1}
                    </td>
                  ))}
                  {props.viewOperation && (
                  <td className="flex justify-center px-4 py-2 text-sm text-gray-800 space-x-2">
                    <button
                      onClick={() => handleEdit(id, idx)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    {role === "ADMIN" && (
                      <button
                        onClick={() => handleDelete(id,idx)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
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
      </div>
    </div>
  );
}
