import { Container } from "react-bootstrap";
import { useState } from "react";
import "./AlamatPembeliProfilePage.css";
import FotoPembeli from "../../Components/Pembeli/FotoPembeli";
import ProfileNavigation from "../../Components/Pembeli/ProfileHeader";
import profileImage from "../../assets/images/Pembeli/Yuki.jpeg";
import SearchIcon from "../../assets/images/search-icon.png";
import ModalAlamat from "../../Components/Modal/ModalAlamat";

const Poin = () => {
  return(
    <Container className="poin-container">
      <b>Poin Loyalitas</b>
      <p>119 Point</p>
    </Container>
  );
};

const AlamatDetail = ({namaAlamat, alamat, keterangan, kecamatan, kabupaten, kelurahan, kodePos, main, toggleMain}) => {
  const [showModal, setShowModal] = useState(false);

  return(
    <Container className="alamat-list-container">
      <div className="nama-alamat-container">
        <b className="nama-alamat">{namaAlamat}</b>
        {main && <span className="main-address">Alamat Utama</span>}
      </div>
      <p>{alamat} ({keterangan}), {kelurahan}, Kecamatan {kecamatan}, Kabupaten {kabupaten}, {kodePos}</p>
      <div className="alamat-button-container">
        <div className="left-button">
          <button className="edit-button"
            onClick={() => setShowModal(true)}>
              <b>Ubah Alamat</b>
          </button>
          <button className="delete-button"><b>Hapus Alamat</b></button>
        </div>
        <div className="right-button">
          <button
            className={main ? "set-as-main-button-active" : "set-as-main-button-inactive"}
            onClick={toggleMain}
          >
            Jadikan Alamat Utama
          </button>
        </div>
      </div>
      <ModalAlamat 
        show={showModal} 
        handleClose={() => setShowModal(false)}
        title={"Edit Alamat"}
      />
    </Container>
  );
};

const AlamatPembeliPage = () => {
  const [mainAddress, setMainAddress] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const toggleMain = (index) => {
    setMainAddress(index);
  };

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
    <Container className="pembeli-container">
      <ProfileNavigation Profile={{ fontWeight: "50", fontSize: "35px", color: "#AFAEAE" }} Alamat={{ fontWeight: "600", textDecoration: "underline", fontSize: "40px", color: "black" }} />
      <div className="profile-content">
        <div className="profile-left">
          <FotoPembeli Foto={profileImage} SubProp={<p className="nama-pembeli">Yuki Suou</p>} />
          <Poin />
        </div>
        <div className="alamat-container">
          <div className="alamat-content">
              <div className="search-container">
                  <div className="search-bar">
                      <img src={SearchIcon} alt="Search Icon" className="search-icon-inside" />
                      <input type="text" placeholder="Masukkan Alamat" className="search-input"/>
                  </div>
              </div>
              <button 
                className="add-button"
                onClick={() => setShowModal(true)}
              >
                <b>+ Tambah</b>
              </button>
          </div>
          <div className="alamat-list">
            {addresses.map((address, index) => (
              <AlamatDetail 
                key={index}
                namaAlamat={address.namaAlamat}
                alamat={address.alamat}
                keterangan={address.keterangan}
                kecamatan={address.kecamatan}
                kabupaten={address.kabupaten}
                kelurahan={address.kelurahan}
                kodePos={address.kodePos}
                main={mainAddress === index}
                toggleMain={() => toggleMain(index)}
              />
            ))}
          </div>
        </div>
      </div>
      <ModalAlamat 
        show={showModal} 
        handleClose={() => setShowModal(false)}
        title={"Tambah Alamat"}
      />
    </Container>
  );
};

export default AlamatPembeliPage;