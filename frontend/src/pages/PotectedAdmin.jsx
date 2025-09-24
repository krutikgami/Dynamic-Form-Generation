import { Navigate } from "react-router-dom";

export default function ProtectedAdmin({ children,role }) {

  if (role === 'ADMIN') {
    return <>{children}</>;
  }

  return <Navigate to='/view' />;
}
