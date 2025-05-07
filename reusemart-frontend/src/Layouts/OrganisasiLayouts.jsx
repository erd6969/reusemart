import { Outlet } from "react-router-dom";

import TopNavbar from "../Components/Organisasi/NavbarOrganisasi.jsx";
// import SideBarOrganisasi from "../Components/Organisasi/SideBarOrganisasi.jsx";

const OrganisasiLayout = () => {
    return (
        <div>
            <TopNavbar />
            {/* <SideBarOrganisasi /> */}
                <Outlet />
            
        </div>
    );
}

export default OrganisasiLayout;