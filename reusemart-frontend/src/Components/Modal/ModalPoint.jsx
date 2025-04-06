import './ModalPoint.css';
import { Modal, Button } from "react-bootstrap";
import { useState } from 'react';

const ModalPoint = ({ show, handleClose, availablePoints = 1000, onConfirm }) => {
    const [points, setPoints] = useState('');
  
    const handleConfirm = () => {
      onConfirm(points);
      setPoints('');
      handleClose();
    };
  
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body className="loyalty-modal-body">
          <h4 className="loyalty-title">Poin Loyalitas</h4>
          <small className="points-available"><b>{availablePoints} Poin Tersedia</b></small>
          <div className="loyalty-input-container">
            <input
              type="number"
              className="loyalty-input"
              placeholder="Masukkan Poin..."
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
          </div>
          <Button className="loyalty-confirm-button" onClick={handleConfirm}>
            Konfirmasi
          </Button>
        </Modal.Body>
      </Modal>
    );
  };

export default ModalPoint;