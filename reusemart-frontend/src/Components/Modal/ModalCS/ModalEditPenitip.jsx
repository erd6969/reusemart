import { Modal, Button } from 'react-bootstrap';
import InputColumn from "../../InputColumn";
import { useState, useEffect } from 'react';
import { UpdatePenitip } from '../../../api/apiPenitip';
import { toast } from 'react-toastify';

import { getThumbnailPenitip } from "../../../api/index";


const ModalEditPenitip = ({ show, handleClose, dataEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    email_penitip: '',
    password_penitip: '',
    nama_penitip: '',
    nomor_telepon_penitip: '',
    foto_penitip: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    const newValue = type === 'file' ? files[0] : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  useEffect(() => {
    if (dataEdit) {
      setFormData({
        email_penitip: dataEdit.email_penitip || '',
        password_penitip:'',
        nama_penitip: dataEdit.nama_penitip || '',
        nomor_telepon_penitip: dataEdit.nomor_telepon_penitip || '',
        foto_penitip: null,
      });
    }
  }, [dataEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (dataEdit && dataEdit.id_penitip) {
        const formDataToSend = new FormData();
        formDataToSend.append('email_penitip', formData.email_penitip);
        formDataToSend.append('password_penitip', formData.password_penitip);
        formDataToSend.append('nama_penitip', formData.nama_penitip);
        formDataToSend.append('nomor_telepon_penitip', formData.nomor_telepon_penitip);

        if (formData.foto_penitip instanceof File) {
          formDataToSend.append('foto_penitip', formData.foto_penitip);
        }
        await UpdatePenitip(dataEdit.id_penitip, formDataToSend);
        onSuccess?.();
        handleClose();
      }
    } catch (error) {
      console.error('Error:', {
        message: error.message,
        response: error.response?.data
      });
      toast.error(error.response?.data?.message || "Gagal mengubah penitip");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="custom-modal-width">
      <Modal.Header closeButton>
        <Modal.Title><b>Edit Penitip</b></Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Modal.Body>
          <InputColumn
            nameLabel="email_penitip"
            contentLabel="Email"
            typeInput="email"
            idInput="email_penitip"
            placeholderInput="Masukkan Email..."
            value={formData.email_penitip}
            onChange={handleChange}
          />

          <InputColumn
            nameLabel="password_penitip"
            contentLabel="Password"
            typeInput="text"
            idInput="password_penitip"
            placeholderInput="Masukkan Password..."
            value={formData.password_penitip}
            onChange={handleChange}
          />

          <InputColumn
            nameLabel="nama_penitip"
            contentLabel="Nama Lengkap"
            typeInput="text"
            idInput="nama_penitip"
            placeholderInput="Masukkan Nama Lengkap..."
            value={formData.nama_penitip}
            onChange={handleChange}
          />

          <InputColumn
            nameLabel="nomor_telepon_penitip"
            contentLabel="Nomor Telepon"
            typeInput="text"
            idInput="nomor_telepon_penitip"
            placeholderInput="Masukkan Nomor Telepon..."
            value={formData.nomor_telepon_penitip}
            onChange={handleChange}
          />

          <InputColumn
            nameLabel="foto_penitip"
            contentLabel="Foto Penitip"
            typeInput="file"
            idInput="foto_penitip"
            placeholderInput=""
            onChange={handleChange}
          />

          {formData.foto_penitip && (
            <div className="image-preview">
              <p>Preview Foto:</p>
              <img
                src={formData.foto_penitip instanceof File ? URL.createObjectURL(formData.foto_penitip) : formData.foto_penitip}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
              />
            </div>
          )}

          {!formData.foto_penitip && dataEdit?.foto_penitip && (
            <div className="image-preview">
              <p>Preview Foto: </p>
              <img
                src={getThumbnailPenitip(dataEdit.foto_penitip)}
                alt="Previous"
                style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
              />
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="modal-footer">
          <Button className="btn-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : <b>Update Penitip</b>}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalEditPenitip;
