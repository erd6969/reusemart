import './NavbarLogin.css';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import logoReuseMart from '../../assets/images/logo-reusemart.png';

const TopNavbar = () => {
    const navigate = useNavigate();


    return (
        <Navbar className="navBar">
            <Container fluid>
                <div className='navbar-left'>
                    <img src={logoReuseMart} alt="logo" className="logoReuseMart" onClick={() => navigate('/')} />
                    <Navbar.Brand className="navTitles" onClick={() => navigate('/')}>ReuseMart</Navbar.Brand>
                </div>

                <Nav className="navContent">
                    <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
                    <Nav.Link onClick={() => navigate("/shop")}>Shop</Nav.Link>
                    <Nav.Link onClick={() => navigate("/help")}>Help</Nav.Link>
                </Nav>
                
                <div className="profileContainer">
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
