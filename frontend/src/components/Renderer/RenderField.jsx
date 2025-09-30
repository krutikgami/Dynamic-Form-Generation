import Loader from "../Loader";

export default function RenderField({
  field,
  formData,
  errors,
  handleChange,
  handleCheckboxChange,
  isEdit,
  isView,
  isLoading
}) {
  switch (field.type) {
    case "text":
    case "email":
    case "number":
    case "date":
      return (
        <div key={field.id} className="mb-4">
          <label className="block mb-1 font-medium">{field.label}</label>
          <input
            type={field.type}
            name={field.label}
            placeholder={field.placeholder}
            value={formData[field.label] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            className="w-full p-2 border rounded"
          />
          {errors[field.name] && (
            <p className="text-red-500 text-sm">{errors[field.name]}</p>
          )}
        </div>
      );

    case "radio":
    case "checkbox":
      return (
        <div key={field.id} className="mb-4">
          <label className="block mb-1 font-medium">{field.label}</label>
          <div className="flex flex-row gap-2">
            {field?.options.map((val, i) => (
              <label key={i} className="flex items-center">
                <input
                  type={field.type}
                  name={field.name}
                  value={val}
                  checked={
                    field.type === "checkbox"
                      ? (formData[field.label] || []).includes(val)
                      : formData[field.label] === val
                  }
                  onChange={(e) =>
                    field.type === "checkbox"
                      ? handleCheckboxChange(field, val)
                      : handleChange(field, e.target.value)
                  }
                />
                {val}
              </label>
            ))}
          </div>
          {errors[field.name] && (
            <p className="text-red-500 text-sm">{errors[field.name]}</p>
          )}
        </div>
      );

    case "select":
      return (
        <div key={field.id} className="mb-4">
          <label className="block mb-1 font-medium">{field.label}</label>
          <select
            name={field.name}
            value={formData[field.label] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select an option</option>
            {field.options?.map((val, i) => (
              <option key={i} value={val}>
                {val}
              </option>
            ))}
          </select>
          {errors[field.name] && (
            <p className="text-red-500 text-sm">{errors[field.name]}</p>
          )}
        </div>
      );

    case "button":
      return (
        <button
          key={field.id}
          type="submit"
          style={{
            width: `${field.style?.width || 100}px`,
            height: `${field.style?.height || 40}px`,
            backgroundColor: field.style?.backgroundColor || "#000000",
            color: field.style?.color || "#ffffff",
          }}
          className="rounded-lg shadow-md"
          disabled={isLoading || isView}
        >
          {isLoading ? <Loader /> : (isEdit ? "Update" : field.label)}
        </button>
      );

    case "textarea":
      return (
        <div key={field.id} className="mb-4">
          <label className="block mb-1 font-medium">{field.label}</label>
          <textarea
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.label] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            className="w-full p-2 border rounded"
          />
          {errors[field.name] && (
            <p className="text-red-500 text-sm">{errors[field.name]}</p>
          )}
        </div>
      );

    default:
      return null;
  }
}
