import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import "../pembeli/NavbarPembeli.css";
import "./NavbarOwner.css";
import profileImage from "../../assets/images/Pembeli/Yuki.jpeg";
import logoReuseMart from "../../assets/images/logo-reusemart.png";
import coin from "../../assets/images/coin-icon.png";
import { FaShoppingCart, FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import { Logout } from "../../api/apiAuth";

const TopNavbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    
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
                        <img src={profileImage} alt="profile" />
                        <div className="profileName">Yuki Suou</div>
                        <FaChevronDown className="chevronIcon" />
                    </div>

                    <div className={`dropdownMenuOwner ${isDropdownOpen ? "show" : ""}`}>
                        <div className="dropdownContent">
                            <div className="menuSection">
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
