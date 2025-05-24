import { getThumbnail } from "../../../api/index";
import { Modal, Container, Button, Form } from "react-bootstrap";
import { useState, useEffect } from 'react';
import InputColumn from "../../InputColumn";
import { SetTransaksiMerchandise } from "../../../api/apiTransaksiMerchandise";
import { toast } from 'react-toastify';
import { ShowAllJabatan } from "../../../api/apiJabatan";
import Dropdown from 'react-bootstrap/Dropdown';
import { Spinner } from "react-bootstrap";
import DropdownButton from 'react-bootstrap/DropdownButton';
import { SearchByEmail } from "../../../api/apiPenitip";

const ModalClaimMerchandise = ({ show, handleClose, onSuccess, dataEdit }) => {
    const [formData, setFormData] = useState({
        tanggal_claim: '',
        status_claim: 0,
        id_transaksi_merchandise: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [statusList, setStatusList] = useState([
        { label: 'Belum Diambil', value: 0 },
        { label: 'Sudah Diambil', value: 1 }
    ]);

    const [selectedStatus, setSelectedStatus] = useState("Belum Diambil");

    useEffect(() => {
        if (dataEdit) {
            setFormData({
                tanggal_claim: dataEdit.tanggal_claim || '',
                status_claim: dataEdit.status_claim || 0,
                id_transaksi_merchandise: dataEdit.id_transaksi_merchandise || 0,
            });

            setSelectedStatus(dataEdit.status_claim === 0 ? "Belum Diambil" : "Sudah Diambil");
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
            const formDataToSend = new FormData();
            formDataToSend.append('tanggal_claim', formData.tanggal_claim);
            formDataToSend.append('status_claim', formData.status_claim);
            formDataToSend.append('id_transaksi_merchandise', formData.id_transaksi_merchandise);

            await SetTransaksiMerchandise(formDataToSend);
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

    const handleStatus = (status) => {
        setFormData({ ...formData, status_claim: status.value});
        setSelectedStatus(status.label);
    }

    return (
        <Modal show={show} onHide={handleClose} className="custom-modal-width">
            <Modal.Header closeButton>
                <Modal.Title><b>Set Tanggal Claim dan Status Claim</b></Modal.Title>
            </Modal.Header>
            {isLoading ? (
                <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", height: "100%", padding: "20px" }}>
                    <div style={{ textAlign: "center" }}>
                        <Spinner as="span" animation="border" variant="primary" size="lg" role="status" aria-hidden="true" />
                        <h6 className="mt-2 mb-0">Loading...</h6>
                    </div>
                </div>
            ) : (
                <Container className="modal-body">
                    <form onSubmit={handleSubmit}>

                        <label style={{ marginBottom: "10px" }}>
                            <b>Status Claim</b>
                        </label>

                        <DropdownButton id="dropdown-basic-button" title={formData.status_claim == 0 ? "Belum Diambil" : selectedStatus} className="mb-3">
                            {statusList.map((status, index) => (
                                <Dropdown.Item
                                    key={index}
                                    onClick={() => handleStatus(status)}
                                >
                                    {status.label}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>

                        <InputColumn
                            nameLabel="tanggal_claim"
                            contentLabel="Tanggal Claim"
                            typeInput="date"
                            idInput="tanggal_claim"
                            placeholderInput="Masukkan Tanggal Claim..."
                            value={formData.tanggal_claim}
                            onChange={handleChange}
                        />

                        <div className="d-flex justify-content-end">
                            <Button
                                variant="primary"
                                type="submit"
                                style={{ backgroundColor: "#347928", border: "none" }}
                            >
                                <b>Simpan Data</b>
                            </Button>
                        </div>
                    </form>
                </Container>
            )}
        </Modal>
    );
};

export default ModalClaimMerchandise;