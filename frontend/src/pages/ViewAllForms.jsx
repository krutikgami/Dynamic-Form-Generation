import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function ViewAllForms() {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const id = '4fe465cf-fcd4-4414-8483-e2bf3b1db10d'
        const res = await fetch("/api/v1/admin/forms",{
         headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({id})
        });
        const data = await res.json();

        if (!res.ok) {
          console.error('Error in fetching forms')
        }
        setForms(data.data || []); 
      } catch (err){
        console.error('Error fetching Forms',err.message)
      }
    };

    fetchForms();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Forms</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {forms.map((form) => (
          <div
            key={form.id}
            className="bg-white shadow-md rounded-lg flex items-center justify-center h-32 cursor-pointer border hover:shadow-lg transition"
            onClick={() => navigate('/renderer',{state:{schema: form.schema}})}
          >
            <span className="text-lg font-semibold text-gray-800">
              {form?.title || "Untitled Form"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
