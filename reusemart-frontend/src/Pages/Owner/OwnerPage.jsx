import { useState, useEffect } from 'react';
import { Nav, Card, Dropdown } from 'react-bootstrap';
import { useNavigate, Outlet } from 'react-router-dom';
import TopsNavbar from "../../Components/NavbarOwner.jsx";

function OwnerPage() {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState('req-donasi');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1210);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1210);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNavigation = (page) => {
        setActivePage(page);
        navigate(`/owner/${page}`);
    };

    return (
        <>
            <TopsNavbar />
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                {isMobile ? (
                    <Dropdown>
                        <Dropdown.Toggle variant="dark" style={{width : "100%", borderRadius:"0px"}}>Menu</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleNavigation('req-donasi')}>
                                Daftar Request Donasi
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleNavigation('history-donasi')}>
                                History Donasi
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleNavigation('laporan')}>
                                Laporan
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                ) : (
                    <Card style={{ width: '16vw', height: '94vh' }}>
                        <Card.Header style={{ fontSize: '150%' }}>Owner Page</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <Nav.Link
                                    as="div"
                                    style={{
                                        fontSize: '120%',
                                        height: '6vh',
                                        cursor: 'pointer',
                                        backgroundColor: activePage === 'req-donasi' ? 'lightgray' : 'transparent'
                                    }}
                                    onClick={() => handleNavigation('req-donasi')}
                                >
                                    Daftar Request Donasi
                                </Nav.Link>
                            </Card.Text>
                            <Card.Text>
                                <Nav.Link
                                    as="div"
                                    style={{
                                        fontSize: '120%',
                                        height: '6vh',
                                        cursor: 'pointer',
                                        backgroundColor: activePage === 'history-donasi' ? 'lightgray' : 'transparent'
                                    }}
                                    onClick={() => handleNavigation('history-donasi')}
                                >
                                    History Donasi
                                </Nav.Link>
                            </Card.Text>
                            <Card.Text>
                                <Nav.Link
                                    as="div"
                                    style={{
                                        fontSize: '120%',
                                        height: '6vh',
                                        cursor: 'pointer',
                                        backgroundColor: activePage === 'laporan' ? 'lightgray' : 'transparent'
                                    }}
                                    onClick={() => handleNavigation('laporan')}
                                >
                                    Laporan
                                </Nav.Link>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                )}
                <div style={{ flex: 1, marginLeft: isMobile ? '7vw' : '5vw' }}>
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default OwnerPage;
