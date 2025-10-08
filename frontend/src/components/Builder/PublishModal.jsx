import { useState, useEffect,useCallback } from "react";
import Button from "../common/Button";
export default function PublishModal({ isOpen, onClose, onPublish, formData }) {
  const [status, setStatus] = useState("ACTIVE");
  const [maxSubmissions, setMaxSubmissions] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [fetchAllUsers, setFetchAllUsers] = useState(false);

  useEffect(() => {
    if (formData) {
      console.log(formData)
      setStatus(formData.status || "ACTIVE");
      setMaxSubmissions(formData.maxSubmissions ?? "");
      setStartDate(formData.startDate ? formData.startDate.split("T")[0] : "");
      setEndDate(formData.endDate ? formData.endDate.split("T")[0] : "");
      setIsPublic(formData.isPublic || false);
      setIsEditable(formData.isEditable || false);
      setSubmissionMessage(formData.submissionMessage || "");

      // Pre-fill textarea and selectedUsers based on formData
       if (formData.accessControls && !formData.isPublic) {
        const preUsers = formData.accessControls.map((d) => ({
          id: d.userId,
          email: d.user?.email || "",
        }));
        setSelectedUsers(preUsers);
        setTextareaValue(preUsers.map((u) => u.email).join(", "));
      } else if (formData.excludedUsers && formData.isPublic) {
        const preExcluded = formData.excludedUsers.map((d) => ({
          id: d.userId,
          email: d.user?.email || "",
        }));
        setSelectedUsers(preExcluded);
        setTextareaValue(preExcluded.map((u) => u.email).join(", "));
      }
    }
  }, [formData, isOpen]);

  const fetchUsers = useCallback(async (query='', fetchAll = false) => {
    if (!query.trim() && !fetchAll) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/v1/admin/search?q=${query}&role=USER`);
      const result = await res.json();
      if (result.success) {
        if (fetchAll) {
          // When fetching all users, add them to selected users
          const allUsers = result.data;
          const existingEmails = selectedUsers.map(u => u.email);
          const newUsers = allUsers.filter(u => !existingEmails.includes(u.email));
          const updatedUsers = [...selectedUsers, ...newUsers];
          
          setSelectedUsers(updatedUsers);
          setTextareaValue(updatedUsers.map(u => u.email).join(", "));
        } else {
          setSuggestions(result.data);
        }
      }
    } catch (err) {
      console.error("Error fetching users", err);
    }
  },[selectedUsers]);

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

  useEffect(() => {
    if (fetchAllUsers) {
      fetchUsers("", true);
      setFetchAllUsers(false);
    }
  }, [fetchAllUsers]);

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setTextareaValue(value);

    const emails = value
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);
      
    const updatedUsers = selectedUsers.filter((u) =>
      emails.includes(u.email)
    );

    setSelectedUsers(updatedUsers);
  };


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
      isPublic,
      isEditable,
      submissionMessage,
      maxSubmissions: maxSubmissions ? parseInt(maxSubmissions) : null,
      startDate: startDate || null,
      endDate: endDate || null,
      userIds: selectedUsers.map((u) => u.id),
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
              <option value="All">---Select Status---</option>
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

           <div className="flex items-center gap-4">
            <input
              id="isPublic"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="isPublic" className="text-sm font-medium">
              Access to all users
            </label>

            <input
              id="isEditable"
              type="checkbox"
              checked={isEditable}
              onChange={(e) => setIsEditable(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="isEditable" className="text-sm font-medium">
              Allow users to edit their submissions
            </label>
          </div>

          {/* <div className="relative">
            <label className="block text-sm font-medium mb-1">
              {isPublic
                ? "Exclude Users (comma separated)"
                : "User Emails (comma separated)"}
            </label>
            <textarea
              rows={2}
              className="w-full border rounded-md px-3 py-2"
              placeholder={
                isPublic
                  ? "Type emails of users to exclude..."
                  : "Type emails, suggestions will appear..."
              }
              value={textareaValue}
              onChange={handleTextareaChange}
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
          </div> */}

          {/* User Emails / Exclude Users */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium">
              {isPublic
                ? "Exclude Users (comma separated)"
                : "User Emails (comma separated)"}
            </label>

            {/* Checkbox to fetch all users with role USER */}
           
              <div className="flex items-center gap-1">
                <input
                  id="fetchAllUsers"
                  type="checkbox"
                  checked={selectedUsers.some(u => u.role === 'USER') || fetchAllUsers}
                  onChange={(e) =>setFetchAllUsers(e.target.checked)} 
                  className="w-4 h-4"
                />
                <label htmlFor="fetchAllUsers" className="text-xs text-gray-600">
                  Select All Users
                </label>
              </div>
          </div>

          {/* Textarea for manual typing */}
          <textarea
            rows={2}
            className="w-full border rounded-md px-3 py-2"
            placeholder={
              isPublic
                ? "Type emails of users to exclude..."
                : "Type emails, suggestions will appear..."
            }
            value={textareaValue}
            onChange={handleTextareaChange}
          />

          {/* Suggestions dropdown */}
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

          <div>
            <label className="block text-sm font-medium mb-1">
              Submission Message (shown after form submission) (optional)
            </label>
            <textarea 
              rows={2}
              className="w-full border rounded-md px-3 py-2 bg-gray-100"
              value={submissionMessage}
              onChange={(e) => setSubmissionMessage(e.target.value)}
            />
           
          </div>
          <div className="flex justify-end gap-2">
            <Button
              title="Cancel"
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              onClickFunction={onClose}
            />
            <Button
              type="submit"
              title="Save"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            />
          </div>
        </form>
      </div>
    </div>
  );
}