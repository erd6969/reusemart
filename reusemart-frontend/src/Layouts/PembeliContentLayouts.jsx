import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

import SidePembeli from "../Pages/Pembeli/PembeliSide";
import Footer from "../Components/Footer.jsx";

const MainLayout = () => {
    return (
        <div>
            <Container className="pembeli-container">
                <div className="purchase-wrapper">
                    <SidePembeli />
                    <div className="purchase-container">
                    <Outlet />
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default MainLayout;