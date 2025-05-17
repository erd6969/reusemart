import { useNavigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const ProtectedRoutes = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    if (!token) {
      navigate("/auth/login");
    } else if (!allowedRoles.includes(role)) {
      if (role === "pembeli") {
        navigate("/pembeli/home");
      } else if (role === "penitip") {
        navigate("/penitip/profile");
      } else if (role === "owner") {
        navigate("/owner/req-donasi");
      } else if (role === "admin") {
        navigate("/admin/admin-organisasi-master");
      } else if (role === "gudang") {
        navigate("/pegawai-gudang/penitipan-barang");
      } else if (role === "cs") {
        navigate("/customerservice/penitip-management");
      } else if (role === "organisasi") {
        navigate("/organisasi/request-donasi");
      }
    } else {
      setIsAllowed(true);
    }
  }, [navigate, allowedRoles]);

  return isAllowed ? children : null;
};

export default ProtectedRoutes;
