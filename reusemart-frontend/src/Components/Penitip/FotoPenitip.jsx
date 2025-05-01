import { useState } from "react";
import { Container } from "react-bootstrap";
import "./FotoPenitip.css";

const FotoPenitip = ({ Foto }) => {
  const [imagePreview, setImagePreview] = useState(Foto);

  return (
    <Container>
      <br />
      <div className="foto-container">
        <div className="foto-penitip">
          <img
            src={imagePreview}
            alt="Foto Penitip"
            className="profile-image"
          />
        </div>
      </div>
    </Container>
  );
};

export default FotoPenitip;
