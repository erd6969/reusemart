import './TabelHeadAdmin.css';
import { useNavigate } from 'react-router-dom';
import { Card, ListGroup, Button } from 'react-bootstrap';

const TabelHead = ({ columns = [] }) =>  {
    return (
        <ListGroup.Item className='rowStyle'>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {columns.map((column, index) => (
                    <span 
                        key={index} 
                        className='headerStyle'
                    >
                        {column}
                    </span>
                ))}
            </div>
        </ListGroup.Item>
    );
}

export default TabelHead;