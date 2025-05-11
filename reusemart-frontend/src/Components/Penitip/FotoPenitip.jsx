import { useState } from "react";
import { Container } from "react-bootstrap";
import "./FotoPenitip.css";
import { getThumbnailPenitip } from "../../api/index";

const FotoPenitip = ({ Foto }) => {
  const [imagePreview, setImagePreview] = useState(Foto);

  return (
    <Container>
      <br />
      <div className="foto-container-penitip">
        <div className="foto-penitip">
          <img
            src={getThumbnailPenitip(imagePreview)}
            alt="Foto Penitip"
            className="profile-image"
          />
        </div>
      </div>
    </Container>
  );
};

export default FotoPenitip;
