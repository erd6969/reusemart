import { useState } from "react";
import { Container } from "react-bootstrap";
import "./FotoOrganisasi.css";

const FotoOrganisasi = ({ Foto, SubProp }) => {
  const [imagePreview, setImagePreview] = useState(Foto);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container>
      <br />
      <div className="foto-container-org">
        <div className="foto-organisasi">
          <img
            src={imagePreview}
            alt="Foto Organisasi"
            className="profile-image"
          />
          {SubProp}
        </div>
      </div>
      <input 
        type="file" 
        id="upload" 
        className="input-file" 
        accept="image/*" 
        onChange={handleImageChange}
      />
    </Container>
  );
};

export default FotoOrganisasi;
