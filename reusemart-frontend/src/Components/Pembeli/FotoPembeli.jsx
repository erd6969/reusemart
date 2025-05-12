import { useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import "./FotoPembeli.css";
import profileImage from "../../assets/images/blank-pembeli-profile-picture.png";

const FotoPembeli = ({ Foto, SubProp }) => {
  const [imagePreview, setImagePreview] = useState(Foto);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsLoading(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container>
      <br />
      <div className="foto-container">
        <div className="foto-pembeli">
          {isLoading && (
            <div className="foto-spinner">
              <Spinner animation="border" variant="primary" />
            </div>
          )}
          <img
            src={imagePreview}
            alt="Foto Pembeli"
            className="profile-image"
            style={{ display: isLoading ? "none" : "block" }}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
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

export default FotoPembeli;
