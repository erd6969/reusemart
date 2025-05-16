import { Container } from "react-bootstrap";
import "./ProfilePembeliPage.css";
import FotoPembeli from "../../Components/Pembeli/FotoPembeli";
import ProfileNavigation from "../../Components/Pembeli/ProfileHeader";
import InputColumn from "../../Components/InputColumn";
import { useState, useEffect } from "react";
import { GetProfile } from "../../api/apiPembeli";
import { getThumbnailPembeli } from "../../api/index";


const Poin = (profile) => {
  return (
    <Container className="poin-container">
      <b>Poin Loyalitas</b>
      <p>{profile = profile.poin_loyalitas} Poin</p>
    </Container>
  );
};

const InputDataPembeli = ({ profile }) => {

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateBirth: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };


  return (
    <Container className="input-container">
      <form onSubmit={handleSubmit}>
        <InputColumn
          nameLabel="fullName"
          contentLabel="Nama Lengkap"
          typeInput="text"
          idInput="name"
          placeholderInput={profile.nama_pembeli}
          value={formData.fullName}
          onChange={handleChange}
        />
        <InputColumn
          nameLabel="email"
          contentLabel="Email"
          typeInput="email"
          idInput="email"
          placeholderInput={profile.email_pembeli}
          value={formData.email}
          onChange={handleChange}
        />
        <InputColumn
          nameLabel="phone"
          contentLabel="Nomor Telepon"
          typeInput="number"
          idInput="phone"
          placeholderInput={profile.nomor_telepon_pembeli}
          value={formData.phone}
          onChange={handleChange}
        />
        <InputColumn
          nameLabel="dateBirth"
          contentLabel="Tanggal Lahir"
          typeInput="date"
          idInput="dateBirth"
          placeholderInput={profile.tanggal_lahir}
          value={formData.dateBirth}
          onChange={handleChange}
        />
        {/* <button type="submit" className="input-button"><b>Simpan</b></button> */}
      </form>
    </Container>
  );
};

const ProfilePembeli = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const showProfile = async () => {
      try {
        const data = await GetProfile();
        console.log('test', data);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    }

    showProfile();
  }, []);


  return (
    <Container className="pembeli-container">
      <ProfileNavigation Profile={{ fontWeight: "600", textDecoration: "underline", fontSize: "40px", color: "black" }} Alamat={{ fontWeight: "50", fontSize: "35px", color: "#AFAEAE" }} />
      <div className="profile-content">
        <div className="profile-left">
          {profile.foto_pembeli && (
            <FotoPembeli
              Foto={getThumbnailPembeli(profile.foto_pembeli)}
              SubProp={
                <>
                  {/* <label htmlFor="upload" className="button-profile">Pilih Gambar</label> */}
                </>
              }
            />
          )}
          <Container className="poin-container">
            <b>Poin Loyalitas</b>
            <p>{profile.poin_loyalitas} Poin</p>
          </Container>
        </div>
        <InputDataPembeli profile={profile} />
      </div>
    </Container>
  );
};

export default ProfilePembeli;
