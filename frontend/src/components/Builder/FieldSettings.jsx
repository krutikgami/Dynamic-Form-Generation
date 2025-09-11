import { useState,useEffect } from "react"
import { getSupportedValidations } from "../../utilities/Admin/getSupportValidations.js"
import  {giveCss} from '../../utilities/AdminPanelConstants/FieldTypes.js'
export default function FieldSettings({schema,onschemaChange,selectedFieldId}) {

  const [style ,setStyle] = useState(null)
  useEffect(()=>{
    const cssProp = giveCss();
    setStyle(cssProp)
  },[])

  useEffect(()=>{
    updateField({style})
  },[style])

   const selectedField = schema.fields.find(f => f.id === selectedFieldId)

  const updateField = (updates) => {
    const newFields = schema.fields.map(field => 
      field.id === selectedFieldId 
        ? { ...field, ...updates }
        : field
    )
    
    onschemaChange({
      ...schema,
      fields: newFields
    })
  }

  const updateValidation = (rule, updates) => {
    const newValidations = {
      ...selectedField.validations,
      [rule]: updates
    }
    
    updateField({ validations: newValidations })
  }

  const addOption = () => {
    const newOptions = [...(selectedField.options || []), '']
    updateField({ options: newOptions })
  }

  const updateOption = (index, value) => {
    const newOptions = [...selectedField.options]
    newOptions[index] = value
    updateField({ options: newOptions })
  }

  const removeOption = (index) => {
    const newOptions = selectedField.options.filter((_, i) => i !== index)
    updateField({ options: newOptions })
  }
  if(!selectedField){
    return(
        <div>
           <h2 className="text-xl font-bold mb-4">Field Settings</h2>
           <p>Please select Field</p> 
        </div>
    )
  }
  const hasOptions = ['select', 'radio', 'checkbox'].includes(selectedField.type)
  const supportedValidations = getSupportedValidations(selectedField.type)

return (
  <div className="p-4 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-bold mb-4">Field Settings</h2>
          <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Label</label>
              <input
              type="text"
              value={selectedField.label || ''}
              onChange={(e) => updateField({ label: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
          </div>
        {selectedField.type !== 'button' &&(
          <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Placeholder</label>
              <input
              type="text"
              value={selectedField.placeholder || ''}
              onChange={(e) => updateField({ placeholder: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
          </div>
        )}
      {/* options for radio and checkbox */}
          {hasOptions && (
              <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Options</label>
              <div className="space-y-2">
                  {(selectedField.options || []).map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                      <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded hover:bg-red-600 text-xs cursor-pointer"
                      >
                      x
                      </button>
                  </div>
                  ))}
                  <button
                  type="button"
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  onClick={addOption}
                  >
                  +
                  </button>
              </div>
              </div>
          )}


      { /* fieldType Validaions Div*/}
      {selectedField.type !== 'button' &&(
          <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Validations</label>
              {supportedValidations.map((validation) => (
              <div key={validation.name} className="space-y-2 border rounded-md p-3 bg-gray-50">
                  <div className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      checked={selectedField.validations?.[validation.name]?.value || false}
                      onChange={(e) =>
                      updateValidation(validation.name, {
                          value: e.target.checked,
                          message:
                          selectedField.validations?.[validation.name]?.message ||
                          validation.defaultMessage,
                      })
                      }
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700">{validation.label}</label>
                  </div>

                  {selectedField.validations?.[validation.name]?.value && (
                  <div className="space-y-2 pl-6">
                      {validation.hasValue && (
                      <input
                          type={validation.valueType || 'text'}
                          placeholder="Value"
                          value={selectedField.validations[validation.name].ruleValue || ''}
                          onChange={(e) =>
                          updateValidation(validation.name, {
                              ...selectedField.validations[validation.name],
                              ruleValue: e.target.value,
                          })
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      )}
                      <input
                      type="text"
                      placeholder="Custom error message"
                      value={selectedField.validations[validation.name].message || ''}
                      onChange={(e) =>
                          updateValidation(validation.name, {
                          ...selectedField.validations[validation.name],
                          message: e.target.value,
                          })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                  </div>
                  )}
              </div>
              ))}
          </div>    
      )}
        <div className="flex flex-wrap space-y-1">
          <label className="block font-medium text-gray-700">Style</label>
          <div>
          <textarea
            rows={10}
            cols={40}
            className="bg-black text-white w-full"
            value={style ? JSON.stringify(style) : ""}
            onChange={(e) => {
                setStyle(JSON.parse(e.target.value));
            }}
          />
          </div>
              {/* <label className="block font-medium text-gray-700">Style</label>
              <div className="flex flex-wrap mb-2">
                <label className="text-sm text-gray-700">Width</label>
                <input type="number" name="width" placeholder="Width in px" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" onChange={(e)=>setStyle({...style,width: e.target.value})}/>
                <label className="text-sm text-gray-700">Height</label>
                <input type="number" name="height" placeholder="Height in px" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" onChange={(e)=>setStyle({...style,height:e.target.value})}/>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap space-x-9">
                <label className="text-sm text-gray-700">Bg Color</label>
                <input type="color" name="bg" className="w-20 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" onChange={(e)=>setStyle({...style,backgroundColor:e.target.value})}/>
                </div>
                <div className="flex flex-wrap space-x-7">
                <label className="text-sm text-gray-700">Text Color</label>
                <input type="color" name="text" className="w-20 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" onChange={(e)=>setStyle({...style,color:e.target.value})}/>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700">Default Behaviour</label>
                <select name="default"  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" onChange={(e)=>updateField({defaultBehaviour:e.target.value})}>
                  <option value="">Select Behaviour</option>
                  <option value="submit">submit</option>
                  <option value="reset">reset</option>
                </select>
              </div> */}
        </div>
  </div>
)
} 