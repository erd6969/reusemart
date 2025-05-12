import { Outlet } from "react-router-dom";

import TopNavbar from "../Components/Penitip/NavbarPenitip.jsx";
import Footer from "../Components/Footer.jsx";

const MainLayout = () => {
    return (
        <div>
            <TopNavbar/>
            <Outlet/>
            <Footer />
        </div>
    );
}

export default MainLayout;