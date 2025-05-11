import { Outlet } from "react-router-dom";

import TopNavbar from "../Components/Guest/NavbarLogin.jsx";

const GuestLayouts = () => {
    return (
        <div>
            <TopNavbar />
            <Outlet />
        </div>
    );
}

export default GuestLayouts;