import { Modal, Container, Button } from "react-bootstrap";
import { useState, useEffect } from 'react';
import InputColumn from "../../InputColumn";
import { toast } from 'react-toastify';
import { Spinner } from "react-bootstrap";
import { VerifAmbilPembeli } from "../../../api/apiBarang";
import { data } from "react-router-dom";


const ModalUpdateTanggalPengiriman = ({ show, handleClose, dataEdit, onSuccess }) => {
    const [formData, setFormData] = useState({
        tanggal_pengiriman: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (dataEdit) {
            setFormData({
                tanggal_pengiriman: dataEdit.tanggal_pengiriman || '',
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
        console.log("Form Data:", dataEdit);
        try {
            if (dataEdit && dataEdit.id_transaksi_pembelian) {
                const formDataToSend = new FormData();
                formDataToSend.append('tanggal_pengiriman', formData.tanggal_pengiriman);

                await VerifAmbilPembeli(formDataToSend, dataEdit.id_transaksi_pembelian);
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
                toast.error(error.message || "Gagal melakukan set tangal pengirman");
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose} className="custom-modal-width">
            <Modal.Header closeButton>
                <Modal.Title><b>Tanggal Ambil</b></Modal.Title>
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
                            nameLabel="tanggal_pengiriman"
                            contentLabel="Tanggal Pengambilan"
                            typeInput="date"
                            idInput="tanggal_pengiriman"
                            placeholderInput="Masukkan Tanggal Pengambilan..."
                            value={formData.tanggal_pengiriman}
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

export default ModalUpdateTanggalPengiriman;
