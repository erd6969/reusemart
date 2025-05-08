import { getThumbnail } from "../../../api/index";
import { Modal, Container, Button } from "react-bootstrap";
import { useState, useEffect } from 'react';
import ShowColumn from "../../ShowColumn";
import { EditPegawai } from '../../../api/apiPegawai';
import { toast } from 'react-toastify';
import { Spinner } from "react-bootstrap";
import { AcceptRequestDonasi, RejectRequestDonasi, ShowRequestDonasiByIdBarang } from "../../../api/apiRequestDonasi";
import ModalFormTransaksiDonasi from './ModalFormTransaksiDonasi';

const ModalDetailRequestDonasi = ({ show, handleClose, dataDetail,  onSuccess, onAccept }) => {
    const [formData, setFormData] = useState({
        email_organisasi: '',
        nama_organisasi: '',
        alamat_organisasi: '',
        id_organisasi: 0,
        id_barang: 0,
        foto_organisasi: '',
        foto_barang: '',
        nama_barang: '',
        detail_request: '',
        nomor_telepon_organisasi: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedIdRequestDonasi, setSelectedIdRequestDonasi] = useState(null);

    useEffect(() => {
        if (dataDetail) {
            setFormData({
                email_organisasi: dataDetail.organisasi.email_organisasi || '',
                nama_organisasi: dataDetail.organisasi.nama_organisasi || '',
                alamat_organisasi: dataDetail.organisasi.alamat_organisasi || '',
                foto_organisasi: dataDetail.organisasi.foto_organisasi || '',
                id_organisasi: dataDetail.organisasi.id_organisasi || 0,
                id_barang: dataDetail.barang.id_barang || 0,
                foto_barang: dataDetail.barang.foto_barang || '',
                nama_barang: dataDetail.barang.nama_barang || '',
                detail_request: dataDetail.detail_request || '',
                nomor_telepon_organisasi: dataDetail.organisasi.nomor_telepon_organisasi || ''
            });
        }
    }, [dataDetail]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (dataDetail) {
                const formDataToSend = new FormData();
                formDataToSend.append('id_request_donasi', dataDetail.id_request_donasi);
                console.log("Payload yang akan dikirim:", formDataToSend);

                await RejectRequestDonasi(formDataToSend);
                onSuccess?.();
                toast.success("Request Donasi Berhasil Ditolak");
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

    const handleAccept = () => {
        setSelectedIdRequestDonasi(dataDetail.id_request_donasi);
        setShowForm(true);
        handleClose(); // Menutup modal sekarang
    };
    
    const handleReject = async () => {
        setIsLoading(true);
        try{
            const response = await RejectRequestDonasi(dataDetail.id_request_donasi);
            toast.success("Request Donasi Berhasil Ditolak");
            onSuccess?.();
            handleClose();
        }catch (error) {
            console.error("Error Rejecting request:", error);
            toast.error("Gagal menerima request donasi");
        } finally {
            setIsLoading(false);
        }
    }


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
                                        src={getThumbnail(formData.foto_organisasi)}
                                        alt="Gambar belum hehe"
                                        className="img-thumbnail" />
                                </div>
                            )}
                            <br />
                            {formData.foto_barang && (
                                <div className="existing-image">
                                    <img
                                        src={getThumbnail(formData.foto_barang)}
                                        alt="Gambar belum hehe"
                                        className="img-thumbnail" />
                                </div>
                            )}

                        </div>

                        <br />
                        <ShowColumn
                            nameLabel="nama_organisasi"
                            contentLabel="Nama Organisasi"
                            typeInput="text"
                            idInput="nama_organisasi"
                            placeholderInput={formData.nama_organisasi}
                            value={formData.nama_organisasi}
                            disabled={true}
                            onChange="" />
                        <ShowColumn
                            nameLabel="email_organisasi"
                            contentLabel="Email Organisasi"
                            typeInput="text"
                            idInput="email_organisasi"
                            placeholderInput={formData.email_organisasi}
                            value={formData.email_organisasi}
                            disabled={true}
                            onChange="" />
                        <ShowColumn
                            nameLabel="alamat_organisasi"
                            contentLabel="Alamat Organisasi"
                            typeInput="text"
                            idInput="alamat_organisasi"
                            placeholderInput={formData.alamat_organisasi}
                            value={formData.alamat_organisasi}
                            onChange=""
                            disabled={true} />

                        <ShowColumn
                            nameLabel="nomor_telepon_organisasi"
                            contentLabel="Nomor Telepon"
                            typeInput="text"
                            idInput="nomor_telepon_organisasi"
                            placeholderInput={formData.nomor_telepon_organisasi}
                            value={formData.nomor_telepon_organisasi}
                            onChange=""
                            disabled={true} />

                        <ShowColumn
                            nameLabel="Request (Barang)"
                            contentLabel="Request (Barang)"
                            typeInput="text"
                            idInput="Request (Barang)"
                            placeholderInput={formData.nama_barang}
                            value={formData.nama_barang}
                            onChange=""
                            disabled={true} />

                        <ShowColumn
                            nameLabel="Detail Request"
                            contentLabel="Detail Request"
                            typeInput="textarea"
                            idInput="Detail Request"
                            placeholderInput={formData.detail_request}
                            value={formData.detail_request}
                            onChange=""
                            disabled={true} />

                        <div className="mt-4">
                            <div className="d-flex justify-content-end mb-3">
                                <Button variant="primary" style={{ border: "none" }}>
                                    <b>Cek Organisasi Lain</b>
                                </Button>
                            </div>
                            <div className="d-flex justify-content-end" style={{ gap: "32px" }}>
                                <Button
                                    variant="success"
                                    style={{ border: "none" }}
                                    onClick={() => handleAccept()}
                                >
                                    <b>Terima</b>
                                </Button>
                                <Button
                                    variant="danger"
                                    type="submit"
                                    style={{ border: "none" }}
                                >
                                    <b>Tolak</b>
                                </Button>
                            </div>
                        </div>
                    </form>
                </Container>
            )}
        </Modal>
        
        <ModalFormTransaksiDonasi
                showModalForm={showForm}
                handleClose={() => setShowForm(false)}
                id_request_donasi={selectedIdRequestDonasi}
        />
        </>
    );
};

export default ModalDetailRequestDonasi;
