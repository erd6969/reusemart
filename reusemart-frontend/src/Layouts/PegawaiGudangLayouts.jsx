import { Outlet } from "react-router-dom";

import TopNavbar from "../Components/PegawaiGudang/NavbarPegawaiGudang.jsx";
import SideBarPegawaiGudang from "../Components/PegawaiGudang/SideBarPegawaiGudang.jsx";
import Footer from "../Components/Footer.jsx";

const PegawaiGudangLayout = () => {
    return (
        <div>
            <TopNavbar />
            <SideBarPegawaiGudang />
            <div className="mainContentPegawaiGudang" style={{ marginLeft: "250px", padding: "20px", minHeight: "100vh" }}>
                <Outlet />
            </div>
            
        </div>
    );
}

export default PegawaiGudangLayout;