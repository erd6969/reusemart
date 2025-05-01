import { Container } from "react-bootstrap";
import "./ProfilePenitip.css";
import FotoPenitip from "../../Components/Penitip/FotoPenitip";;
import InputColumn from "../../Components/InputColumn";
import profileImage from "../../assets/images/Pembeli/Yuki.jpeg";
import { useState } from "react";

const OtherDetail = () => {
    return (
      <div className="profile-details-container">
        <div className="left-details">
          <div className="detail-item">
            <b>Saldo</b>
            <p>Rp 10.000.000,00</p>
          </div>
          
          <div className="detail-item">
            <b>Poin Loyalitas</b>
            <p>1000 Poin</p>
          </div>
          
          <div className="detail-item">
            <b>Badge</b>
            <div className="badge-placeholder"></div>
          </div>
        </div>
        
        <div className="right-detail">
          <div className="detail-item">
            <b>Rating</b>
            <p>8,3</p>
          </div>
        </div>
      </div>
    );
};

const InputDataPenitip = () => {
  return (
    <Container className="input-container">
      <form>
        <InputColumn
          nameLabel="fullName"
          contentLabel="Nama Lengkap"
          typeInput="text"
          idInput="name"
          placeholderInput="Yuki Suou"
          disabled={true}
        />
        <InputColumn
          nameLabel="email"
          contentLabel="Email"
          typeInput="email"
          idInput="email"
          placeholderInput="yukisuou@gmail.com"
          disabled={true}
        />
        <InputColumn
          nameLabel="nik"
          contentLabel="NIK"
          typeInput="number"
          idInput="nik"
          placeholderInput="731289712"
          disabled={true}
        />
        <InputColumn
          nameLabel="phone"
          contentLabel="Nomor Telepon"
          typeInput="number"
          idInput="phone"
          placeholderInput="1234567890"
          disabled={true}
        />
        <InputColumn
          nameLabel="dateBirth"
          contentLabel="Tanggal Lahir"
          typeInput="date"
          idInput="dateBirth"
          placeholderInput=""
          disabled={true}
        />
      </form>
    </Container>
  );
};

const ProfilePenitip = () => {
  return (
    <>
    <Container className="penitip-container">
        <div className="profile-penitip-header">
            <h1><b>Profil Penitip</b></h1>
            <hr />
        </div>
        <div className="profile-content">
            <div className="profile-left">
                <FotoPenitip
                    Foto={profileImage} 
                />
            <OtherDetail />
            </div>
            <InputDataPenitip />
        </div>
    </Container>
    <br />
    </>
  );
};

export default ProfilePenitip;
