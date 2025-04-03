import { Container } from "react-bootstrap";
import "./ProfilePembeliPage.css";
import FotoPembeli from "../../Components/Pembeli/FotoPembeli";
import ProfileNavigation from "../../Components/Pembeli/ProfileHeader";
import InputColumn from "../../Components/InputColumn";
import profileImage from "../../assets/images/Pembeli/Yuki.jpeg";
import { useState } from "react";

const Poin = () => {
  return (
    <Container className="poin-container">
      <b>Poin Loyalitas</b>
      <p>119 Poin</p>
    </Container>
  );
};

const InputDataPembeli = () => {
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
          placeholderInput="Yuki Suou"
          value={formData.fullName}
          onChange={handleChange}
        />
        <InputColumn
          nameLabel="email"
          contentLabel="Email"
          typeInput="email"
          idInput="email"
          placeholderInput="yukisuou@gmail.com"
          value={formData.email}
          onChange={handleChange}
        />
        <InputColumn
          nameLabel="phone"
          contentLabel="Nomor Telepon"
          typeInput="number"
          idInput="phone"
          placeholderInput="1234567890"
          value={formData.phone}
          onChange={handleChange}
        />
        <InputColumn
          nameLabel="dateBirth"
          contentLabel="Tanggal Lahir"
          typeInput="date"
          idInput="dateBirth"
          placeholderInput=""
          value={formData.dateBirth}
          onChange={handleChange}
        />
        <InputColumn
          nameLabel="address"
          contentLabel="Alamat"
          typeInput="text"
          idInput="address"
          placeholderInput="Jl. Putangina No. 69"
          value={formData.address}
          onChange={handleChange}
        />
        <button type="submit" className="input-button"><b>Simpan</b></button>
      </form>
    </Container>
  );
};

const ProfilePembeli = () => {
  return (
    <Container className="pembeli-container">
      <ProfileNavigation Profile={{ fontWeight: "600", textDecoration: "underline", fontSize: "40px", color: "black" }} Alamat={{ fontWeight: "50", fontSize: "35px", color: "#AFAEAE" }} />
      <div className="profile-content">
        <div className="profile-left">
          <FotoPembeli 
            Foto={profileImage} 
            SubProp={
              <>
                <label htmlFor="upload" className="button-profile">Pilih Gambar</label>
              </>
            } 
          />
          <Poin />
        </div>
        <InputDataPembeli />
      </div>
    </Container>
  );
};

export default ProfilePembeli;
