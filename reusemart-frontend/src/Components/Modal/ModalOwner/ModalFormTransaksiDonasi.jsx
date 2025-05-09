import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AcceptRequestDonasi } from "../../../api/apiRequestDonasi";
import { useNavigate } from "react-router-dom";

const ModalFormTransaksiDonasi = ({ showModalForm, handleClose, id_request_donasi, id_barang }) => {
    const [namaPenerima, setNamaPenerima] = useState("");
    const [tanggalDiambil, setTanggalDiambil] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!tanggalDiambil) {
            toast.error("Tanggal Diambil wajib diisi!");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("id_request_donasi", id_request_donasi);
        formDataToSend.append("tanggal_donasi", tanggalDiambil);
        formDataToSend.append("nama_penerima", namaPenerima);
        formDataToSend.append("id_barang", id_barang);
        console.log("Payload yang akan dikirim:", formDataToSend.get("id_request_donasi"), formDataToSend.get("tanggal_donasi"), formDataToSend.get("nama_penerima"));

        try {
            const response = await AcceptRequestDonasi(formDataToSend);
            toast.info("Proses transaksi donasi...");
            console.log("Payload dikirim:", response.data);
            toast.success("Transaksi donasi berhasil diproses!");
            handleClose();
            navigate("/owner/req-donasi");
        } catch (error) {
            toast.error("Gagal menyimpan transaksi donasi.");
        }
    };

    return (
        <Modal show={showModalForm} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title><b>Form Donasi</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nama Penerima</Form.Label>
                        <Form.Control
                            type="text"
                            value={namaPenerima}
                            onChange={(e) => setNamaPenerima(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Tanggal Diambil</Form.Label>
                        <Form.Control
                            type="date"
                            value={tanggalDiambil}
                            onChange={(e) => setTanggalDiambil(e.target.value)}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-3">
                        <Button
                            variant="success"
                            type="submit"
                            style={{ minWidth: "100px" }}
                        >
                            <b>Accept</b>
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleClose}
                            style={{ minWidth: "100px" }}
                        >
                            <b>Kembali</b>
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ModalFormTransaksiDonasi;
