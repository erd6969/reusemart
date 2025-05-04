import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import InputColumn from "../../InputColumn";
import { AddAlamat } from '../../../api/apiAlamat';
import { toast } from 'react-toastify';
import "./ModalAlamat.css";

const ModalTambahAlamat = ({ show, handleClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nama_alamat: '',
    alamat: '',
    keterangan: '',
    kecamatan: '',
    kabupaten: '',
    kelurahan: '',
    kode_pos: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} diubah menjadi:`, value);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Data yang akan dikirim:', formData);

    try {
      setIsSubmitting(true);
      const response = await AddAlamat(formData);
      console.log('Response:', response);
      
      toast.success("Alamat berhasil ditambahkan");
      onSuccess?.();
      handleClose();
      
      // Reset form
      setFormData({
        nama_alamat: '',
        alamat: '',
        keterangan: '',
        kecamatan: '',
        kabupaten: '',
        kelurahan: '',
        kode_pos: ''
      });
    } catch (error) {
      console.error('Error:', {
        message: error.message,
        response: error.response?.data
      });
      toast.error(error.response?.data?.message || "Gagal menambahkan alamat");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="custom-modal-width">
      <Modal.Header closeButton>
        <Modal.Title><b>Tambah Alamat</b></Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <InputColumn 
            nameLabel="nama_alamat"
            contentLabel="Nama Alamat"
            typeInput="text"
            idInput="nama_alamat"
            placeholderInput="Masukkan Nama Alamat..."
            value={formData.nama_alamat}
            onChange={handleChange}
          />

          <InputColumn 
            nameLabel="alamat"
            contentLabel="Alamat"
            typeInput="text"
            idInput="alamat"
            placeholderInput="Masukkan Alamat..."
            value={formData.alamat}
            onChange={handleChange}
          />

          <InputColumn 
            nameLabel="keterangan"
            contentLabel="Keterangan"
            typeInput="text"
            idInput="keterangan"
            placeholderInput="Masukkan Keterangan Alamat..."
            value={formData.keterangan}
            onChange={handleChange}
          />

          <InputColumn 
            nameLabel="kecamatan"
            contentLabel="Kecamatan"
            typeInput="text"
            idInput="kecamatan"
            placeholderInput="Masukkan Kecamatan..."
            value={formData.kecamatan}
            onChange={handleChange}
          />

          <InputColumn 
            nameLabel="kabupaten"
            contentLabel="Kabupaten"
            typeInput="text"
            idInput="kabupaten"
            placeholderInput="Masukkan Kabupaten..."
            value={formData.kabupaten}
            onChange={handleChange}
          />

          <InputColumn 
            nameLabel="kelurahan"
            contentLabel="Kelurahan"
            typeInput="text"
            idInput="kelurahan"
            placeholderInput="Masukkan Kelurahan..."
            value={formData.kelurahan}
            onChange={handleChange}
          />

          <InputColumn 
            nameLabel="kode_pos"
            contentLabel="Kode Pos"
            typeInput="text"
            idInput="kode_pos"
            placeholderInput="Masukkan Kode Pos..."
            value={formData.kode_pos}
            onChange={handleChange}
          />
        </Modal.Body>

        <Modal.Footer className="modal-footer">
          <Button className="btn-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : <b>Tambah Alamat</b>}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalTambahAlamat;