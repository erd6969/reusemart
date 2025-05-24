import "./SideBarCS.css";
import { useNavigate } from "react-router-dom";
import { FaUserCog, FaUsersCog, FaBoxOpen, FaKey } from "react-icons/fa";

const SideBarCS = () => {
    const navigate = useNavigate();
    return (
        <div className="sidebarCS">
            <div className="sidebarContentCS">
                <div className="sidebarTitleCS">Halaman CS</div>
                <ul className="sidebarMenuCS">
                    <li className="sidebarItemCS" onClick={() => navigate("/customerservice/penitip-management")}>
                        <FaUsersCog className="sidebarIcon" /> Penitip Management
                    </li>
                    <li className="sidebarItemCS" onClick={() => navigate("/customerservice/verifikasi-bukti")}>
                        <FaUserCog className="sidebarIcon" /> Payment Verification
                    </li>
                    <li className="sidebarItemCS" onClick={() => navigate("/customerservice/klaim-merchandise")}>
                        <FaBoxOpen className="sidebarIcon" /> Merchandise
                    </li>
                    <li className="sidebarItemCS" onClick={() => navigate("/customerservice/discussion")}>
                        <FaKey className="sidebarIcon" /> discussion
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideBarCS;
