import { useCallback } from "react"
import { getDefaultLabel } from "../../utilities/AdminPanelConstants/FieldTypes.js"
import { useNavigate } from "react-router-dom"

export default function BuilderCanvas({schema, onSchemaChange, selectedFieldId, onFieldChange,onhandleSave}) {
  const navigate = useNavigate();
    const handleDragOver = (e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
    }

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        const fieldType = e.dataTransfer.getData("fieldType")
        const fromIndex = e.dataTransfer.getData("fromIndex")

        if (fieldType) {
            addNewField(fieldType)
        } else if (fromIndex !== "") {
            const fields = e.currentTarget.querySelectorAll(".form-canvas")
            const toIndex = getDropIndex(fields, e.clientY)
            reorderField(parseInt(fromIndex), toIndex)
        }
    }, [schema, onSchemaChange, onFieldChange])


    const getDropIndex = (fields, clientY) => {
        for (let i = 0; i < fields.length; i++) {
            const rect = fields[i].getBoundingClientRect()
            const midpoint = rect.top + rect.height / 2

            if (clientY < midpoint) {
            return i
            }
        }
        return fields.length
    }

    const addNewField = (type)=>{
      
        const newField = {
            id: `field_${Date.now()}`,
            type,
            label: getDefaultLabel(type),
            name: `${type}_${Date.now()}`,
            placeholder: `Enter ${getDefaultLabel(type).toLowerCase()}`,
            options: type === 'select' || type === 'radio' || type === 'checkbox' 
                ? ['Option 1', 'Option 2'] 
                : [],
            validations: {
                required: { value: false, message: 'This field is required' }
            }
        }

        const newFields = [...schema.fields, newField]
        onSchemaChange({
        ...schema,
        fields: newFields
        })
        onFieldChange(newField.id)
    }

    const reorderField = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return

    const newFields = [...schema.fields]
    const [movedField] = newFields.splice(fromIndex, 1)
    newFields.splice(toIndex, 0, movedField)

    onSchemaChange({
      ...schema,
      fields: newFields
    })
  }

  const handleFieldDragStart = (e, index) => {
    e.dataTransfer.setData('fromIndex', index.toString())
    e.dataTransfer.effectAllowed = 'move'
    e.stopPropagation()
  }

  const deleteField = (index) => {
    const newFields = schema.fields.filter((_, i) => i !== index)
    onSchemaChange({
      ...schema,
      fields: newFields
    })
    
    if (selectedFieldId === schema.fields[index]?.id) {
      onFieldChange(null)
    }
  }
   //TODO: renderFieldPreview for temp purpose remove after working and add make new component

const renderFieldPreview = (field) => {
  const commonProps = {
    placeholder: field.placeholder || '',
    disabled: true,
    className:
      "w-full border rounded-md px-3 py-2 text-sm text-gray-600 bg-white cursor-not-allowed",
  }

  return (
    <div className="space-y-2">
     {field.type !== 'button' ? (
        <>
      <label className="block text-sm font-semibold text-gray-800">
        {field.label}
      </label>

      {field.type === 'textarea' && (
        <textarea {...commonProps} rows={3} />
      )}

      {field.type === 'select' && (
        <select {...commonProps}>
          <option value="">Select an option</option>
          {field.options.map((option, i) => (
            <option key={i} value={option}>{option}</option>
          ))}
        </select>
      )}

      {(field.type === 'checkbox' || field.type === 'radio') && (
        <div className="space-y-1">
          {field.options.map((option, i) => (
            <label
              key={i}
              className="flex items-center space-x-2 text-sm text-gray-700"
            >
              <input
                type={field.type}
                name={field.name}
                value={option}
                disabled
                className="h-4 w-4 text-blue-600 border-gray-300 rounded disabled:bg-gray-200"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}

      {['text', 'number', 'email', 'date'].includes(field.type) && (
        <input type={field.type} {...commonProps} />
      )}
      </>
     ) : (
        <>
      {field.type === 'button' &&(
        <button style={field.style} type={field.defaultBehaviour}>{field.label}</button>
      )}
      </>
    )}
    </div>
  )
}

const renderField = (field, idx) => {
  const isSelected = selectedFieldId === field.id

  return (
    <div
      key={field.id}
      className={`form-canvas relative p-4 border rounded-md shadow-sm transition mb-1
        ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}`}
      onClick={() => onFieldChange(field.id)}
      draggable
      onDragStart={(e) => handleFieldDragStart(e, idx)}
    >
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          className="bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded hover:bg-red-600 text-xs cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            deleteField(idx)
          }}
          title="Delete field"
        >
          ×
        </button>

        <div
          className="bg-blue-500 text-white w-6 h-6 flex items-center justify-center rounded cursor-grab text-sm"
          title="Drag to reorder"
        >
          ::
        </div>
      </div>
      {renderFieldPreview(field)}
    </div>
  )
}


    return(
        <>
        <div>
            <div className="mb-6 space-y-4 bg-white p-4 rounded-lg shadow">
                <input
                className="w-full text-2xl font-bold border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                name="title"
                value={schema.title}
                placeholder="Enter your form title"
                onChange={(e) =>
                    onSchemaChange({
                    ...schema,
                    title: e.target.value,
                    })
                }
                />

                <textarea
                className="w-full text-gray-700 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="description"
                value={schema.description}
                placeholder="Enter your description (optional)"
                rows={3}
                onChange={(e) =>
                    onSchemaChange({
                    ...schema,
                    description: e.target.value,
                    })
                }
                ></textarea>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Form Builder</h2>
            </div>

            <div
                className="border-2 border-dashed border-gray-300 rounded-md p-6 h-[40vh] overflow-y-auto bg-gray-50"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                {schema.fields.length === 0 ? (
                    <div className="border-red-50 text-gray-400 py-12 text-center">
                        Drag and drop fields here
                    </div>
                ) : (
                    schema.fields.map((field,idx)=>renderField(field,idx))
                )}
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button className="bg-blue-600 text-white w-22 h-10 rounded-2xl mb-0 cursor-pointer" onClick={()=>{
                navigate('/renderer',{state : {schema : schema , isPreview : true}})
              }}>Preview</button>
              <button className="bg-green-600 text-white w-22 h-10 rounded-2xl mb-0 cursor-pointer" onClick={onhandleSave}>Save Form</button>
            </div>
        </div>
        </>
    )
}