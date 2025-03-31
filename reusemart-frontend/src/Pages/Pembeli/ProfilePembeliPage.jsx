import { Container } from "react-bootstrap";
import "./ProfilePembeliPage.css";
import FotoPembeli from "../../Components/Pembeli/FotoPembeli";
import ProfileNavigation from "../../Components/Pembeli/ProfileHeader";
import InputColumn from "../../Components/InputColumn";
import profileImage from "../../assets/images/Pembeli/Yuki.jpeg";


const Poin = () => {
  return(
    <Container className="poin-container">
      <b>Poin Loyalitas</b>
      <p>119 Point</p>
    </Container>
  );
};

const InputDataPembeli = () => {
  return(
    <Container className="input-container">
          <InputColumn nameLabel="FullName" contentLabel="Full Name" typeInput="text" idInput="name" placeholderInput="Yuki Suou" />
          <InputColumn nameLabel="Email" contentLabel="Email" typeInput="email" idInput="email" placeholderInput="yukisuou@gmail.com" />
          <InputColumn nameLabel="TelephoneNumber" contentLabel="Telephone Number" typeInput="number" idInput="phone" placeholderInput="1234567890" />
          <InputColumn nameLabel="DateBirth" contentLabel="Date of Birth" typeInput="date" idInput="dateBirth" placeholderInput="" />
          <InputColumn nameLabel="Address" contentLabel="Address" typeInput="text" idInput="address" placeholderInput="Jl. Putangina No. 69" />
        <button className="input-button"><b>Save Change</b></button>
    </Container>
  );
};

const ProfilePembeli = () => {
  return (
    <Container className="pembeli-container">
      <ProfileNavigation Profile={{ fontWeight: "600", textDecoration: "underline" }} Alamat={{ fontWeight: "50"}} />
      <div className="profile-content">
        <div className="profile-left">
          <FotoPembeli 
            Foto={profileImage} 
            SubProp={
              <>
                <input type="file" id="upload" className="input-file" accept="image/*" />
                <label htmlFor="upload" className="button-profile">Choose Image</label>
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
