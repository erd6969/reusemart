import { Outlet } from "react-router-dom";

import TopNavbar from "../Components/CustomerService/NavbarCS.jsx";
import SideBarCS from "../Components/CustomerService/SideBarCS.jsx";
import Footer from "../Components/Footer.jsx";

const CSLayout = () => {
    return (
        <div>
            <TopNavbar />
            <SideBarCS />
            <div className="mainContentCS" style={{ marginLeft: "250px", padding: "20px", minHeight: "100vh" }}>
                <Outlet />
            </div>
        </div>
    );
}

export default CSLayout;