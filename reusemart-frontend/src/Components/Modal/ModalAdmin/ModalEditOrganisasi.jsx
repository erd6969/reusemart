import { Modal, Container, Button } from "react-bootstrap";
import { useState, useEffect } from 'react';
import InputColumn from "../../../Components/InputColumn";
import { EditOrganisasi } from '../../../api/apiOrganisasi';
import { toast } from 'react-toastify';

import { getThumbnailOrganisasi } from "../../../api/index";

const ModalEditOrganisasi = ({ show, handleClose, dataEdit, onSuccess }) => {
    const [formData, setFormData] = useState({
        email_organisasi: '',
        nama_organisasi: '',
        alamat_organisasi: '',
        nomor_telepon_organisasi: '',
        foto_organisasi: ''
    });
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (dataEdit) {
            setFormData({
                email_organisasi: dataEdit.email_organisasi || '',
                nama_organisasi: dataEdit.nama_organisasi || '',
                alamat_organisasi: dataEdit.alamat_organisasi || '',
                nomor_telepon_organisasi: dataEdit.nomor_telepon_organisasi || '',
                foto_organisasi: dataEdit.foto_organisasi || ''
            });
        }
    }, [dataEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setFormData(prev => ({
                ...prev,
                foto_organisasi: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (dataEdit && dataEdit.id_organisasi) {
                const formDataToSend = new FormData();
                formDataToSend.append('email_organisasi', formData.email_organisasi);
                formDataToSend.append('nama_organisasi', formData.nama_organisasi);
                formDataToSend.append('alamat_organisasi', formData.alamat_organisasi);
                formDataToSend.append('nomor_telepon_organisasi', formData.nomor_telepon_organisasi);
    
                if (formData.foto_organisasi instanceof File) {
                    formDataToSend.append('foto_organisasi', formData.foto_organisasi);
                }
    
                await EditOrganisasi(dataEdit.id_organisasi, formDataToSend);
                onSuccess?.();
                handleClose();
            }
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const errors = error.response.data.errors;
                Object.values(errors).forEach((messages) => {
                    messages.forEach((msg) => toast.error(msg));
                });
            } else {
                toast.error(error.message || "Gagal melakukan update organisasi");
            }
        }
    };
    

    return (
        <Modal show={show} onHide={handleClose} className="custom-modal-width">
            <Modal.Header closeButton>
                <Modal.Title><b>Edit Organisasi</b></Modal.Title>
            </Modal.Header>
            <Container className="modal-body">
                <form onSubmit={handleSubmit}>
                    <div className="image-container text-center">
                        {formData.foto_organisasi && !selectedImage && (
                            <div className="existing-image">
                                <img
                                    src={getThumbnailOrganisasi(formData.foto_organisasi)}
                                    alt="Existing Organisasi Foto"
                                    className="img-thumbnail"
                                    style={{ width: '250px', height: '250px' }}
                                />
                            </div>
                        )}

                        {selectedImage && (
                            <div className="image-preview">
                                <img
                                    src={selectedImage}
                                    alt="Selected"
                                    className="img-thumbnail"
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-group text-center mt-3">
                        <label htmlFor="foto_organisasi" className="btn btn-secondary">
                            Unggah Gambar
                        </label>
                        <input
                            type="file"
                            id="foto_organisasi"
                            name="foto_organisasi"
                            className="d-none"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <br />
                    <InputColumn
                        nameLabel="email_organisasi"
                        contentLabel="Email Organisasi"
                        typeInput="text"
                        idInput="email_organisasi"
                        placeholderInput="Masukkan Email Organisasi..."
                        value={formData.email_organisasi}
                        onChange={handleChange}
                    />
                    <InputColumn
                        nameLabel="nama_organisasi"
                        contentLabel="Nama Organisasi"
                        typeInput="text"
                        idInput="nama_organisasi"
                        placeholderInput="Masukkan Nama Organisasi..."
                        value={formData.nama_organisasi}
                        onChange={handleChange}
                    />
                    <InputColumn
                        nameLabel="alamat_organisasi"
                        contentLabel="Alamat Organisasi"
                        typeInput="text"
                        idInput="alamat_organisasi"
                        placeholderInput="Masukkan Alamat Organisasi..."
                        value={formData.alamat_organisasi}
                        onChange={handleChange}
                    />
                    <InputColumn
                        nameLabel="nomor_telepon_organisasi"
                        contentLabel="Nomor Telepon"
                        typeInput="text"
                        idInput="nomor_telepon_organisasi"
                        placeholderInput="Masukkan Nomor Telepon..."
                        value={formData.nomor_telepon_organisasi}
                        onChange={handleChange}
                    />
                    <div className="d-flex justify-content-end">
                        <Button 
                            variant="primary" 
                            type="submit" 
                            style={{ backgroundColor: "#347928", border: "none" }}
                        >
                            <b>Simpan Perubahan</b>
                        </Button>
                    </div>
                </form>
            </Container>
        </Modal>
    );
};

export default ModalEditOrganisasi;
