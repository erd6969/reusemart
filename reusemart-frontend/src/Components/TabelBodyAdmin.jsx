import './TabelBodyAdmin.css';
import { useNavigate } from 'react-router-dom';
import { Card, ListGroup, Button } from 'react-bootstrap';

const TabelBody = () => {
    return (
        <ListGroup.Item className='rowStyle'>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className='cellStyle'>ORI1</span>
                <span className='cellStyle'>Rajang Indo</span>
                <span className='cellStyle'>08123456789</span>
                <span className='cellStyle'>Aktif</span>
                <span className='cellStyle'>
                    <Button variant="outline-primary" size="sm">Edit</Button>
                </span>
            </div>
        </ListGroup.Item>
    );
}

export default TabelBody;