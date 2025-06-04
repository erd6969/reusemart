import { Modal, Container, Button, Form, Spinner } from "react-bootstrap";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { VerifKirimPembeli } from "../../../api/apiBarang";
import { GetListKurir } from "../../../api/apiPegawai";

const ModalPengirimanKurir = ({ show, handleClose, dataEdit, onSuccess }) => {
    const [formData, setFormData] = useState({ id_pegawai: "", tanggal_pengiriman: "", jam_pengiriman: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [listKurir, setListKurir] = useState([]);

    useEffect(() => {
        if (dataEdit) {
            const [tanggal = "", jam = ""] = (dataEdit.tanggal_pengiriman || "").split("T");
            setFormData({
                id_pegawai: dataEdit.id_pegawai || "",
                tanggal_pengiriman: tanggal,
                jam_pengiriman: jam ? jam.slice(0, 5) : "",
                tanggal_pembelian: dataEdit.tanggal_pembelian || "",
            });
        }
    }, [dataEdit]);


    useEffect(() => {
        const fetchKurir = async () => {
            setIsLoading(true);
            try {
                const res = await GetListKurir();
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
        if (!formData.tanggal_pengiriman) return toast.error("Pilih tanggal pengiriman!");
        if (!formData.jam_pengiriman) return toast.error("Pilih jam pengiriman!");

        const [jam, menit] = formData.jam_pengiriman.split(":").map(Number);
        if (jam < 8 || jam > 20 || (jam === 20 && menit > 0)) {
            return toast.error("Jam pengiriman harus antara pukul 08:00 sampai 20:00");
        }

        // Ambil jam dari tanggal_pembelian dan cek jika lebih dari jam 16:00 (4 sore)
        if (formData.tanggal_pembelian) {
            const pembelianDate = new Date(formData.tanggal_pembelian);
            const jamPembelian = pembelianDate.getHours();
            if (jamPembelian >= 16 && formData.tanggal_pengiriman == pembelianDate.toISOString().split("T")[0]) {
                return toast.error("Transaksi setelah jam 16:00 tidak bisa diproses hari ini.");
            }
        }

        console.log("Form Data:", dataEdit.id_transaksi_pembelian);
        try {
            if (dataEdit && dataEdit.id_transaksi_pembelian) {
                const formDataToSend = new FormData();
                const datetimePengiriman = `${formData.tanggal_pengiriman} ${formData.jam_pengiriman}:00`;
                formDataToSend.append("id_pegawai", formData.id_pegawai);
                formDataToSend.append("id_transaksi_pembelian", dataEdit.id_transaksi_pembelian);
                formDataToSend.append("tanggal_pengiriman", datetimePengiriman);

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
                        <Form.Group className="mb-3" controlId="tanggal_pengiriman">

                            <Form.Label>Tanggal Pengiriman</Form.Label>
                            <Form.Control
                                type="date"
                                name="tanggal_pengiriman"
                                value={formData.tanggal_pengiriman}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="jam_pengiriman">
                            <Form.Label>Jam Pengiriman</Form.Label>
                            <Form.Control
                                type="time"
                                name="jam_pengiriman"
                                value={formData.jam_pengiriman}
                                onChange={handleChange}
                            />
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
