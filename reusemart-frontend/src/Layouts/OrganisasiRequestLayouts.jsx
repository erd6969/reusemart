import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

import SideOrganisasi from "../Pages/Organisasi/OrganisasiSide";
import TopNavbar from "../Components/Organisasi/NavbarOrganisasi.jsx";
import Footer from "../Components/Footer.jsx";

const MainLayout = () => {
    return (
        <div>
             <TopNavbar/>
            <br />
            <Container className="organisasi-container">
                <div className="org-wrapper">
                    <SideOrganisasi />
                    <div className="org-container">
                    <Outlet />
                    </div>
                </div>
            </Container>
            <Footer />
        </div>
    );
}

export default MainLayout;