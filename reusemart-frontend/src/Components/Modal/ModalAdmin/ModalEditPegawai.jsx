import { getThumbnail } from "../../../api/index";
import { Modal, Container, Button } from "react-bootstrap";
import { useState, useEffect } from 'react';
import InputColumn from "../../InputColumn";
import { EditPegawai } from '../../../api/apiPegawai';
import { toast } from 'react-toastify';

const ModalEditPegawai = ({ show, handleClose, dataEdit, onSuccess }) => {
    const [formData, setFormData] = useState({
        email_pegawai: '',
        nama_pegawai: '',
        tanggal_lahir: '',
        foto_pegawai: ''
    });
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (dataEdit) {
            setFormData({
                email_pegawai: dataEdit.email_pegawai || '',
                nama_pegawai: dataEdit.nama_pegawai || '',
                tanggal_lahir: dataEdit.tanggal_lahir || '',
                foto_pegawai: dataEdit.foto_pegawai || ''
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
            setSelectedImage(URL.createObjectURL(file)); // Preview image
            setFormData(prev => ({
                ...prev,
                foto_pegawai: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (dataEdit && dataEdit.id_pegawai) {
                const formDataToSend = new FormData();
                formDataToSend.append('email_pegawai', formData.email_pegawai);
                formDataToSend.append('nama_pegawai', formData.nama_pegawai);
                formDataToSend.append('tanggal_lahir', formData.tanggal_lahir);
    
                if (formData.foto_pegawai instanceof File) {
                    formDataToSend.append('foto_pegawai', formData.foto_pegawai);
                }
    
                await EditPegawai(dataEdit.id_pegawai, formDataToSend);
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
                toast.error(error.message || "Gagal melakukan update pegawai");
            }
        }
    };
    

    return (
        <Modal show={show} onHide={handleClose} className="custom-modal-width">
            <Modal.Header closeButton>
                <Modal.Title><b>Edit Pegawai</b></Modal.Title>
            </Modal.Header>
            <Container className="modal-body">
                <form onSubmit={handleSubmit}>
                    <div className="image-container text-center">
                        {formData.foto_pegawai && !selectedImage && (
                            <div className="existing-image">
                                <img
                                    src={getThumbnail(formData.foto_pegawai)}
                                    alt="Existing Pegawai Foto"
                                    className="img-thumbnail"
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
                        <label htmlFor="foto_pegawai" className="btn btn-secondary">
                            Unggah Gambar
                        </label>
                        <input
                            type="file"
                            id="foto_pegawai"
                            name="foto_pegawai"
                            className="d-none"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <br />
                    <InputColumn
                        nameLabel="email_pegawai"
                        contentLabel="Email Pegawai"
                        typeInput="text"
                        idInput="email_pegawai"
                        placeholderInput="Masukkan Email Pegawai..."
                        value={formData.email_pegawai}
                        onChange={handleChange}
                    />
                    <InputColumn
                        nameLabel="nama_pegawai"
                        contentLabel="Nama Pegawai"
                        typeInput="text"
                        idInput="nama_pegawai"
                        placeholderInput="Masukkan Nama Pegawai..."
                        value={formData.nama_pegawai}
                        onChange={handleChange}
                    />
                    <InputColumn
                        nameLabel="tanggal_lahir"
                        contentLabel="Tanggal Lahir"
                        typeInput="text"
                        idInput="tanggal_lahir"
                        placeholderInput="Masukkan Alamat Pegawai..."
                        value={formData.tanggal_lahir}
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

export default ModalEditPegawai;
