import { getThumbnail } from "../../../api/index";
import { Modal, Container, Button } from "react-bootstrap";
import { useState, useEffect } from 'react';
import InputColumn from "../../InputColumn";
import { UpdateTransaksiPenitipan } from "../../../api/apiTransaksiPenitipan";
import { EditPegawai } from '../../../api/apiPegawai';
import { toast } from 'react-toastify';
import { Spinner } from "react-bootstrap";
import { ShowAllJabatan } from "../../../api/apiJabatan";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { getThumbnailPegawai } from "../../../api/index";

const ModalEditTransaksiPenitipan = ({ show, handleClose, dataEdit, onSuccess }) => {
    const [formData, setFormData] = useState({
        email_penitip: '',
        tanggal_penitipan: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (dataEdit) {
            setFormData({
                email_penitip: dataEdit.penitip.email_penitip || '',
                tanggal_penitipan: dataEdit.tanggal_penitipan || '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (dataEdit && dataEdit.id_transaksi_penitipan) {
                const formDataToSend = new FormData();
                formDataToSend.append('email_penitip', formData.email_penitip);
                formDataToSend.append('tanggal_penitipan', formData.tanggal_penitipan);

                await UpdateTransaksiPenitipan(formDataToSend, dataEdit.id_transaksi_penitipan);
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
                <Modal.Title><b>Edit Transaksi Penitipan</b></Modal.Title>
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
                        
                        <InputColumn
                            nameLabel="email_penitip"
                            contentLabel="Email Penitip"
                            typeInput="text"
                            idInput="email_penitip"
                            placeholderInput={formData.email_penitip}
                            value={formData.email_penitip}
                            onChange={handleChange}
                            disabled={true}
                        />

                        <InputColumn
                            nameLabel="tanggal_penitipan"
                            contentLabel="Tanggal Penitipan"
                            typeInput="date"
                            idInput="tanggal_penitipan"
                            placeholderInput="Masukkan Tanggal Penitipan..."
                            value={formData.tanggal_penitipan}
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
            )}
        </Modal>
    );
};

export default ModalEditTransaksiPenitipan;
