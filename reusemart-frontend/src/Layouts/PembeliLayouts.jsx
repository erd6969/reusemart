import { Outlet } from "react-router-dom";

import TopNavbar from "../Components/Pembeli/NavbarPembeli.jsx";

const routes = [
    {
        path: "/",
        name: "Home",
    },
    {
        path: "/shop",
        name: "Shop",
    },
    {
        path: "/help",
        name: "Help",
    }
];

const MainLayout = () => {
    return (
        <div>
            <TopNavbar routes={routes} />
            <Outlet/>
        </div>
    );
}

export default MainLayout;