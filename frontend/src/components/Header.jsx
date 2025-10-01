import { NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"
import Cookie from "js-cookie"
import {roleAdmin} from '../utilities/AdminPanelConstants/FieldTypes.js'
import { useToast } from "./ToastContainerUtility/ToastContainer.jsx"
import Button from '../components/common/Button.jsx'
import Modal from '../components/common/Modal.jsx'

export default function Header({role}) {
  const {showToast} = useToast();
  const [isOpen,setIsOpen] = useState(false);

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

  const handleLogout = ()=>{
    Cookie.remove('authTokenClient');
    Cookie.remove('authToken');
    showToast("User Logout Successfully",true)
    navigate('/login')
  }
  
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
        <Button
          title="Logout"
          onClickFunction={()=>setIsOpen(true)}
          className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition"
        />
        <Modal 
          isOpen={isOpen}
          message="Are you sure you want to Logout?"
          onClose={()=>setIsOpen(false)}
          actionButtons={[
            {
              label: "Logout",
              className: "bg-red-500 text-white hover:bg-red-600",
              onClick: handleLogout
            }
          ]}
        />
      </nav>
    </header>
  )
}
