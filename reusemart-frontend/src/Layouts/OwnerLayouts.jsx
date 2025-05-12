import { Outlet } from "react-router-dom";

import TopNavbar from "../Components/Owner/NavbarOwner.jsx";
import SideBarOwner from "../Components/Owner/SideBarOwner.jsx";
import Footer from "../Components/Footer.jsx";

const OwnerLayout = () => {
    return (
        <div>
            <TopNavbar />
            <SideBarOwner />
            <div className="mainContentOwner" style={{ marginLeft: "250px", padding: "20px", minHeight: "100vh" }}>
                <Outlet />
            </div>
        </div>
    );
}

export default OwnerLayout;