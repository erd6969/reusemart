import { useEffect, useState } from "react";
import { Container, Spinner} from "react-bootstrap";
import "./ProfilePenitipPage.css";
import FotoPenitip from "../../Components/Penitip/FotoPenitip";
import InputColumn from "../../Components/InputColumn";
import { ShowProfilePenitip } from "../../api/apiPenitip";
import { FaMedal } from "react-icons/fa";

const ProfilePenitip = () => {
  const [penitip, setPenitip] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ShowProfilePenitip();
        setPenitip(data);
      } catch (error) {
        console.error("Gagal mengambil data penitip:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Container className="penitip-container">
        <div className="profile-penitip-header">
          <h1><b>Profil Penitip</b></h1>
          <hr />
        </div>

        {!penitip ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div className="profile-content">
            <div className="profile-left">
              <FotoPenitip Foto={penitip.foto_penitip} />
              <div className="profile-details-container">
                <div className="left-details">
                  <div className="detail-item">
                    <b>Saldo</b>
                    <p>Rp{penitip.saldo?.toLocaleString('id-ID')},00</p>
                  </div>
                  <div className="detail-item">
                    <b>Poin Loyalitas</b>
                    <p>{penitip.poin_loyalitas} Poin</p>
                  </div>
                  <div className="detail-item">
                    <b>Badge</b>
                    <div className="badge-placeholder">{penitip.badge === 1 && <FaMedal color="#facc15" />}</div>
                  </div>
                </div>
                <div className="right-detail">
                  <div className="detail-item">
                    <b>Rating</b>
                    <p>{penitip.rerata_rating || "0"} / 5</p>
                  </div>
                </div>
              </div>
            </div>

            <Container className="input-container">
              <form>
                <InputColumn
                  nameLabel="fullName"
                  contentLabel="Nama Lengkap"
                  typeInput="text"
                  idInput="name"
                  placeholderInput={penitip.nama_penitip}
                  disabled
                />
                <InputColumn
                  nameLabel="email"
                  contentLabel="Email"
                  typeInput="email"
                  idInput="email"
                  placeholderInput={penitip.email_penitip}
                  disabled
                />
                <InputColumn
                  nameLabel="nik"
                  contentLabel="NIK"
                  typeInput="number"
                  idInput="nik"
                  placeholderInput={penitip.NIK}
                  disabled
                />
                <InputColumn
                  nameLabel="phone"
                  contentLabel="Nomor Telepon"
                  typeInput="number"
                  idInput="phone"
                  placeholderInput={penitip.nomor_telepon_penitip}
                  disabled
                />
                <InputColumn
                  nameLabel="dateBirth"
                  contentLabel="Tanggal Lahir"
                  typeInput="date"
                  idInput="dateBirth"
                  value={penitip.tanggal_lahir?.substring(0, 10)}
                  disabled
                />
              </form>
            </Container>
          </div>
        )}
      </Container>
      <br />
    </>
  );
};


export default ProfilePenitip;