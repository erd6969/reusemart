import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { GetDetailBarang } from "../../../api/apiBarang";
import { ShowDiskusi, CreateDiskusi } from "../../../api/apiDiskusi";
import profileImage from "../../../assets/images/Pembeli/Yuki.jpeg";
import csProfileImage from "../../../assets/images/blank-profile-picture.jpg";
import "./ModalDiskusi.css";

import { getThumbnailBarang } from "../../../api";
import { getThumbnailPembeli } from "../../../api";
import { getThumbnailPegawai } from "../../../api";

import { GetProfile } from "../../../api/apiPegawai";

const ModalDiskusi = ({ show, onHide, id_barang }) => {
  const [detailBarang, setDetailBarang] = useState(null);
  const [diskusi, setDiskusi] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);

  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (show && id_barang) {
      fetchData();
    }
  }, [show, id_barang]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const detail = await GetDetailBarang(id_barang);
      const response = await ShowDiskusi(id_barang);
      setDetailBarang(detail.barang);
      setDiskusi(response.data || []);
    } catch (err) {
      setError("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setPosting(true);
      await CreateDiskusi({ id_barang, diskusi: newComment });
      setNewComment("");
      fetchData();
    } catch {
      setError("Gagal mengirim diskusi.");
    } finally {
      setPosting(false);
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
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton className="modal-diskusi-header">
        <Modal.Title>Detail Barang & Diskusi</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-diskusi-body">
        {loading ? (
          <div className="modal-loading-container">
            <Spinner animation="border" />
            <p className="mt-2">Memuat...</p>
          </div>
        ) : detailBarang ? (
          <>
            <div className="modal-detail-barang-content">
              <img
                src={getThumbnailBarang(detailBarang.foto_barang)}
                alt="Barang"
                className="modal-gambar-barang"
              />
              <div className="modal-info-barang">
                <h4 className="modal-nama-barang">{detailBarang.nama_barang}</h4>
                <div className="modal-harga-barang">
                  <h1>Rp {Number(detailBarang.harga_barang).toLocaleString("id-ID")}</h1>
                </div>
                <div className="modal-deskripsi-wrapper">
                  <div className="label-colon-align">
                    <span className="label">Deskripsi</span>
                    <span className="colon">:</span>
                    <div className="isi-deskripsi">
                      <p>{detailBarang.deskripsi_barang}</p>
                    </div>
                  </div>
                  <div className="label-colon-align">
                    <span className="label">Kondisi</span>
                    <span className="colon">:</span>
                    <div className="isi-kondisi">
                      <p>{detailBarang.kondisi_barang}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr />
            <div className="diskusi-container">
              <h5>Diskusi</h5>
              <Form onSubmit={handleSubmit}>
                <div className="diskusi-input-container">
                  <img
                    src={getThumbnailPegawai(profile.foto_pegawai)}
                    alt="User Avatar"
                    className="diskusi-avatar"
                  />
                  <Form.Control
                    type="text"
                    className="input-diskusi"
                    placeholder="Tulis pertanyaan..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </div>
                <div className="diskusi-buttons">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setNewComment("")}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="discuss-btn"
                    disabled={posting}
                  >
                    {posting ? "Mengirim..." : "Kirim"}
                  </button>
                </div>
              </Form>

              {diskusi.length === 0 ? (
                <p className="text-muted mt-3">Belum ada diskusi untuk barang ini.</p>
              ) : (
                diskusi.map((d, i) => (
                  <div key={i} className="diskusi-box">
                    <div className="d-flex align-items-start" style={{ gap: "10px" }}>
                      <img
                        src={
                          d.id_pembeli
                              ? getThumbnailPembeli(d.pembeli.foto_pembeli)
                              : getThumbnailPegawai(d.pegawai.foto_pegawai)
                        }
                        alt="User"
                        className="diskusi-avatar"
                      />
                      <div>
                        <strong>
                          {d.id_pembeli ? d.pembeli?.nama_pembeli : d.pegawai?.nama_pegawai}
                        </strong>
                        {d.id_pegawai && (
                          <span className="badge bg-success ms-2">Customer Service</span>
                        )}
                        <p className="mb-1"><small>{d.waktu_diskusi}</small></p>
                        <p className="mb-0">{d.diskusi}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <p>{error || "Tidak ada data barang."}</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModalDiskusi;
