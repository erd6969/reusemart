import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

import SideOrganisasi from "../Pages/Organisasi/OrganisasiSide";

const MainLayout = () => {
    return (
        <div>
            <Container className="organisasi-container">
                <div className="purchase-wrapper">
                    <SideOrganisasi />
                    <div className="purchase-container">
                    <Outlet />
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default MainLayout;