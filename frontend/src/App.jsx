import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Header from "./components/Header.jsx"
import BuilderPage from "./pages/BuilderPage.jsx"
import RendererPage from "./pages/RenderPage.jsx"
import ViewAllForms from "./pages/ViewAllForms.jsx"
import Login from "./pages/LoginPage.jsx"
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div >
          <Routes>
            <Route path="/" element={<Navigate to="/builder" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="/renderer" element={<RendererPage />} />
            <Route path="/view" element={<ViewAllForms />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
