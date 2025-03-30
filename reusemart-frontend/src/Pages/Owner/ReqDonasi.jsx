import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TopsNavbar from "../../Components/NavbarOwner.jsx";

function ReqDonasi() {
    const navigate = useNavigate();

    return (
        <Card style={{marginRight:'10vw'}}>
            <Card.Header as="h5">ayam</Card.Header>
            <Card.Body>
                namaku ayam suka ayam
            </Card.Body>
        </Card>
    );
}

export default ReqDonasi;