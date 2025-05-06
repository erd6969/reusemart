import { Outlet } from "react-router-dom";
import { CartProvider } from "../Components/Context/CartContext";

import TopNavbar from "../Components/Pembeli/NavbarPembeli.jsx";

const MainLayout = () => {
    return (
        <div>
            <CartProvider>
                <TopNavbar/>
                <Outlet/>
            </CartProvider>
        </div>
    );
}

export default MainLayout;