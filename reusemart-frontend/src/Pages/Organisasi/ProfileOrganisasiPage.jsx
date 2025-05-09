import { Container } from "react-bootstrap";
import "./ProfileOrganisasiPage.css";
import FotoOrganisasi from "../../Components/Organisasi/FotoOrganisasi";
import ProfileNavigation from "../../Components/Pembeli/ProfileHeader";
import InputColumn from "../../Components/InputColumn";
import { useState, useEffect } from "react";
import { GetProfile } from "../../api/apiOrganisasi";
import { getThumbnail } from "../../api/index";


const ProfileOrganisasi = () => {
  const [organisasi, setOrganisasi] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await GetProfile();
        setOrganisasi(data);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    }

    fetchProfile();
  }, []);


  if (!organisasi) return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Spinner animation="border" variant="primary" />
    </div>
  );

  return (
    <>
    <Container className="organisasi-container">
      <div className="profile-organisasi-header">
        <h1><b>Profil organisasi</b></h1>
        <hr />
      </div>
      <div className="profile-content">
        <div className="profile-left-org">
          
          {organisasi.foto_organisasi && (
            <FotoOrganisasi Foto={getThumbnail(organisasi.foto_organisasi)} />
          )}
        </div>

        <Container className="input-container-org">
          <form>
            <InputColumn
                nameLabel="fullName"
                contentLabel="Nama Lengkap"
                typeInput="text"
                idInput="name"
                placeholderInput={organisasi.nama_organisasi}
                disabled
            />
            <InputColumn
                nameLabel="email"
                contentLabel="Email"
                typeInput="email"
                idInput="email"
                placeholderInput={organisasi.email_organisasi}
                disabled
            />

            <InputColumn
                nameLabel="phone"
                contentLabel="Nomor Telepon"
                typeInput="number"
                idInput="phone"
                placeholderInput={organisasi.nomor_telepon_organisasi}
                disabled
            />
            <InputColumn
                nameLabel="address"
                contentLabel="Alamat"
                typeInput="text"
                idInput="address"
                placeholderInput={organisasi.alamat_organisasi}
                disabled
            />
          </form>
        </Container>
      </div>
    </Container>
    <br />
    </>
  );
};

export default ProfileOrganisasi;
