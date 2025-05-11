import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { Navbar, Container, Nav, Spinner} from "react-bootstrap";
import "./NavbarOrganisasi.css";
import logoReuseMart from "../../assets/images/logo-reusemart.png";
import { FaChevronDown } from "react-icons/fa";
import { Logout } from "../../api/apiAuth";
import { GetProfile } from "../../api/apiOrganisasi";
import { getThumbnailOrganisasi } from "../../api/index";

const TopNavbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [organisasi, setOrganisasi] = useState(null);

    useEffect(() => {
            const fetchData = async () => {
                try {
                    const data = await GetProfile();
                    setOrganisasi(data);
                } catch (error) {
                    console.error("Gagal mengambil data Organisasi:", error);
                }
            };
    
            fetchData();
        }, []);
        
    const handleLogout = async () => {
        try {
            await Logout();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            navigate("/auth/login");
        }
    };

    return (
        <Navbar className="navBar">
            <Container fluid>
                <div className="navLeft" onClick={() => navigate("/")}>
                    <img src={logoReuseMart} alt="logo" className="logoReuseMart" />
                    <Navbar.Brand className="navTitle">ReuseMart</Navbar.Brand>
                </div>
                <div
                    className="profile-container-org"
                    ref={dropdownRef}
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                >
                    <div className="profileSection">
                        <div className="profileSection">
                            {organisasi ? (
                                <img
                                    src={getThumbnailOrganisasi(organisasi.foto_organisasi)}
                                    alt="profile"
                                />
                            ) : (
                                <div style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Spinner animation="border" size="sm" />
                                </div>
                            )}
                            <div className="profileName">
                                {organisasi?.nama_organisasi || "Loading..."}
                            </div>
                            <FaChevronDown className="chevronIcon" />
                        </div>
                    </div>

                    <div className={`dropdownMenuOrganisasi ${isDropdownOpen ? "show" : ""}`}>
                        <div className="dropdownContent">
                            <div className="menuSection">
                                <ul>
                                    <li>
                                        <Nav.Link onClick={() => navigate("/organisasi/profile")}>
                                            My Profile
                                        </Nav.Link>
                                    </li>
                                    <li>
                                        <Nav.Link onClick={() => navigate("/organisasi/request-donasi")}>
                                            Donation
                                        </Nav.Link>
                                    </li>
                                </ul>
                                <div className="logout" onClick={handleLogout} style={{ cursor: "pointer" }}>
                                    Log Out ➡
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Navbar>
    );
};

export default TopNavbar;
