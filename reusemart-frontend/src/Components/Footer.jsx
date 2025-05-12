import { Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import logoUAJY from "../assets/images/logo-reusemart.png"
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-logo-container">
                <img src={logoUAJY} alt="logo" />
                <div className="footer-logo-text">
                    <h2>Reuse</h2>
                    <h2>Mart</h2>
                </div>
            </div>

            <div className="footer-content-container">
                <Row>
                    <Col>
                        <h3>Location</h3>
                        <p>Jl. Atmayaja No. 53 Yogyakarta</p>
                    </Col>
                    <Col>
                        <h3>Contact</h3>
                        <p>Phone : +62 895-6031-51761</p>
                        <p>Email : reusemart.corp@gmail.com</p>
                    </Col>
                    <Col>
                        <h3>Contact Us</h3>
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebook size={30} color="#1877F2" /> {/* Biru khas Facebook */}
                        </a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaTwitter size={30} color="#1DA1F2" /> {/* Biru khas Twitter */}
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagram size={30} color="#E1306C" /> {/* Pink khas Instagram */}
                        </a>
                    </Col>
                </Row>
            </div>

        </footer>
    )
}

export default Footer;