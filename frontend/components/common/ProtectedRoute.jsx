// Skyddar sidor som kräver inloggning. Används som omslag runt rutterna i App.jsx.
// Utloggade skickas till /login, och sidan de ville till sparas så att de kommer tillbaka efter inloggning.
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

export default function ProtectedRoute() {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
