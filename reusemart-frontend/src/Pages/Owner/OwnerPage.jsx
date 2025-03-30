import { useState } from 'react';
import { Nav, Card } from 'react-bootstrap';
import { useNavigate, Outlet } from 'react-router-dom';
import TopsNavbar from "../../Components/NavbarOwner.jsx";

function OwnerPage() {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState('');

    const handleNavigation = (page) => {
        setActivePage(page);
        navigate(`/owner/${page}`);
    };

    return (
        <>
            <TopsNavbar />
            <div style={{ display: 'flex' }}>
                <Card style={{ width: '18vw', height: '92vh' }}>
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
                <div style={{ flex: 1, marginLeft: '18vw' }}>
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default OwnerPage;