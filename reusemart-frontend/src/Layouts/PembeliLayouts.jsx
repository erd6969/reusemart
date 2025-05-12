import { Outlet } from "react-router-dom";
import { CartProvider } from "../Components/Context/CartContext";

import TopNavbar from "../Components/Pembeli/NavbarPembeli.jsx";
import Footer from "../Components/Footer.jsx";

const MainLayout = () => {
    return (
        <div>
            <CartProvider>
                <TopNavbar/>
                <Outlet/>
                <Footer />
            </CartProvider>
        </div>
    );
}

export default MainLayout;