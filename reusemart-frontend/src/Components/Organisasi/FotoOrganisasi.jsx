import { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import "./FotoOrganisasi.css";

import { GetProfile } from "../../api/apiOrganisasi";
import { getThumbnailOrganisasi } from "../../api/index";

const FotoOrganisasi = ({ Foto, SubProp }) => {
  const [imagePreview, setImagePreview] = useState(Foto);
  const [organisasi, setOrganisasi] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Tambah loading state

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetProfile();
        setOrganisasi(data);
      } catch (error) {
        console.error("Gagal mengambil data Organisasi:", error);
      } finally {
        setLoading(false); // ✅ Selesai loading
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <br />
      <div className="foto-container-org">
        <div className="foto-organisasi">
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <img
              src={getThumbnailOrganisasi(organisasi.foto_organisasi)}
              alt="Foto Organisasi"
              className="profile-image"
            />
          )}
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
