import { Container } from "react-bootstrap";
import "./AlamatPembeliProfilePage.css";
import FotoPembeli from "../../Components/Pembeli/FotoPembeli";
import ProfileNavigation from "../../Components/Pembeli/ProfileHeader";
import profileImage from "../../assets/images/Pembeli/Yuki.jpeg";


const Poin = () => {
  return(
    <Container className="poin-container">
      <b>Poin Loyalitas</b>
      <p>119 Point</p>
    </Container>
  );
};

const InputColumn = ({nameLabel, contentLabel, typeInput, idInput, placeholderInput}) => {
  return (
    <div className="input-data-pembeli">
      <label htmlFor={nameLabel}>{contentLabel}</label>
      <input type={typeInput} id={idInput} placeholder={placeholderInput} />
    </div>
  );
}

const InputDataPembeli = () => {
  return(
    <Container className="input-container">
    </Container>
  );
};

const AlamatPembeliPage = () => {
  return (
    <Container className="pembeli-container">
      <ProfileNavigation Profile={{ fontWeight: "50" }} Alamat={{ fontWeight: "600", textDecoration: "underline"}}/>
      <div className="profile-content">
        <div className="profile-left">
          <FotoPembeli Foto={profileImage} SubProp={<p className="nama-pembeli">Yuki Suou</p>} />
          <Poin />
        </div>
        <InputDataPembeli />
      </div>
    </Container>
  );
};


export default AlamatPembeliPage;
