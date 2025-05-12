import { getThumbnail } from "../../../api/index";
import { Modal, Container, Button } from "react-bootstrap";
import { useState, useEffect } from 'react';
import InputColumn from "../../InputColumn";
import { CreatePegawai } from '../../../api/apiPegawai';
import { toast } from 'react-toastify';
import { ShowAllJabatan } from "../../../api/apiJabatan";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Spinner } from "react-bootstrap";

const ModalCreatePegawai = ({ show, handleClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        id_jabatan: 0,
        email_pegawai: '',
        nama_pegawai: '',
        tanggal_lahir: '',
        password_pegawai: '',
        foto_pegawai: ''
    });
    const [selectedImage, setSelectedImage] = useState(null);

    const [jabatanList, setJabatanList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedJabatan, setSelectedJabatan] = useState("");

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

    const fetchJabatanData = async () => {
        setIsLoading(true);
        try {
            const response = await ShowAllJabatan();
            setJabatanList(response);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching jabatan data:", error);
            toast.error("Gagal memuat data jabatan");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJabatanData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('email_pegawai', formData.email_pegawai);
            formDataToSend.append('nama_pegawai', formData.nama_pegawai);
            formDataToSend.append('tanggal_lahir', formData.tanggal_lahir);
            formDataToSend.append('password_pegawai', formData.password_pegawai);
            formDataToSend.append('id_jabatan', formData.id_jabatan);

            if (formData.foto_pegawai instanceof File) {
                formDataToSend.append('foto_pegawai', formData.foto_pegawai);
            }

            await CreatePegawai(formDataToSend);
            onSuccess?.();
            handleClose();

        } catch (error) {
            if (error.response && error.response.data.errors) {
                const errors = error.response.data.errors;
                Object.values(errors).forEach((messages) => {
                    messages.forEach((msg) => toast.error(msg));
                });
            } else {
                toast.error(error.message || "Gagal melakukan create pegawai");
            }
        }
    };

    const handleJabatanSelect = (jabatan) => {
        setFormData({ ...formData, id_jabatan: jabatan.id_jabatan });
        setSelectedJabatan(jabatan.nama_jabatan);
    }


    return (
        <Modal show={show} onHide={handleClose} className="custom-modal-width">
            <Modal.Header closeButton>
                <Modal.Title><b>Create Pegawai</b></Modal.Title>
            </Modal.Header>
            {isLoading ? (
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        padding: "20px",
                    }}
                >
                    <div style={{ textAlign: "center" }}>
                        <Spinner
                            as="span"
                            animation="border"
                            variant="primary"
                            size="lg"
                            role="status"
                            aria-hidden="true"
                        />
                        <h6 className="mt-2 mb-0">Loading...</h6>
                    </div>
                </div>
            ) : (
                <Container className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="image-container text-center">
                            
                            {selectedImage && (
                                <div className="image-preview">
                                    <img
                                        src={selectedImage}
                                        alt="Selected"
                                        className="img-thumbnail"
                                        style={{ width: "200px", height: "200px" }}
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
                            typeInput="date"
                            idInput="tanggal_lahir"
                            placeholderInput="Masukkan Alamat Pegawai..."
                            value={formData.tanggal_lahir}
                            onChange={handleChange}
                        />

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
                            nameLabel="password_pegawai"
                            contentLabel="Password"
                            typeInput="text"
                            idInput="password_pegawai"
                            placeholderInput="Masukkan Password..."
                            value={formData.password_pegawai}
                            onChange={handleChange}
                        />

                        <label style={{ marginBottom: "10px" }}>
                            <b>Jabatan Pegawai</b>
                        </label>

                        <DropdownButton id="dropdown-basic-button" title={formData.id_jabatan == 0 ? "Pilih Jabatan" : selectedJabatan} className="mb-3">
                            {jabatanList.map((jabatan) => (
                                <Dropdown.Item
                                    key={jabatan.id_jabatan}
                                    onClick={() => handleJabatanSelect(jabatan)}
                                >
                                    {jabatan.nama_jabatan}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>

                        <div className="d-flex justify-content-end">
                            <Button
                                variant="primary"
                                type="submit"
                                style={{ backgroundColor: "#347928", border: "none" }}
                            >
                                <b>Simpan Pegawai</b>
                            </Button>
                        </div>
                    </form>

                </Container>
            )}
        </Modal>
    );
};

export default ModalCreatePegawai;
