import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import InputColumn from "../../InputColumn";
import { EditAlamat } from '../../../api/apiAlamat';
import "./ModalAlamat.css";

const ModalEditAlamat = ({ show, handleClose, dataEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    nama_alamat: '',
    alamat: '',
    keterangan: '',
    kecamatan: '',
    kabupaten: '',
    kelurahan: '',
    kode_pos: '',
  });

  useEffect(() => {
    if (dataEdit) {
      setFormData({
        nama_alamat: dataEdit.nama_alamat || '',
        alamat: dataEdit.alamat || '',
        keterangan: dataEdit.keterangan || '',
        kecamatan: dataEdit.kecamatan || '',
        kabupaten: dataEdit.kabupaten || '',
        kelurahan: dataEdit.kelurahan || '',
        kode_pos: dataEdit.kode_pos || '',
        alamat_utama: dataEdit.alamat_utama || false,
      });
    }
  }, [dataEdit]);

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
      if (dataEdit && dataEdit.id_alamat) {
        await EditAlamat(dataEdit.id_alamat, formData);
        onSuccess?.();
        handleClose();
      } else {
        console.log("Data edit tidak ditemukan.");
      }
    } catch (error) {
      console.error("Gagal menyimpan alamat:", error.response?.data || error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="custom-modal-width">
      <Modal.Header closeButton>
        <Modal.Title><b>Edit Alamat</b></Modal.Title>
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
          <Button className="btn-submit" type="submit">
            <b>Edit Alamat</b>
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalEditAlamat;
