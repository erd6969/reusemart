import { Container, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./AlamatPembeliProfilePage.css";
import FotoPembeli from "../../Components/Pembeli/FotoPembeli";
import ProfileNavigation from "../../Components/Pembeli/ProfileHeader";
import profileImage from "../../assets/images/Pembeli/Yuki.jpeg";
import SearchIcon from "../../assets/images/search-icon.png";
import ModalAlamat from "../../Components/Modal/ModalAlamat";

import { GetAllAlamat, ChangeMainAlamat } from "../../api/apiAlamat";

const Poin = () => {
  return(
    <Container className="poin-container">
      <b>Poin Loyalitas</b>
      <p>119 Point</p>
    </Container>
  );
};

const AlamatDetail = ({ namaAlamat, alamat, keterangan, kecamatan, kabupaten, kelurahan, kodePos, main, toggleMain }) => {
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
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState([]); 

  const fetchAlamat = () => {
    setIsLoading(true); 
    GetAllAlamat().then((data) => {
      console.log("Alamat yang diterima:", data);
      setAddress(data);
      setIsLoading(false); 
    }).catch((error) => {
      console.error("Error fetching address:", error);
      setIsLoading(false); 
    });
  };

  const toggleMain = async (id) => {
    try {
      await ChangeMainAlamat(id);
      fetchAlamat();
    } catch (error) {
      console.error("Gagal mengubah alamat utama:", error);
    }
  };

  useEffect(() => { 
    fetchAlamat(); 
  }, []);

  return (
    <>
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
            {isLoading ? (
              <div className="text-center"> 
                <Spinner 
                  as="span" 
                  animation="border" 
                  variant="primary" 
                  size="lg" 
                  role="status" 
                  aria-hidden="true" 
                /> 
                <h6 className="mt-2 mb-0">Loading...</h6> 
              </div> 
            ) : (
              address?.length > 0 ? (
                address.map((addr, index) => (
                  <AlamatDetail
                    key={index}
                    namaAlamat={addr.nama_alamat}
                    alamat={addr.alamat}
                    keterangan={addr.keterangan}
                    kecamatan={addr.kecamatan}
                    kabupaten={addr.kabupaten}
                    kelurahan={addr.kelurahan}
                    kodePos={addr.kode_pos}
                    main={addr.alamat_utama === 1}
                    toggleMain={() => toggleMain(addr.id_alamat)}
                  />                
                ))
              ) : (
                <div className="text-center"> 
                  <h6 className="mt-2 mb-0">Tidak ada alamat</h6> 
                </div> 
              )
            )}
          </div>
        </div>
      </div>
      <ModalAlamat 
        show={showModal} 
        handleClose={() => setShowModal(false)}
        title={"Tambah Alamat"}
      />
    </Container>
    <br />
    </>
  );
};

export default AlamatPembeliPage;
