import { useNavigate, Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const ProtectedRoutes = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    if (!token) {
        navigate("/auth/login");
    } else if (!allowedRoles.includes(role)) {
      setIsAllowed(false);
      navigate(-1);
    } else {
      setIsAllowed(true);
    }
  }, [navigate, allowedRoles]);

  return isAllowed ? (children ? children : <Outlet />) : null;
};

export default ProtectedRoutes;
