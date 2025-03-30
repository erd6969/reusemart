import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TopsNavbar from "../../Components/NavbarOwner.jsx";

function HistoryDonasi() {
    const navigate = useNavigate();

    return (
        <Card style={{marginRight:'10vw'}}>
            <Card.Header as="h5">kucing</Card.Header>
            <Card.Body>
                namaku kucing suka kucing
            </Card.Body>
        </Card>
    );
}

export default HistoryDonasi;