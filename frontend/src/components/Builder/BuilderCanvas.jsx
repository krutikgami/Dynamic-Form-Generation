import { useState,useCallback } from "react"
import { getDefaultLabel } from "../../utilities/AdminPanelConstants/FieldTypes.js"
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'

export default function BuilderCanvas({schema, onSchemaChange, selectedFieldId, onFieldChange}) {
   const [modalOpenId, setModalOpenId] = useState(null)
   const [dragOverIndex, setDragOverIndex] = useState(null);
   const [isDraggingField, setIsDraggingField] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);

     const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = isDraggingField ? 'move' : 'copy';
    };

    const handleDrop = useCallback((e) => {
      e.preventDefault();
      setDragOverIndex(null);
      setIsDraggingField(false);

      const fieldType = e.dataTransfer.getData("fieldType");
      const fromIndexStr = e.dataTransfer.getData("fromIndex");

      if (fieldType) {
        // Adding new field from palette
        const dropIndex = getDropIndex(e);
        addNewField(fieldType, dropIndex);
      } else if (fromIndexStr !== "") {
        // Reordering existing field
        const fromIndex = parseInt(fromIndexStr);
        const toIndex = getDropIndex(e);
        reorderField(fromIndex, toIndex);
      }
    }, [schema]);

   
   const handleFieldDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedIndex === index) {
      setDragOverIndex(null);
      return;
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const isTopHalf = e.clientY < midpoint;
    
    // Calculate the target index
    let targetIndex = isTopHalf ? index : index + 1;
    
    // Adjust if we're dragging from above
    if (draggedIndex !== null && draggedIndex < index && !isTopHalf) {
      targetIndex = index;
    }
    
    setDragOverIndex(targetIndex);
  };

  // get drop index on basis of mouse position
    const getDropIndex = useCallback((e) => {
      const dropZone = e.currentTarget;
      const fieldElements = Array.from(dropZone.querySelectorAll('.form-field-item'));
      
      if (fieldElements.length === 0) {
        return 0;
      }

      for (let i = 0; i < fieldElements.length; i++) {
        const rect = fieldElements[i].getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;

        if (e.clientY < midpoint) {
          return i;
        }
      }
      
      return fieldElements.length;
  }, [dragOverIndex]);

    const addNewField = (type, insertIndex) => {
      
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

        const newFields = [...schema.fields]
        newFields.splice(insertIndex, 0, newField);
        onSchemaChange({
        ...schema,
        fields: newFields
        })
        onFieldChange(newField.id)
    }

    const handleRemoveField = (idx) =>{
      deleteField(idx)
    }

    const reorderField = (fromIndex, toIndex) => {
    
      if (fromIndex === toIndex || fromIndex === toIndex - 1) return;

      const newFields = [...schema.fields];
      const [movedField] = newFields.splice(fromIndex, 1);
      
      const adjustedToIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
      newFields.splice(adjustedToIndex, 0, movedField);

      onSchemaChange({
        ...schema,
        fields: newFields
      });
      
      onFieldChange(movedField.id);
    }


   const handleFieldDragStart = (e, index) => {
    e.dataTransfer.setData('fromIndex', index.toString())
    e.dataTransfer.effectAllowed = 'move'
    e.stopPropagation()
    setIsDraggingField(true);
    setDraggedIndex(index);
  }

  const handleFieldDragEnd = () => {
    setDragOverIndex(null);
    setIsDraggingField(false);
    setDraggedIndex(null); 
  };

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
        <Button style={field.style} type={field.defaultBehaviour}  title={field.label}/>
      )}
      </>
    )}
    </div>
  )
}

const renderField = (field, idx) => {
  const isSelected = selectedFieldId === field.id

  return (
  <div key={field.id}>
        {dragOverIndex === idx && (
          <div className="h-1 bg-blue-500 rounded my-2 transition-all"></div>
        )}
    <div
      key={field.id}
      className={`form-field-item relative p-4 border rounded-md shadow-sm transition mb-1
        ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}`}
      onClick={() => onFieldChange(field.id)}
      draggable
      onDragStart={(e) => handleFieldDragStart(e, idx)}
      onDragEnd={handleFieldDragEnd}
      onDragOver={(e) => handleFieldDragOver(e, idx)}
    >
      <div className="absolute top-2 right-2 flex gap-2">
        <Button
          className="bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded hover:bg-red-600 text-xs cursor-pointer"
         onClickFunction={(e) => {
            e.stopPropagation();
            setModalOpenId(field.id);
          }}
          title="x"
        />

        <Modal
          isOpen={modalOpenId === field.id}
          onClose={() => setModalOpenId(null)}
          message="Are you sure you want to remove field?"
          actionButtons={[
            {
              label: "Yes",
              onClick: () => {
                handleRemoveField(idx)
                setModalOpenId(null)
              }
            }
          ]}
        />

        <div
          className="bg-blue-500 text-white w-6 h-6 flex items-center justify-center rounded cursor-grab text-sm"
          title="Drag to reorder"
        >
          ::
        </div>
      </div>
      {renderFieldPreview(field)}
    </div>
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
                />
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Form Builder</h2>
            </div>

            <div
                className="border-2 border-dashed border-gray-300 rounded-md p-6 h-[40vh] overflow-y-auto bg-gray-50"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={() => setDragOverIndex(null)}
            >
                {schema.fields.length === 0 ? (
                    <div className="border-red-50 text-gray-400 py-12 text-center">
                        Drag and drop fields here
                    </div>
                ) : (
                  <>
                    {schema.fields.map((field, idx) => renderField(field, idx))}
                    {dragOverIndex === schema.fields.length && (
                      <div className="h-1 bg-blue-500 rounded my-2 transition-all"></div>
                    )}
                  </>
                )}
            </div>
        </div>
        </>
    )
}