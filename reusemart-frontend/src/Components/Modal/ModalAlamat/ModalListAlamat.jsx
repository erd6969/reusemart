import './ModalListAlamat.css';
import { Modal, Container, Spinner  } from "react-bootstrap";
import { useEffect, useState } from 'react';
import SearchIcon from "../../../assets/images/search-icon.png";

import { GetAllAlamat, SearchAlamat } from "../../../api/apiAlamat";

const AlamatDetail = ({ alamat, main, onSelect }) => {
  return (
    <Container
      className="modal-alamat-list-item"
      onClick={() => onSelect(alamat.id_alamat)}
      style={{ cursor: 'pointer' }}
    >
      <div className="modal-nama-alamat-container">
        <b className="modal-nama-alamat">{alamat.nama_alamat}</b>
        {main && (
          <span className="modal-main-address">Alamat Utama</span>
        )}
      </div>
      <p>
        {alamat.alamat} ({alamat.keterangan}), {alamat.kelurahan}, {alamat.kecamatan}, Kabupaten {alamat.kabupaten}, {alamat.kode_pos}
      </p>
    </Container>
  );
};

const ModalListAlamat = ({ show, handleClose, onSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mainIndex, setMainIndex] = useState(0);

  const fetchAlamat = () => {
    setIsLoading(true);
    GetAllAlamat()
      .then((data) => {
        setAddresses(data);
        setIsLoading(false);
        setIsFirstLoad(false);
      })
      .catch((error) => {
        console.error("Error fetching address:", error);
        setIsLoading(false);
        setIsFirstLoad(false);
      });
  };

    useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length >= 3) {
        setIsLoading(true);
        SearchAlamat(searchQuery.trim())
          .then((data) => {
            const hasil = Array.isArray(data) ? data : [data];
            setAddresses(hasil);
          })
          .catch((error) => {
            console.error("Error searching address:", error);
            setAddresses([]);
          })
          .finally(() => setIsLoading(false));
      } else {
        fetchAlamat();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title><b>Pilih Alamat</b></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-alamat-container">
          <div className="modal-search-bar">
            <img src={SearchIcon} alt="Search Icon" className="modal-search-icon-inside" />
              <input
                type="text"
                placeholder="Masukkan Alamat"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>
          <div className="modal-alamat-list">
            {isLoading ? (
              <div className="loading-container">
                <Spinner animation="border" variant="primary" />
                <span className="ms-3">Loading...</span>
              </div>
            ) : (
              addresses?.length > 0 ? (
                addresses.map((alamat, index) => (
                  <AlamatDetail
                    key={index}
                    alamat={alamat}
                    main={mainIndex === index}
                    onSelect={(id) => {
                      onSelect(id);
                      handleClose();
                    }}
                  />
                ))
              ) : (
                <div className="text-center">
                  <h6 className="mt-2 mb-0">Tidak ada alamat ditemukan</h6>
                </div>
              )
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};


export default ModalListAlamat;
