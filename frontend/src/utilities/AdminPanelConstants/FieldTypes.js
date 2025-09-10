export const FIELD_TYPES = [
  { type: 'text', label: 'Text Input', icon: '📝' },
  { type: 'number', label: 'Number', icon: '🔢' },
  { type: 'email', label: 'Email', icon: '📧' },
  { type: 'date', label: 'Date', icon: '📅' },
  { type: 'textarea', label: 'Text Area', icon: '📄' },
  { type: 'select', label: 'Select', icon: '📋' },
  { type: 'checkbox', label: 'Checkbox Group', icon: '☑️' },
  { type: 'radio', label: 'Radio Group', icon: '⚪' },
  {type: 'button', label: 'Button', icon: '✅'}
]


export const getDefaultLabel = (type) => {
    const labels = {
      text: 'Text Field',
      number: 'Number Field',
      email: 'Email Field',
      date: 'Date Field',
      textarea: 'Text Area',
      select: 'Select Field',
      checkbox: 'Checkbox Group',
      radio: 'Radio Group',
      button: 'Button'
    }
    return labels[type] || 'Field'
}