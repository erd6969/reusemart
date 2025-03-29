import { Container } from "react-bootstrap";
import "./ProfilePembeliPage.css";
import { Link } from "react-router-dom";

const ProfileNavigation = () => {
   
    return (
        <>
            <a href="/pembeli/profile">Profile</a> <span><a href="/">Alamat</a></span>
        </>
    );
  
};

const ProfilePembeli = () => {
    return(
        <ProfileNavigation />
    );
};

const PembeliPage = () => {
  return (
    <Container className="pembeli-container">
      <ProfilePembeli />
    </Container>
  );
};

export default PembeliPage;
