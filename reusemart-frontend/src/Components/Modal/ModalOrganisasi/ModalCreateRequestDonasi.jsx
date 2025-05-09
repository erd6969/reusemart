import React, { useState } from 'react';
import { Modal, Button} from 'react-bootstrap';
import InputColumn from "../../InputColumn";
import { AddRequestDonasi } from '../../../api/apiOrganisasi';
import { toast } from 'react-toastify';

const ModalCreateRequestDonasi = ({ show, handleClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    detail_request: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      await AddRequestDonasi(formData);
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error:', {
        message: error.message,
        response: error.response?.data
      });
      toast.error(error.response?.data?.message || "Gagal menambahkan Request Donasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="custom-modal-width">
      <Modal.Header closeButton>
        <Modal.Title><b>Tambah Request Donasi</b></Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <InputColumn
            nameLabel="detail_request"
            contentLabel="Detail"
            typeInput="text"
            idInput="detail_request"
            placeholderInput="Masukkan Request Anda..."
            value={formData.detail_request}
            onChange={handleChange}
          />
        </Modal.Body>

        <Modal.Footer className="modal-footer">
          <Button className="btn-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : <b>Tambah Request</b>}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalCreateRequestDonasi;
