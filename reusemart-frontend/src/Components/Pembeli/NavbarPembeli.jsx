import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { Navbar, Container, Nav, Spinner } from "react-bootstrap";
import "./NavbarPembeli.css";
import logoReuseMart from "../../assets/images/logo-reusemart.png";
import coin from "../../assets/images/coin-icon.png";
import { FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { Logout } from "../../api/apiAuth";
import { GetProfile } from "../../api/apiPembeli";
import { getThumbnailPembeli } from "../../api/index";
import { useCart } from "../../Components/Context/CartContext";

const TopNavbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [profile, setProfile] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { cartCount } = useCart();

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

    return (
        <Navbar className="navBar">
            <Container fluid>
                <div className="navLeft" onClick={() => navigate("/pembeli/home")}>
                    <img src={logoReuseMart} alt="logo" className="logoReuseMart" />
                    <Navbar.Brand className="navTitle">ReuseMart</Navbar.Brand>
                </div>

                <Nav className="navContent">
                    <Nav.Link onClick={() => navigate("/pembeli/home")}>Home</Nav.Link>
                    <Nav.Link onClick={() => navigate("/pembeli/shop")}>Shop</Nav.Link>
                    <Nav.Link onClick={() => navigate("/pembeli/help")}>Help</Nav.Link>
                </Nav>

                <div style={{ position: "relative" }}>
                    <FaShoppingCart
                        className="cartIcon"
                        onClick={() => navigate("/pembeli/cart")}
                        style={{ cursor: "pointer" }}
                    />
                    {cartCount > 0 && (
                        <div className="cartCountBubble">
                            <span>{cartCount}</span>
                        </div>
                    )}
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
                            <img src={getThumbnailPembeli(profile.foto_pembeli)} alt="profile" />
                            <div className="profileName">{profile.nama_pembeli}</div>
                            <FaChevronDown className="chevronIcon" />
                        </div>

                        <div className={`dropdownMenu ${isDropdownOpen ? "show" : ""}`}>
                            <div className="dropdownContent">
                                <div className="pointsSection">
                                    <img src={coin} alt="coin icon" />
                                    <div className="pointsText">
                                        <span>Loyalty Points</span>
                                        <strong>{profile.poin_loyalitas}</strong>
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
