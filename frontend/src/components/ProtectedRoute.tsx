import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "./AppLayout";

interface Props {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly }: Props) {
  const { user, token, initialized } = useAuth();

  if (!initialized) return null;

  if (!token || !user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "ADMIN")
    return <Navigate to="/dashboard" replace />;
  return <AppLayout>{children}</AppLayout>;
}
