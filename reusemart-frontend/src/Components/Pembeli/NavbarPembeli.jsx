import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import "./NavbarPembeli.css";
import profileImage from "../../assets/images/Pembeli/Yuki.jpeg";
import logoReuseMart from "../../assets/images/logo-reusemart.png";
import coin from "../../assets/images/coin-icon.png";
import { FaShoppingCart, FaChevronDown, FaBars, FaTimes } from "react-icons/fa";

const TopNavbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    return (
        <Navbar className="navBar">
            <Container fluid>
                <div className="navLeft" onClick={() => navigate("/")}>
                    <img src={logoReuseMart} alt="logo" className="logoReuseMart" />
                    <Navbar.Brand className="navTitle">ReuseMart</Navbar.Brand>
                </div>

                <Nav className="navContent">
                    <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
                    <Nav.Link onClick={() => navigate("/pembeli/shop")}>Shop</Nav.Link>
                    <Nav.Link onClick={() => navigate("/help")}>Help</Nav.Link>
                </Nav>

                <FaShoppingCart
                    className="cartIcon"
                    onClick={() => navigate("/pembeli/cart")}
                    style={{ cursor: "pointer" }}
                />
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

                    <div className={`dropdownMenu ${isDropdownOpen ? "show" : ""}`}>
                        <div className="dropdownContent">
                            <div className="pointsSection">
                                <img src={coin} alt="coin icon" />
                                <div className="pointsText">
                                    <span>Loyalty Points</span>
                                    <strong>1000 Points</strong>
                                </div>
                            </div>
                            <div className="menuSection">
                                <ul>
                                    <li>
                                        <Nav.Link onClick={() => navigate("/pembeli/profile")}>
                                            My Profile
                                        </Nav.Link>
                                    </li>
                                    <li>
                                        <Nav.Link onClick={() => navigate("/pembeli/alamat")}>
                                            My Address
                                        </Nav.Link>
                                    </li>
                                    <li>
                                        <Nav.Link onClick={() => navigate("/pembeli/purchase")}>
                                            Purchase
                                        </Nav.Link>
                                    </li>
                                </ul>
                                <hr />
                                <div className="logout">Log Out ➡</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Navbar>
    );
};

export default TopNavbar;
