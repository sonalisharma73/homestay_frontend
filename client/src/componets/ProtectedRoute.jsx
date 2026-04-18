import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const storedRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  // 🚫 Not logged in
  if (!storedRole || !userId) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Role mismatch (for host/guest restriction)
  if (role && storedRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}