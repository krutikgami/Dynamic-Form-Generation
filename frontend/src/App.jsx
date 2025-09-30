import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import Header from "./components/Header.jsx"
import BuilderPage from "./pages/BuilderPage.jsx"
import RendererPage from "./pages/RenderPage.jsx"
import ViewAllForms from "./pages/ViewAllForms.jsx"
import Login from "./pages/LoginPage.jsx"
import ProtectedAdmin from "./pages/PotectedAdmin.jsx"
import { getCookie } from "./utilities/getCookie.js"
import { decodeToken } from "./utilities/decodeToken.js"
import FormManager from "./pages/FormManager.jsx"
import FormAnalytics from "./pages/FormAnalytics.jsx"
import UserFormManager from "./pages/UserFormManager.jsx"
import ViewUserData from "./pages/ViewUserData.jsx"
import { roleAdmin,roleUser } from "./utilities/AdminPanelConstants/FieldTypes.js"


function AppLayout() {
  const token = getCookie() || null;
  const decoded = token ? decodeToken(token) : null;
  const location = useLocation()

  if (!token && location.pathname !== "/login") {
    return <Navigate to="/login" replace />
  }

  if (token && decoded?.role === roleAdmin && location.pathname === "/login") {
    return <Navigate to="/builder" replace />
  }
  if (token && decoded?.role === roleUser && location.pathname === "/login") {
    return <Navigate to="/view" replace />
  }

  const hideHeader = location.pathname === "/login"

  return (
    <div className="min-h-screen bg-gray-100">
      {!hideHeader && <Header role={decoded?.role}/>}
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/builder" element={<ProtectedAdmin role={decoded?.role}><BuilderPage token={decoded} /> </ProtectedAdmin>} />
          <Route path="/manager" element={<ProtectedAdmin role={decoded?.role}><FormManager /> </ProtectedAdmin>} />
          <Route path="/analytics" element={<ProtectedAdmin role={decoded?.role}><FormAnalytics /> </ProtectedAdmin>} />
          <Route path="/renderer" element={<ProtectedAdmin role={decoded?.role} ><RendererPage /></ProtectedAdmin>} />
          <Route path="/userrenderer" element={<RendererPage />} />
          <Route path="/view" element={<ViewAllForms role={decoded?.role}/>} />
          <Route path="/usermanager" element={<UserFormManager />} />
          <Route path="/viewData" element={<ViewUserData  role={decoded?.role}/>} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}
