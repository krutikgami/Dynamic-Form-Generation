import { useState } from "react";

export default function FilterByStatus({ onChange }) {
  const [statusValue, setStatusValue] = useState("All");

  const handleChange = (e) => {
    const value = e.target.value;
    setStatusValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="status" className="font-medium">
        Filter By Status:
      </label>
      <select
        id="status"
        name="status"
        value={statusValue}
        onChange={handleChange}
        className="border rounded px-2 py-1"
      >
        <option value="All">---Select Status---</option>
        <option value="DRAFT">Draft</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>
    </div>
  );
}
