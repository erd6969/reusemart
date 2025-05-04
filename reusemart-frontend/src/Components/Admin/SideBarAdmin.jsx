import "./SideBarAdmin.css";
import { useNavigate } from "react-router-dom";
import { FaUserCog, FaUsersCog, FaBoxOpen, FaKey } from "react-icons/fa";

const SideBarAdmin = () => {
    const navigate = useNavigate();
    return (
        <div className="sidebarAdmin">
            <div className="sidebarContentAdmin">
                <div className="sidebarTitleAdmin">Halaman Admin</div>
                <ul className="sidebarMenuAdmin">
                    <li className="sidebarItemAdmin" onClick={() => navigate("/admin/admin-organisasi-master")}>
                        <FaUsersCog className="sidebarIcon" /> Master Organisasi
                    </li>
                    <li className="sidebarItemAdmin" onClick={() => navigate("/admin/admin-pegawai-master")}>
                        <FaUserCog className="sidebarIcon" /> Master Pegawai
                    </li>
                    <li className="sidebarItemAdmin" onClick={() => navigate("/admin/orders")}>
                        <FaBoxOpen className="sidebarIcon" /> Master Merchandise
                    </li>
                    <li className="sidebarItemAdmin" onClick={() => navigate("/admin/admin-reset-password")}>
                        <FaKey className="sidebarIcon" /> Reset Password
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideBarAdmin;
