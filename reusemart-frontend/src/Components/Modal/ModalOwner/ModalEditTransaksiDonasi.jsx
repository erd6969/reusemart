import { getThumbnailOrganisasi } from "../../../api/index";
import { Modal, Container, Button } from "react-bootstrap";
import { useState, useEffect } from 'react';
import InputColumn from "../../InputColumn";
import { EditPegawai } from '../../../api/apiPegawai';
import { toast } from 'react-toastify';
import { Spinner } from "react-bootstrap";
import { UpdateRequestDanTransaksiDonasi } from "../../../api/apiRequestDonasi";
import { data, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";


const ModalEditTransaksiDonasi = ({ show, handleClose, dataDetail, onSuccess }) => {
    const [formData, setFormData] = useState({
        id_request_donasi: 0,
        email_organisasi: '',
        nama_organisasi: '',
        alamat_organisasi: '',
        id_organisasi: 0,
        foto_organisasi: '',
        detail_request: '',
        nomor_telepon_organisasi: '',
        id_transaksi_donasi: 0,
        nama_penerima: '',
        tanggal_donasi: '',
        status_request: '',
        id_barang: 0,
        nama_barang: '',

    });

    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (dataDetail) {
            setFormData({
                id_request_donasi: dataDetail.request_donasi.id_request_donasi || 0,
                email_organisasi: dataDetail.organisasi.email_organisasi || '',
                nama_organisasi: dataDetail.organisasi.nama_organisasi || '',
                alamat_organisasi: dataDetail.organisasi.alamat_organisasi || '',
                foto_organisasi: dataDetail.organisasi.foto_organisasi || '',
                id_organisasi: dataDetail.organisasi.id_organisasi || 0,
                detail_request: dataDetail.request_donasi.detail_request || '',
                nomor_telepon_organisasi: dataDetail.organisasi.nomor_telepon_organisasi || '',
                id_transaksi_donasi: dataDetail.request_donasi.status_request == "Rejected" ? 0 : dataDetail.id_transaksi_donasi || 0,
                nama_penerima: dataDetail.request_donasi.status_request == "Rejected" ? "" : dataDetail.nama_penerima || '',
                tanggal_donasi: dataDetail.request_donasi.status_request == "Rejected" ? "" : dataDetail.tanggal_donasi || '',
                status_request: dataDetail.request_donasi.status_request || '',
                id_barang: dataDetail.request_donasi.status_request == "Rejected" ? "" : dataDetail.barang.id_barang || 0,
                nama_barang: dataDetail.request_donasi.status_request == "Rejected" ? "" : dataDetail.barang.nama_barang || '',
            });
        }
    }, [dataDetail]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (dataDetail) {

                const formDataToSend = new FormData();
                formDataToSend.append('id_request_donasi', dataDetail.id_request_donasi);
                formDataToSend.append('id_transaksi_donasi', formData.id_transaksi_donasi);
                formDataToSend.append('status_request', formData.status_request);
                formDataToSend.append('nama_penerima', formData.nama_penerima);
                formDataToSend.append('tanggal_donasi', formData.tanggal_donasi);

                console.log("Payload yang akan dikirim:", formDataToSend.get('id_request_donasi'), 
                                                        formDataToSend.get('id_transaksi_donasi'),
                                                        formDataToSend.get('status_request'),
                                                        formDataToSend.get('nama_penerima'),
                                                        formDataToSend.get('tanggal_donasi'));
                                                        

                await UpdateRequestDanTransaksiDonasi(formDataToSend);
                onSuccess?.();
                toast.success("Berhasil Melakukan Update Request Donasi dan Transaksi Donasi");
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    return (
        <><Modal show={show} onHide={handleClose} className="custom-modal-width">
            <Modal.Header closeButton>
                <Modal.Title><b>Detail Request Donasi</b></Modal.Title>
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
                            aria-hidden="true" />
                        <h6 className="mt-2 mb-0">Loading...</h6>
                    </div>
                </div>
            ) : (
                <Container className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="image-container text-center">
                            {formData.foto_organisasi && (
                                <div className="existing-image">
                                    <img
                                        src={getThumbnailOrganisasi(formData.foto_organisasi)}
                                        alt="Gambar belum hehe"
                                        style={{ width: "200px", height: "200px" }}
                                        className="img-thumbnail" />

                                </div>
                            )}


                        </div>

                        <br />
                        <InputColumn
                            nameLabel="nama_organisasi"
                            contentLabel="Nama Organisasi"
                            typeInput="text"
                            idInput="nama_organisasi"
                            placeholderInput={formData.nama_organisasi}
                            value={formData.nama_organisasi}
                            disabled={true}
                            onChange="" />
                        <InputColumn
                            nameLabel="email_organisasi"
                            contentLabel="Email Organisasi"
                            typeInput="text"
                            idInput="email_organisasi"
                            placeholderInput={formData.email_organisasi}
                            value={formData.email_organisasi}
                            disabled={true}
                            onChange="" />
                        <InputColumn
                            nameLabel="alamat_organisasi"
                            contentLabel="Alamat Organisasi"
                            typeInput="text"
                            idInput="alamat_organisasi"
                            placeholderInput={formData.alamat_organisasi}
                            value={formData.alamat_organisasi}
                            onChange=""
                            disabled={true} />

                        <InputColumn
                            nameLabel="nomor_telepon_organisasi"
                            contentLabel="Nomor Telepon"
                            typeInput="text"
                            idInput="nomor_telepon_organisasi"
                            placeholderInput={formData.nomor_telepon_organisasi}
                            value={formData.nomor_telepon_organisasi}
                            onChange=""
                            disabled={true} />


                        <InputColumn
                            nameLabel="Detail Request"
                            contentLabel="Detail Request"
                            typeInput="textarea"
                            idInput="Detail Request"
                            placeholderInput={formData.detail_request}
                            value={formData.detail_request}
                            onChange=""
                            disabled={true} />

                        <InputColumn
                            nameLabel="Barang yang didonasi"
                            contentLabel="Barang yang didonasi"
                            typeInput="text"
                            idInput="Barang yang didonasi"
                            placeholderInput={formData.nama_barang}
                            value={formData.nama_barang}
                            onChange=""
                            disabled={true} />

                        <InputColumn
                            nameLabel="nama_penerima"
                            contentLabel="Nama Penerima"
                            typeInput="text"
                            idInput="nama_penerima"
                            placeholderInput={formData.nama_penerima}
                            value={formData.nama_penerima}
                            onChange={handleChange}
                            disabled={formData.status_request === "Rejected" || formData.status_request === "Waiting"} />

                        <InputColumn
                            nameLabel="tanggal_donasi"
                            contentLabel="Tanggal Donasi"
                            typeInput="date"
                            idInput="tanggal_donasi"
                            placeholderInput={formData.tanggal_donasi}
                            value={formData.tanggal_donasi}
                            onChange={handleChange}
                            disabled={formData.status_request === "Rejected" || formData.status_request === "Waiting"} />

                        <Form.Group className="mb-3">
                            <Form.Label>Status Request</Form.Label>
                            <Form.Select
                                name="status_request"
                                value={formData.status_request}
                                onChange={handleChange}
                            >
                                <option value="Accepted" disabled>Accepted</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Waiting">Waiting</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="mt-4">
                            <div className="d-flex justify-content-end" style={{ gap: "32px" }}>
                                <Button
                                    variant="danger"
                                    type="submit"
                                    style={{ border: "none" }}
                                >
                                    <b>Edit</b>
                                </Button>
                                
                            </div>
                        </div>
                    </form>
                </Container>
            )}
        </Modal>

        </>
    );
};

export default ModalEditTransaksiDonasi;
