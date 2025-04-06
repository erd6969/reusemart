import './ModalListAlamat.css';
import { Modal, Container } from "react-bootstrap";
import { useState } from 'react';
import SearchIcon from "../../assets/images/search-icon.png";

const AlamatDetail = ({
  namaAlamat,
  alamat,
  keterangan,
  kecamatan,
  kabupaten,
  kelurahan,
  kodePos,
  main
}) => {
  return (
    <Container className="modal-alamat-list-item">
      <div className="modal-nama-alamat-container">
        <b className="modal-nama-alamat">{namaAlamat}</b>
        {main && <span className="modal-main-address">Alamat Utama</span>}
      </div>
      <p>
        {alamat} ({keterangan}), {kelurahan}, Kecamatan {kecamatan}, Kabupaten {kabupaten}, {kodePos}
      </p>
    </Container>
  );
};

const ModalListAlamat = ({ show, handleClose }) => {
  const [mainIndex, setMainIndex] = useState(0);

  const addresses = [
    {
      namaAlamat: "Rumah",
      alamat: "Jalan Putanginamo Talaga Gago No. 69",
      keterangan: "Depan SilitWangi",
      kecamatan: "Caturtunggal",
      kabupaten: "Depok",
      kelurahan: "Sleman",
      kodePos: "40115",
    },
    {
      namaAlamat: "Kantor",
      alamat: "Jalan Putanginamo Talaga Gago No. 69",
      keterangan: "Depan SilitWangi",
      kecamatan: "Caturtunggal",
      kabupaten: "Depok",
      kelurahan: "Sleman",
      kodePos: "40115",
    },
    {
      namaAlamat: "Sex Chamber",
      alamat: "Jalan Putanginamo Talaga Gago No. 69",
      keterangan: "Depan SilitWangi",
      kecamatan: "Caturtunggal",
      kabupaten: "Depok",
      kelurahan: "Sleman",
      kodePos: "40115",
    }
  ];

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title><b>Pilih Alamat</b></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-alamat-container">
          <div className="modal-search-bar">
            <img src={SearchIcon} alt="Search Icon" className="modal-search-icon-inside" />
            <input type="text" placeholder="Masukkan Alamat" className="modal-search-input" />
          </div>
          <div className="modal-alamat-list">
            {addresses.map((address, index) => (
              <AlamatDetail
                key={index}
                {...address}
                main={mainIndex === index}
              />
            ))}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalListAlamat;
