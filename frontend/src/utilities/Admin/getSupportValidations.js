
export function getSupportedValidations(fieldType) {
  const validations = [
    {
      name: 'required',
      label: 'Required',
      defaultMessage: 'This field is required',
      hasValue: false
    }
  ]

  if (['text', 'email', 'textarea'].includes(fieldType)) {
    validations.push(
      {
        name: 'minLength',
        label: 'Minimum Length',
        defaultMessage: 'Too short',
        hasValue: true,
        valueType: 'number'
      },
      {
        name: 'maxLength',
        label: 'Maximum Length',
        defaultMessage: 'Too long',
        hasValue: true,
        valueType: 'number'
      },
      {
        name: 'pattern',
        label: 'Pattern (Regex)',
        defaultMessage: 'Invalid format',
        hasValue: true,
        valueType: 'text'
      }
    )
  }

  if (['number', 'date'].includes(fieldType)) {
    validations.push(
      {
        name: 'min',
        label: 'Minimum Value',
        defaultMessage: 'Value too small',
        hasValue: true,
        valueType: fieldType === 'date' ? 'date' : 'number'
      },
      {
        name: 'max',
        label: 'Maximum Value',
        defaultMessage: 'Value too large',
        hasValue: true,
        valueType: fieldType === 'date' ? 'date' : 'number'
      }
    )
  }

  return validations
}
