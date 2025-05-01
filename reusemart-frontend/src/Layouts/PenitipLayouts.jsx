import { Outlet } from "react-router-dom";

import TopNavbar from "../Components/Penitip/NavbarPenitip.jsx";

const MainLayout = () => {
    return (
        <div>
            <TopNavbar/>
            <Outlet/>
        </div>
    );
}

export default MainLayout;