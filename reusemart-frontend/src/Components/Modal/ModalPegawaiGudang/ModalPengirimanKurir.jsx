import { Modal, Container, Button, Form, Spinner } from "react-bootstrap";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { VerifKirimPembeli } from "../../../api/apiBarang";
import { GetListKurir } from "../../../api/apiPegawai";

const ModalPengirimanKurir = ({ show, handleClose, dataEdit, onSuccess }) => {
    const [formData, setFormData] = useState({ id_pegawai: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [listKurir, setListKurir] = useState([]);

    useEffect(() => {
        if (dataEdit) {
            setFormData({
                id_pegawai: dataEdit.id_pegawai || "",
            });
        }
    }, [dataEdit]);

    useEffect(() => {
        const fetchKurir = async () => {
            setIsLoading(true);
            try {
                const res = await GetListKurir(); // Ambil daftar kurir dari API
                setListKurir(res);
                console.log("Response GetListKurir:", res);
            } catch (err) {
                toast.error("Gagal memuat data kurir");
            }
            setIsLoading(false);
        };

        fetchKurir();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.id_pegawai) return toast.error("Pilih kurir terlebih dahulu!");
        console.log("Form Data:", dataEdit.id_transaksi_pembelian);
        try {
            if (dataEdit && dataEdit.id_transaksi_pembelian) {
                const formDataToSend = new FormData();
                formDataToSend.append("id_pegawai", formData.id_pegawai);
                formDataToSend.append("id_transaksi_pembelian", dataEdit.id_transaksi_pembelian);

                await VerifKirimPembeli(formDataToSend);
                toast.success("Kurir berhasil diset!");
                onSuccess?.();
                handleClose();
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                Object.values(error.response.data.errors).flat().forEach(toast.error);
            } else {
                toast.error(error.message || "Gagal melakukan set kurir");
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose} className="custom-modal-width">
            <Modal.Header closeButton>
                <Modal.Title><b>Kurir</b></Modal.Title>
            </Modal.Header>
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center p-4">
                    <Spinner animation="border" variant="primary" />
                    <span className="ms-2">Loading...</span>
                </div>
            ) : (
                <Container className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="id_pegawai">
                            <Form.Label>Pilih Kurir</Form.Label>
                            <Form.Select
                                name="id_pegawai"
                                value={formData.id_pegawai}
                                onChange={handleChange}
                            >
                                <option value="">-- Pilih Kurir --</option>
                                {listKurir?.map((kurir) => (
                                    <option key={kurir.id_pegawai} value={kurir.id_pegawai}>
                                        {kurir.nama_pegawai}
                                    </option>
                                ))}

                            </Form.Select>
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button
                                variant="primary"
                                type="submit"
                                style={{ backgroundColor: "#347928", border: "none", cursor: "pointer" }}
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

export default ModalPengirimanKurir;
