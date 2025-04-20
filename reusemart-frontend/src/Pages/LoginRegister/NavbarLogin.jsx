import './NavbarLogin.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import logoReuseMart from '../../assets/images/logo-reusemart.png';
import { FaChevronDown } from "react-icons/fa";




const TopNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);


    return (
        <Navbar className="navBar">
            <Container fluid>
                <img src={logoReuseMart} alt="logo" className="logoReuseMart" onClick={() => navigate('/')} />
                <Navbar.Brand className="navTitles" onClick={() => navigate('/')}>ReuseMart</Navbar.Brand>
                <div
                    className="profileContainer"
                    ref={dropdownRef}
                    onMouseEnter={() => setIsOpen(true)} // Muncul saat hover
                    onMouseLeave={() => setIsOpen(false)} // Hilang saat keluar hover
                    onClick={() => setIsOpen((prev) => !prev)} // Bisa juga dibuka dengan klik
                >
                    <div className="profileSection">
                        <Button className="butto" type="submit"  onClick={() => navigate("/auth/login")}variant="success"><p ><b>Login</b></p></Button>
                        <Button className="butto" type="button" onClick={() => navigate("/auth/register-option")} variant="warning">
                            <p><b>Register</b></p>
                        </Button>
                    </div>
                </div>
            </Container>
        </Navbar>
    );
}

export default TopNavbar;
