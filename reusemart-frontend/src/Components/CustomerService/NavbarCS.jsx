import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Navbar, Container, Spinner } from "react-bootstrap";
import "../pembeli/NavbarPembeli.css";
import "./NavbarCS.css";
import logoReuseMart from "../../assets/images/logo-reusemart.png";
import { FaChevronDown } from "react-icons/fa";
import { Logout } from "../../api/apiAuth";

import { GetProfile } from "../../api/apiPegawai";
import { getThumbnailPegawai } from "../../api";

const TopNavbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [profile, setProfile] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const handleLogout = async () => {
        try {
            await Logout();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            navigate("/auth/login");
        }
    };

    const showProfile = async () => {
        try {
            setIsLoading(true);
            const data = await GetProfile();
            setProfile(data);
        } catch (error) {
            console.error("Error fetching profile", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        showProfile();
    }, []);

    return (
        <Navbar className="navBar">
            <Container fluid>
                <div className="navLeft" onClick={() => navigate("/")}>
                    <img src={logoReuseMart} alt="logo" className="logoReuseMart" />
                    <Navbar.Brand className="navTitle">ReuseMart</Navbar.Brand>
                </div>
                <div
                    className="profileContainer"
                    ref={dropdownRef}
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                >
                    {isLoading ? (
                        <div style={{ textAlign: "center" }}>
                            <Spinner
                                as="span"
                                animation="border"
                                variant="primary"
                                size="lg"
                                role="status"
                                aria-hidden="true"
                            />
                        </div>
                    ) : (
                        <>
                            <div className="profileSection">
                                <img src={getThumbnailPegawai(profile.foto_pegawai)} alt="profile" />
                                <div className="profileName">{profile.nama_pegawai}</div>
                                <FaChevronDown className="chevronIcon" />
                            </div>

                            <div className={`dropdownMenuAdmin ${isDropdownOpen ? "show" : ""}`}>
                                <div className="dropdownContent">
                                    <div className="menuSection">
                                        <div className="logout" onClick={handleLogout} style={{ cursor: "pointer" }}>
                                            Log Out ➡
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Container>
        </Navbar>
    );
};

export default TopNavbar;
