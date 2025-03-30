
import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';

import TopsNavbar from "../../Components/NavbarOwner.jsx";

function OwnerPage() {
    const [show, setShow] = useState(false);

    return (
        <>
            <TopsNavbar />
            <Card style={{ width: '18vw', height: '95vh' }}>
                <Card.Header style={{ fontSize:'160%'}}>Owner Page</Card.Header>
                <Card.Body>
                    <Card.Title>Card Title</Card.Title>
                    <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                    </Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>
            </Card>

        </>
    );
}



export default OwnerPage;
