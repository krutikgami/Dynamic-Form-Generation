import { useState, useEffect } from "react";

export default function TableRender(props) {
  const [tableHeadings, setTableHeadings] = useState([]);
  const [submissionData, setSubmissionData] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (props) {
        console.log(props)
      setTableHeadings(props?.tableHeadings || []);
      setDescription(props?.description || "");
      setTitle(props?.title || "");
      setSubmissionData(props?.submissionData || []);
    }
  }, [props]);

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
                      {row[heading === 'ID' ?  heading.toLowerCase() : heading] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeadings.length}
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
