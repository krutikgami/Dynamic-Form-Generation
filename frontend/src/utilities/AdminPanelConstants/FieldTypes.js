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

const properties = {
    width: "40px",
    height: "20px",
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: "6px",
    padding: "4px 8px",
    margin: "10px",
    fontSize: "14px",
    fontWeight: "bold",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0px 2px 6px rgba(0,0,0,0.2)"
  }

export const giveCss = () => {
    return properties;
}

export const tableHeads = [
        "ID",
        "Title",
        "Description",
        "Status",
        "SubmissionLimit",
        "StartDate",
        "EndDate",
        "CreatedAt",
        "TotalViews",
        "TotalSubmissions",
      ]
export const roleAdmin  = 'ADMIN'
export const roleUser = 'USER'
export const defaultDate = '01/01/1970'

export const dateLimit = 'No Limit'
export const MaxSubmissions = 'Unlimited'
export const getFormService = {
   analytics: 'Analytics',
   manager : "Manager",
   renderer: "Renderer"
}

export const formStatusFilter = [
  {Draft : "DRAFT"},
  {Active : "ACTIVE"},
  {Inactive : "INACTIVE"}
]

export const createField = 'created_at'
export const createFieldSmall = 'createdat'

export const formAnalyticsTableHeadings = ['ID','Email',"Name","CreatedAt"]

export const Page = 1
export const Limit = 6