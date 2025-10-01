import { useState } from "react";

export default function FilterByStatus({ onChange,formStatusFilter }) {
  const [statusValue, setStatusValue] = useState("All");

  const handleChange = (e) => {
    const value = e.target.value;
    setStatusValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="relative w-auto">
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
        {formStatusFilter.map((obj, idx) => {
          const [label, value] = Object.entries(obj)[0];
          return (
            <option key={idx} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
