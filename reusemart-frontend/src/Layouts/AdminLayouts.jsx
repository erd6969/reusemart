import { Outlet } from "react-router-dom";

import TopNavbar from "../Components/Admin/NavbarAdmin.jsx";
import SideBarAdmin from "../Components/Admin/SideBarAdmin.jsx";
import Footer from "../Components/Footer.jsx";

const AdminLayout = () => {
    return (
        <div>
            <TopNavbar />
            <SideBarAdmin />
            <div className="mainContentAdmin" style={{ marginLeft: "250px", padding: "20px", minHeight: "100vh" }}>
                <Outlet />
            </div>
            
        </div>
    );
}

export default AdminLayout;