import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import InputColumn from "../../Components/InputColumn";
import "./ModalAlamat.css";

const ModalAlamat = ({ show, handleClose, title }) => {
  const [namaAlamat, setNamaAlamat] = useState('');
  const [alamat, setAlamat] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kabupaten, setKabupaten] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kodePos, setKodePos] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ namaAlamat, alamat, keterangan, kecamatan, kabupaten, kelurahan, kodePos });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} className="custom-modal-width">
      <Modal.Header closeButton>
        <Modal.Title><b>{title}</b></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* INPUT NAMA ALAMAT */}
          <InputColumn 
            nameLabel="namaAlamat"
            contentLabel="Nama Alamat"
            typeInput="text"
            idInput="namaAlamat"
            placeholderInput="Masukkan Nama Alamat..."
            value={namaAlamat}
            onChange={(e) => setNamaAlamat(e.target.value)}
          />

          {/* INPUT ALAMAT */}
          <InputColumn 
            nameLabel="alamat"
            contentLabel="Alamat"
            typeInput="text"
            idInput="alamat"
            placeholderInput="Masukkan Alamat..."
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
          />

          {/* INPUT DESKRIPSI */}
          <InputColumn 
            nameLabel="keterangan"
            contentLabel="Keterangan"
            typeInput="text"
            idInput="keterangan"
            placeholderInput="Masukkan Keterangan Alamat..."
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
          />

          {/* INPUT KECAMATAN */}
          <InputColumn 
            nameLabel="kecamatan"
            contentLabel="Kecamatan"
            typeInput="text"
            idInput="kecamatan"
            placeholderInput="Masukkan Kecamatan..."
            value={kecamatan}
            onChange={(e) => setKecamatan(e.target.value)}
          />

          {/* INPUT KABUPATEN */}
          <InputColumn 
            nameLabel="kabupaten"
            contentLabel="Kabupaten"
            typeInput="text"
            idInput="kabupaten"
            placeholderInput="Masukkan Kabupaten..."
            value={kabupaten}
            onChange={(e) => setKabupaten(e.target.value)}
          />

          {/* INPUT KELURAHAN */}
          <InputColumn 
            nameLabel="kelurahan"
            contentLabel="Kelurahan"
            typeInput="text"
            idInput="kelurahan"
            placeholderInput="Masukkan Kelurahan..."
            value={kelurahan}
            onChange={(e) => setKelurahan(e.target.value)}
          />

          {/* INPUT KODE POS */}
          <InputColumn 
            nameLabel="kodePos"
            contentLabel="Kode Pos"
            typeInput="text"
            idInput="kodePos"
            placeholderInput="Masukkan Kode Pos..."
            value={kodePos}
            onChange={(e) => setKodePos(e.target.value)}
          />
        </Form>
      </Modal.Body>

      <Modal.Footer className="modal-footer">
        <Button className="btn-submit" type="submit">
          <b>{title}</b>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAlamat;
