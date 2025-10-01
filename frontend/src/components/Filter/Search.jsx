import { useState, useEffect, useCallback } from "react";

export default function Search({ placeholder, onSelect,label }) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchUsers = useCallback(async (query) => {
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
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers(value);
    }, 400);
    return () => clearTimeout(delay);
  }, [value, fetchUsers]);

  const handleSelect = (user) => {
    setValue(user.email); 
    setSuggestions([]);   
    if (onSelect) onSelect(user.id); 
  };

  return (
    <div className="relative w-full">
    <label htmlFor="search" className="font-medium">{label}</label>
      <input
        type="text"
        className="w-50 border rounded-md px-3 py-2"
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border rounded-md shadow-md mt-1 w-50 max-h-40 ml-36 overflow-y-auto">
          {suggestions.map((user) => (
            <li
              key={user.id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(user)}
            >
              {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
