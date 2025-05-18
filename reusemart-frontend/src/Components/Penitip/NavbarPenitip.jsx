import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { Navbar, Container, Nav, Spinner } from "react-bootstrap";
import "../pembeli/NavbarPembeli.css";
import profileImage from "../../assets/images/Pembeli/Yuki.jpeg";
import logoReuseMart from "../../assets/images/logo-reusemart.png";
import coin from "../../assets/images/coin-icon.png";
import { FaChevronDown } from "react-icons/fa";
import { Logout } from "../../api/apiAuth";
import { ShowProfilePenitip } from "../../api/apiPenitip";
import { getThumbnailPenitip } from "../../api/index";

const TopNavbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [penitip, setPenitip] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ShowProfilePenitip();
                setPenitip(data);
            } catch (error) {
                console.error("Gagal mengambil data penitip:", error);
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
                    className="profileContainer"
                    ref={dropdownRef}
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                >
                    <div className="profileSection">
                        {penitip ? (
                            <img
                                src={getThumbnailPenitip(penitip.foto_penitip)}
                                alt="profile"
                            />
                        ) : (
                            <div style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Spinner animation="border" size="sm" />
                            </div>
                        )}
                        <div className="profileName">
                            {penitip?.nama_penitip || "Loading..."}
                        </div>
                        <FaChevronDown className="chevronIcon" />
                    </div>

                    {penitip && (
                        <div className={`dropdownMenu ${isDropdownOpen ? "show" : ""}`}>
                            <div className="dropdownContent">
                                <div className="pointsSection">
                                    <img src={coin} alt="coin icon" />
                                    <div className="pointsText">
                                        <span>Poin Loyalitas</span>
                                        <strong>{penitip.poin_loyalitas}</strong>
                                    </div>
                                </div>
                                <div className="menuSection">
                                    <ul>
                                        <br />
                                        <li>
                                            <Nav.Link onClick={() => navigate("/penitip/profile")}>
                                                Profil
                                            </Nav.Link>
                                        </li>
                                        <li>
                                            <Nav.Link onClick={() => navigate("/penitip/sold-product")}>
                                                Daftar Penitipan
                                            </Nav.Link>
                                        </li>
                                    </ul>
                                    <hr />
                                    <div
                                        className="logout"
                                        onClick={handleLogout}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Log Out ➡
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </Navbar>
    );
};

export default TopNavbar;
