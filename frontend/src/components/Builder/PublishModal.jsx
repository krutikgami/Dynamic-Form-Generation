import { useState, useEffect } from "react";

export default function PublishModal({ isOpen, onClose, onPublish, formData }) {
  const [status, setStatus] = useState("ACTIVE");
  const [maxSubmissions, setMaxSubmissions] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (formData) {
      console.log(formData)
      setStatus(formData.status || "ACTIVE");
      setMaxSubmissions(formData.maxSubmissions ?? "");
      setStartDate(formData.startDate ? formData.startDate.split("T")[0] : "");
      setEndDate(formData.endDate ? formData.endDate.split("T")[0] : "");
      if (formData.accessControls) {
        const preUsers = formData.accessControls.map((d) => ({
          id: d.userId,
          email: d.user?.email || "",
        }));
        setSelectedUsers(preUsers);
        setTextareaValue(preUsers.map((u) => u.email).join(", "));
      }
    }
  }, [formData, isOpen]);

  const fetchUsers = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/v1/admin/search?q=${query}`);
      const result = await res.json();
      if (result.success) {
        setSuggestions(result.data);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    const words = textareaValue.split(",");
    const lastWord = words[words.length - 1]?.trim();
    if (lastWord) {
      const delay = setTimeout(() => {
        fetchUsers(lastWord);
      }, 400);
      return () => clearTimeout(delay);
    } else {
      setSuggestions([]);
    }
  }, [textareaValue]);

  const handleSuggestionClick = (user) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    const words = textareaValue.split(",");
    words[words.length - 1] = ` ${user.email}`;
    setTextareaValue(words.join(",").trim());

    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: formData.id,
      status,
      maxSubmissions: maxSubmissions ? parseInt(maxSubmissions) : null,
      startDate: startDate || null,
      endDate: endDate || null,
      userIds: selectedUsers.map((u) => u.id), // only IDs
    };
    onPublish(payload, onClose);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[450px]">
        <h2 className="text-xl font-semibold mb-4">Publish Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Max Submissions</label>
            <input
              type="number"
              className="w-full border rounded-md px-3 py-2"
              placeholder="Leave empty for unlimited"
              value={maxSubmissions}
              onChange={(e) => setMaxSubmissions(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              User Emails (comma separated)
            </label>
            <textarea
              rows={2}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Type emails, suggestions will appear..."
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            />
            {suggestions.length > 0 && (
              <ul className="absolute bg-white border rounded-md shadow-md mt-1 w-full max-h-40 overflow-y-auto z-10">
                {suggestions.map((user) => (
                  <li
                    key={user.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(user)}
                  >
                    {user.email}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
