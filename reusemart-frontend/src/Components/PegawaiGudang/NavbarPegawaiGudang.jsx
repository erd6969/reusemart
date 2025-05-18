import { data, useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { Navbar, Container, Nav, Spinner } from "react-bootstrap";
import "../pembeli/NavbarPembeli.css";
import "./NavbarPegawaiGudang.css";
import profileImage from "../../assets/images/Pembeli/Yuki.jpeg";
import logoReuseMart from "../../assets/images/logo-reusemart.png";
import coin from "../../assets/images/coin-icon.png";
import { FaShoppingCart, FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import { Logout } from "../../api/apiAuth";
import { GetProfile } from "../../api/apiPegawai";
import { getThumbnailPegawai } from "../../api/index";

const TopNavbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [profile, setProfile] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

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

    const handleLogout = async () => {
        try {
            await Logout();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            navigate("/auth/login");
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

                    <div
                        className="profileContainer"
                        ref={dropdownRef}
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                    >
                        <div className="profileSection">
                            <img src={getThumbnailPegawai(profile.foto_pegawai)} alt="profile" />
                            <div className="profileName">{profile.nama_pegawai}</div>
                            <FaChevronDown className="chevronIcon" />
                        </div>

                        <div className={`dropdownMenuPegawaiGudang ${isDropdownOpen ? "show" : ""}`}>
                            <div className="dropdownContent">
                                <div className="menuSection">
                                    <div className="logout" onClick={handleLogout} style={{ cursor: "pointer" }}>
                                        Log Out ➡
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </Container>
        </Navbar>
    );
};

export default TopNavbar;
