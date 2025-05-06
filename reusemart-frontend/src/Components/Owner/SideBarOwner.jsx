import "./SideBarOwner.css";
import { useNavigate } from "react-router-dom";
import { FaUserCog, FaUsersCog, FaBoxOpen, FaKey } from "react-icons/fa";

const SideBarOwner = () => {
    const navigate = useNavigate();
    return (
        <div className="sidebarOwner">
            <div className="sidebarContentOwner">
                <div className="sidebarTitleOwner">Halaman Owner</div>
                <ul className="sidebarMenuOwner">
                    <li className="sidebarItemOwner" onClick={() => navigate("/owner/req-donasi")}>
                        <FaUsersCog className="sidebarIcon" /> Daftar Request Donasi
                    </li>
                    <li className="sidebarItemOwner" onClick={() => navigate("/owner/history-donasi")}>
                        <FaUserCog className="sidebarIcon" /> History Donasi
                    </li>
                    <li className="sidebarItemOwner" onClick={() => navigate("/owner/laporan")}>
                        <FaBoxOpen className="sidebarIcon" /> Laporan
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideBarOwner;
