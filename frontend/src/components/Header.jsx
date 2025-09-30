import { NavLink, useNavigate } from "react-router-dom"
import Cookie from "js-cookie"
import {roleAdmin} from '../utilities/AdminPanelConstants/FieldTypes.js'
import { useToast } from "./ToastContainerUtility/ToastContainer.jsx"
export default function Header({role}) {
  const {showToast} = useToast();
  const navigate = useNavigate();
  const adminTabs = [
    { id: "builder", label: "Builder", path: "/builder" },
    { id: "renderer", label: "Renderer", path: "/view" },
    { id: "manager", label: "Manager", path: "/manager" },
    {id: "analytics", label: "Analytics",path: "/analytics"}
  ]

  const userTabs = [
    { id: "renderer", label: "Renderer", path: "/view" },
    { id: "manager", label: "Manager", path: "/usermanager" },
  ]

  const selectedTab = role === roleAdmin ? adminTabs : userTabs
  
  return (
    <header className="flex items-center justify-between bg-gray-800 px-6 py-4 shadow-md">
      <h1 className="text-2xl font-bold text-white">Dynamic Form Builder</h1>

      <nav className="flex space-x-4">
        {selectedTab.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-sm font-medium transition ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
        <NavLink
          onClick={() => {
            Cookie.remove('authTokenClient');
            Cookie.remove('authToken');
            showToast("User Logout Successfully",true)
            navigate('/login')
          }}
          className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition"
        >
          Logout
        </NavLink>
      </nav>
    </header>
  )
}
