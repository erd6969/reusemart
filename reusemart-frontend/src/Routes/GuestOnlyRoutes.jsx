import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GuestOnlyRoute = ({ children }) => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            if (role === "pembeli") {
                navigate("/pembeli/home");
            } else if (role === "penitip") {
                navigate("/penitip/profile");
            } else if (role === "owner") {
                navigate("/owner/req-donasi");
            } else if (role === "admin"){
                navigate("/admin/admin-organisasi-master");
            } else if (role === "gudang"){
                navigate("/pegawai-gudang/penitipan-barang");
            } else if (role === "cs"){
                navigate("/customerservice/penitip-management");
            } else if (role === "organisasi"){
                navigate("/organisasi/request-donasi");
            }
        }else{
            
        }
    }, [token, navigate]);

    return children;
};

export default GuestOnlyRoute;
