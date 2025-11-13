import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export const useRoleProtection = (allowedRoles: ("user" | "admin")[]) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && currentUser) {
      // If user role is not in allowed roles, redirect them
      if (!allowedRoles.includes(currentUser.role as "user" | "admin")) {
        if (currentUser.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } else if (!loading && !currentUser) {
      // If not logged in, redirect to login
      navigate("/login");
    }
  }, [currentUser, loading, navigate, allowedRoles]);

  return { currentUser, loading };
};