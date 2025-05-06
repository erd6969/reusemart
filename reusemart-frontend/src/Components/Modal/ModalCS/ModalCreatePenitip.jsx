import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import InputColumn from "../../InputColumn";
import { AddPenitip } from '../../../api/apiPenitip';
import { toast } from 'react-toastify';

const ModalCreatePenitip = ({ show, handleClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email_penitip: '',
    password_penitip: '',
    nama_penitip: '',
    nomor_telepon_penitip: '',
    NIK: '',
    tanggal_lahir: '',
    foto_ktp: null,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const formDataToSend = new FormData();
      formDataToSend.append('email_penitip', formData.email_penitip);
      formDataToSend.append('password_penitip', formData.password_penitip);
      formDataToSend.append('nama_penitip', formData.nama_penitip);
      formDataToSend.append('nomor_telepon_penitip', formData.nomor_telepon_penitip);
      formDataToSend.append('NIK', formData.NIK);
      formDataToSend.append('tanggal_lahir', formData.tanggal_lahir);

      if (formData.foto_ktp instanceof File) {
        formDataToSend.append('foto_ktp', formData.foto_ktp);
      }

      if (formData.foto_penitip instanceof File) {
        formDataToSend.append('foto_penitip', formData.foto_penitip);
      }
      await AddPenitip(formData);
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error:', {
        message: error.message,
        response: error.response?.data
      });
      toast.error(error.response?.data?.message || "Gagal menambahkan penitip");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="custom-modal-width">
      <Modal.Header closeButton>
        <Modal.Title><b>Tambah Penitip</b></Modal.Title>
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
            typeInput="password"
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
            nameLabel="NIK"
            contentLabel="NIK"
            typeInput="text"
            idInput="NIK"
            placeholderInput="Masukkan NIK..."
            value={formData.NIK}
            onChange={handleChange}
          />

          <InputColumn
            nameLabel="tanggal_lahir"
            contentLabel="Tanggal Lahir"
            typeInput="date"
            idInput="tanggal_lahir"
            placeholderInput=""
            value={formData.tanggal_lahir}
            onChange={handleChange}
          />

          <InputColumn
            nameLabel="foto_ktp"
            contentLabel="Foto KTP"
            typeInput="file"
            idInput="foto_ktp"
            placeholderInput=""
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
        </Modal.Body>

        <Modal.Footer className="modal-footer">
          <Button className="btn-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : <b>Tambah Penitip</b>}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalCreatePenitip;
