const FIELD_TYPES = [
  { type: 'text', label: 'Text Input', icon: '📝' },
  { type: 'number', label: 'Number', icon: '🔢' },
  { type: 'email', label: 'Email', icon: '📧' },
  { type: 'date', label: 'Date', icon: '📅' },
  { type: 'textarea', label: 'Text Area', icon: '📄' },
  { type: 'select', label: 'Select', icon: '📋' },
  { type: 'checkbox', label: 'Checkbox Group', icon: '☑️' },
  { type: 'radio', label: 'Radio Group', icon: '⚪' },
]

function FieldPalette() {
  const handleDragStart = (e, fieldType) => {
    e.dataTransfer.setData('fieldType', fieldType)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div className="flex flex-col space-y-2">
      <h2 className="text-xl font-bold mb-4">Form Fields</h2>
      {FIELD_TYPES.map((field) => (
        <button
          key={field.type}
          className="flex items-center p-2 border border-gray-300 rounded hover:bg-gray-100 cursor-move"
          draggable
          onDragStart={(e) => handleDragStart(e, field.type)}
          title={field.label}
        >
          <span className="flex items-center content">{field.icon}</span>
          {field.label}
        </button>
      ))}
    </div>
  )
}

export default FieldPalette