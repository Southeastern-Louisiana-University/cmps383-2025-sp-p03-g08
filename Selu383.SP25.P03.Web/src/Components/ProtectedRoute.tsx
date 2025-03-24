import { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import { routes } from "../routes/routeIndex";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { user } = useAuth();
  if (!user || !user.roles.includes("Admin")) {
    return <Navigate to={routes.home} />;
  }
  return <>{children}</>;
}
