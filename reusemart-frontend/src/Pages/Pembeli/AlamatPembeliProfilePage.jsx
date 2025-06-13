import { Container, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./AlamatPembeliProfilePage.css";
import FotoPembeli from "../../Components/Pembeli/FotoPembeli";
import ProfileNavigation from "../../Components/Pembeli/ProfileHeader";
import SearchIcon from "../../assets/images/search-icon.png";
import ModalTambahAlamat from "../../Components/Modal/ModalAlamat/ModalTambahAlamat";
import ModalEditAlamat from "../../Components/Modal/ModalAlamat/ModalEditAlamat";

import { GetAllAlamat, ChangeMainAlamat, SearchAlamat, DeleteAlamat } from "../../api/apiAlamat";
import { GetProfile } from "../../api/apiPembeli";
import { toast } from "react-toastify";

import { getThumbnailPembeli } from "../../api/index";

const Poin = () => (
  <Container className="poin-container">
    <b>Poin Loyalitas</b>
    <p>119 Point</p>
  </Container>
);

const AlamatDetail = ({ data, onEdit, toggleMain, onDelete }) => {
  const {
    nama_alamat,
    alamat,
    keterangan,
    kecamatan,
    kabupaten,
    kelurahan,
    kode_pos,
    alamat_utama
  } = data;

  return (
    <Container className="alamat-list-container">
      <div className="nama-alamat-container">
        <b className="nama-alamat">{nama_alamat}</b>
        {alamat_utama === 1 && <span className="main-address">Alamat Utama</span>}
      </div>
      <p>{alamat} ({keterangan}), {kelurahan}, Kecamatan {kecamatan}, Kabupaten {kabupaten}, {kode_pos}</p>
      <div className="alamat-button-container">
        <div className="left-button">
          <button className="edit-button" onClick={onEdit}>
            <b>Ubah Alamat</b>
          </button>
          <button className="delete-button" onClick={onDelete}><b>Hapus Alamat</b></button>
        </div>
        <div className="right-button">
          <button
            className={alamat_utama === 1 ? "set-as-main-button-active" : "set-as-main-button-inactive"}
            onClick={toggleMain}
          >
            Jadikan Alamat Utama
          </button>
        </div>
      </div>
    </Container>
  );
};

const AlamatPembeliPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState([]);
  const [modalTitle, setModalTitle] = useState("Tambah Alamat");
  const [selectedAlamat, setSelectedAlamat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [profile, setProfile] = useState({});

  const fetchAlamat = () => {
    setIsLoading(true);
    GetAllAlamat()
      .then((data) => {
        setAddress(data);
        setIsLoading(false);
        setIsFirstLoad(false);
        console.log("Alamat:", data);
      })
      .catch((error) => {
        console.error("Error fetching address:", error);
        setIsLoading(false);
        setIsFirstLoad(false);
      });
  };

  const toggleMain = async (id) => {
    try {
      await ChangeMainAlamat(id);
      fetchAlamat();
      toast.success("Alamat utama berhasil diubah");
    } catch (error) {
      console.error("Gagal mengubah alamat utama:", error);
      toast.error("Gagal mengubah alamat utama");
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length >= 3) {
        setIsLoading(true);
        SearchAlamat(searchQuery.trim())
          .then((data) => {
            const hasil = Array.isArray(data) ? data : [data];
            setAddress(hasil);
          })
          .catch((error) => {
            console.error("Error searching address:", error);
            setAddress([]);
          })
          .finally(() => setIsLoading(false));
      } else {
        fetchAlamat();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus alamat ini?")) {
      try {
        await DeleteAlamat(id);
        fetchAlamat();
        toast.success("Alamat berhasil dihapus");
      } catch (error) {
        toast.error(error.message || "Gagal menghapus alamat");
      }
    }
  };

  useEffect(() => {
    const showProfile = async () => {
      try {
        const data = await GetProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    }

    showProfile();
  }, []);

  return (
    <>
      <Container className="pembeli-container">
        <ProfileNavigation
          Profile={{ fontWeight: "50", fontSize: "35px", color: "#AFAEAE" }}
          Alamat={{ fontWeight: "600", textDecoration: "underline", fontSize: "40px", color: "black" }}
        />
        <div className="profile-content">
          <div className="profile-left">
            {profile.foto_pembeli && (
            <FotoPembeli
              Foto={getThumbnailPembeli(profile.foto_pembeli)}
              SubProp={<p className="nama-pembeli">{profile.nama_pembeli}</p>} 
            />
          )}
            <Poin />
          </div>
          <div className="alamat-container">
            <div className="alamat-content">
              <div className="search-container">
                <div className="search-bar">
                  <img src={SearchIcon} alt="Search Icon" className="search-icon-inside" />
                  <input
                    type="text"
                    placeholder="Masukkan Alamat"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="add-button"
                onClick={() => {
                  setModalTitle("Tambah Alamat");
                  setSelectedAlamat(null);
                  setShowModal(true);
                }}
              >
                <b>+ Tambah</b>
              </button>
            </div>
            <div className="alamat-list">
              {isLoading || isFirstLoad ? (
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
                      data={addr}
                      toggleMain={() => toggleMain(addr.id_alamat)}
                      onEdit={() => {
                        setModalTitle("Edit Alamat");
                        setSelectedAlamat(addr);
                        setShowModal(true);
                      }}
                      onDelete={() => handleDelete(addr.id_alamat)}
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

        {modalTitle === "Tambah Alamat" ? (
          <ModalTambahAlamat
            show={showModal}
            handleClose={() => setShowModal(false)}
            onSuccess={fetchAlamat}
          />
        ) : (
          <ModalEditAlamat
            show={showModal}
            handleClose={() => setShowModal(false)}
            dataEdit={selectedAlamat}
            onSuccess={fetchAlamat}
          />
        )}
      </Container>
      <br />
    </>
  );
};

export default AlamatPembeliPage;
