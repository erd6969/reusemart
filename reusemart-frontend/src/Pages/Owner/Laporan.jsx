import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import inputCol from "../../Components/InputColumn.jsx";

function Laporan() {
    const navigate = useNavigate();
    return (
        <Card style={{marginRight:'10vw'}}>
            <Card.Header as="h5">laporan</Card.Header>
            <Card.Body>
                ajikijai
                <inputCol/>
            </Card.Body>
        </Card>
    );
}

export default Laporan;