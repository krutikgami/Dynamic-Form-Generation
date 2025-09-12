import { useState } from "react";

export default function PublishModal({ isOpen, onClose, onPublish }) {
  const [status, setStatus] = useState('ACTIVE');
  const [maxSubmissions, setMaxSubmissions] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userIds, setUserIds] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      status,
      maxSubmissions: maxSubmissions ? parseInt(maxSubmissions) : null,
      startDate: startDate || null,
      endDate: endDate || null,
      userIds: userIds.split(",").map(u => u.trim()).filter(Boolean)
    };
    onPublish(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
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
            <label className="block text-sm font-medium mb-1">
              Max Submissions
            </label>
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

          <div>
            <label className="block text-sm font-medium mb-1">User IDs (comma separated)</label>
            <textarea
              rows={2}
              className="w-full border rounded-md px-3 py-2"
              placeholder="id1,id2,id3"
              value={userIds}
              onChange={(e) => setUserIds(e.target.value)}
            />
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
              save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
