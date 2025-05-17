import './ModalPoint.css';
import { Modal, Button } from "react-bootstrap";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { GetProfile } from '../../../api/apiPembeli';

const ModalPoint = ({ show, handleClose, onConfirm }) => {
    const [profile, setProfile] = useState({});
    const [points, setPoints] = useState('');

    const fetchProfile = async () => {
        try {
            const response = await GetProfile();
            setProfile(response);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

      useEffect(() => {
        fetchProfile();
    }, []);
  
    const handleConfirm = () => {
      if (Number(points) > profile.poin_loyalitas) {
          toast.warning("Poin yang dimasukkan melebihi poin yang tersedia");
          return;
      }else{
        onConfirm(points);
        setPoints('');
        handleClose();
      }   
    };
  
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body className="loyalty-modal-body">
          <h4 className="loyalty-title">Poin Loyalitas</h4>
          <small className="points-available"><b>{profile.poin_loyalitas} Poin Tersedia</b></small>
          <div className="loyalty-input-container">
            <input
              type="number"
              className="loyalty-input"
              placeholder="Masukkan Poin..."
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
          </div>
          <button className="loyalty-confirm-button" onClick={handleConfirm}>
            Konfirmasi
          </button>
        </Modal.Body>
      </Modal>
    );
  };

export default ModalPoint;