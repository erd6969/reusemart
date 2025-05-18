import { getThumbnail } from "../../../api/index";
import { Modal, Container, Button, Form } from "react-bootstrap";
import { useState, useEffect } from 'react';
import InputColumn from "../../InputColumn";
import { CreateTransaksiPenitipan } from "../../../api/apiTransaksiPenitipan";
import { toast } from 'react-toastify';
import { ShowAllJabatan } from "../../../api/apiJabatan";
import Dropdown from 'react-bootstrap/Dropdown';
import { Spinner } from "react-bootstrap";
import { SearchByEmail } from "../../../api/apiPenitip";

const ModalCreateTransaksiPenitipan = ({ show, handleClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        tanggal_penitipan: '',
        email_penitip: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [emailSuggestions, setEmailSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [skipEmail, setSkipEmail] = useState(true);

    useEffect(() => {
        let debounceTimer = null;
        if(!skipEmail){

            const fetchEmailSuggestions = async () => {
                if (formData.email_penitip.length > 2) {
                    try {
                        const response = await SearchByEmail(formData.email_penitip);
                        console.log("Email Suggestions:", response);
                        setEmailSuggestions(response);
                        setShowSuggestions(true);
                    } catch (error) {
                        setEmailSuggestions([]);
                    }
                } else {
                    setEmailSuggestions([]);
                    setShowSuggestions(false);
                }
            };
            debounceTimer = setTimeout(fetchEmailSuggestions, 300);
        }else{
            return;
        }

        return () => clearTimeout(debounceTimer);
    }, [formData.email_penitip]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSuggestionClick = (email, e) => {
        if(e){
            e.stopPropagation();
            e.preventDefault();
        }

        setSkipEmail(true);
        setFormData(prev => ({
            ...prev,
            email_penitip: email
        }));
        setShowSuggestions(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('tanggal_penitipan', formData.tanggal_penitipan);
            formDataToSend.append('email_penitip', formData.email_penitip);

            await CreateTransaksiPenitipan(formDataToSend);
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

    return (
        <Modal show={show} onHide={handleClose} className="custom-modal-width">
            <Modal.Header closeButton>
                <Modal.Title><b>Create Transaksi Penitipan</b></Modal.Title>
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
                        <Form.Group controlId="email_penitip" className="mb-3">
                            <Form.Label><b>Email Penitip</b></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Masukkan Email Penitip..."
                                value={formData.email_penitip}
                                onChange={handleChange}
                                name="email_penitip"
                                autoComplete="off"
                                onFocus={() => {
                                    setSkipEmail(false);
                                    setShowSuggestions(true);
                                }}
                                onBlur={() => {
                                    setSkipEmail(true);
                                    setShowSuggestions(false);
                                }}

                            />
                            {showSuggestions && emailSuggestions.length > 0 && (
                                <div style={{
                                    position: 'absolute',
                                    zIndex: 1000,
                                    width: '95%',
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    backgroundColor: 'white',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    {emailSuggestions.map((penitip, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid #eee'
                                            }}
                                            onMouseDown={(e) => handleSuggestionClick(penitip.email_penitip,e)}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                                        >
                                            {penitip.email_penitip}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Form.Group>

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
                                <b>Simpan Data</b>
                            </Button>
                        </div>
                    </form>
                </Container>
            )}
        </Modal>
    );
};

export default ModalCreateTransaksiPenitipan;