import { Outlet } from "react-router-dom";

import TopNavbar from "../Components/Guest/NavbarLogin.jsx";
import Footer from "../Components/Footer.jsx";

const GuestLayouts = () => {
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <div style={{ flexShrink: 0 }}>
                    <TopNavbar />
                </div>

                <main style={{ flexGrow: 1 }}>
                    <Outlet />
                </main>

                <div style={{ flexShrink: 0 }}>
                    <Footer />
                </div>
            </div>
        </>
    );
}

export default GuestLayouts;