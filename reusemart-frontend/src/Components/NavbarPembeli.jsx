import { useNavigate } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import './NavbarPembeli.css';
import profileImage from '../assets/images/Pembeli/Yuki.jpeg';
import logoReuseMart from '../assets/images/logo-reusemart.png';
import coin from '../assets/images/coin-icon.png';
import { FaShoppingCart, FaChevronDown } from "react-icons/fa";

const TopNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    return (
        <Navbar className="navBar">
            <Container fluid>
                <img src={logoReuseMart} alt="logo" className="logoReuseMart" onClick={() => navigate('/')} />
                <Navbar.Brand className="navTitle" onClick={() => navigate('/')}>ReuseMart</Navbar.Brand>
                
                <Nav className="me-auto navContent justify-content-center">
                    <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
                    <Nav.Link onClick={() => navigate("/shop")}>Shop</Nav.Link>
                    <Nav.Link onClick={() => navigate("/help")}>Help</Nav.Link>
                </Nav>

                <FaShoppingCart className="cartIcon" />
                
                <div 
                    className="profileContainer"
                    ref={dropdownRef}
                    onMouseEnter={() => setIsOpen(true)} // Muncul saat hover
                    onMouseLeave={() => setIsOpen(false)} // Hilang saat keluar hover
                    onClick={() => setIsOpen((prev) => !prev)} // Bisa juga dibuka dengan klik
                >
                    <div className="profileSection">
                        <img src={profileImage} alt="profile" />
                        <div className="profileName">Yuki Suou</div>
                        <FaChevronDown className="chevronIcon" />
                    </div>

                    {isOpen && (
                        <div className="dropdownMenu">
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
                                        <li><Nav.Link  onClick={() => navigate("/pembeli/profile")}>My Profile</Nav.Link></li>
                                        <li><Nav.Link  onClick={() => navigate("/pembeli/alamat")}>My Address</Nav.Link></li>
                                        <li><Nav.Link  onClick={() => navigate("/pembeli/purchase")}>Purchase</Nav.Link></li>
                                    </ul>
                                    <hr />
                                    <div className="logout">
                                        Log Out <span>➡</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </Navbar>
    );
}

export default TopNavbar;
