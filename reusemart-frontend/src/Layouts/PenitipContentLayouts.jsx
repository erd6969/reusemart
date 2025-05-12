import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

import SidePenitip from "../Pages/Penitip/PenitipSide";
import Footer from "../Components/Footer.jsx";

const MainLayout = () => {
    return (
        <div>
            <Container className="penitip-container">
                <div className="histori-penitipan-wrapper">
                    <SidePenitip />
                    <div className="sold-products-container">
                    <Outlet />
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default MainLayout;