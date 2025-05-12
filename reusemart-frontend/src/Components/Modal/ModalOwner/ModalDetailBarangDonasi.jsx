import { getThumbnailBarang } from "../../../api/index";
import { Modal, Container, Button } from "react-bootstrap";
import { useState, useEffect } from 'react';
import ShowColumn from "../../ShowColumn";
import { EditPegawai } from '../../../api/apiPegawai';
import { toast } from 'react-toastify';
import { Spinner } from "react-bootstrap";
import { RejectRequestDonasi, ShowRequestDonasiByIdBarang } from "../../../api/apiRequestDonasi";
import ModalFormTransaksiDonasi from './ModalFormTransaksiDonasi';
import { data, useNavigate } from "react-router-dom";


const ModalDetailBarangDonasi = ({ show, handleClose, dataBarang,  onSuccess, dataReqDon, onAccept }) => {
    const [formData, setFormData] = useState({
        nama_barang: '',
        harga_barang: '',
        kondisi_barang: 0,
        foto_barang: '',
        deskripsi_barang: '',
        tanggal_garansi: '',
        nama_organisasi:  '',
        id_request_donasi: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (dataBarang) {
            setFormData({
                nama_barang: dataBarang.nama_barang || '',
                harga_barang: dataBarang.harga_barang || '',
                foto_barang: dataBarang.foto_barang || '',
                kondisi_barang: dataBarang.kondisi_barang || 0,
                deskripsi_barang: dataBarang.deskripsi_barang || '',
                tanggal_garansi: dataBarang.tanggal_garansi || '',
                nama_organisasi: dataReqDon.nama_organisasi || '',
                id_request_donasi: dataReqDon.id_request_donasi || 0,
            });
        }
    }, [dataBarang]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (dataBarang) {
                const formDataToSend = new FormData();
                formDataToSend.append('id_request_donasi', dataBarang.id_request_donasi);
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
        onAccept(dataBarang.id_barang);
    };
    
    const handleShowBarang = () => {
        navigate(`/owner/req-donasi-show-barang/${dataOrganisasi.nama_barang}/${dataBarang.id_request_donasi}`);
        handleClose(); // Menutup modal sekarang
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
                            {formData.foto_barang && (
                                <div className="existing-image">
                                    <img
                                        src={getThumbnailBarang(formData.foto_barang)}
                                        alt="Gambar belum hehe"
                                        style={{ width: "200px", height: "200px" }}
                                        className="img-thumbnail" />

                                </div>
                            )}
                            

                        </div>

                        <br />
                        <ShowColumn
                            nameLabel="nama_barang"
                            contentLabel="Nama Barang"
                            typeInput="text"
                            idInput="nama_barang"
                            placeholderInput={formData.nama_barang}
                            value={formData.nama_barang}
                            disabled={true}
                            onChange="" />
                        <ShowColumn
                            nameLabel="harga_barang"
                            contentLabel="Harga Barang"
                            typeInput="text"
                            idInput="harga_barang"
                            placeholderInput={formData.harga_barang}
                            value={formData.harga_barang}
                            onChange=""
                            disabled={true} />

                        <ShowColumn
                            nameLabel="tanggal_garansi"
                            contentLabel="Tanggal Garansi"
                            typeInput="text"
                            idInput="tanggal_garansi"
                            placeholderInput={formData.tanggal_garansi || 'Tidak ada Garansi'}
                            value={formData.tanggal_garansi}
                            onChange=""
                            disabled={true} />

                        <ShowColumn
                            nameLabel="kondisi_barang"
                            contentLabel="Kondisi Barang"
                            typeInput="text"
                            idInput="kondisi_barang"
                            placeholderInput={formData.kondisi_barang}
                            value={formData.kondisi_barang}
                            onChange=""
                            disabled={true} />

                        <ShowColumn
                            nameLabel="Detail Request"
                            contentLabel="Detail Request"
                            typeInput="textarea"
                            idInput="Detail Request"
                            placeholderInput={formData.deskripsi_barang}
                            value={formData.deskripsi_barang}
                            onChange=""
                            disabled={true} />

                        <div className="mt-4">
                            <div className="d-flex justify-content-end" style={{ gap: "32px" }}>
                                <Button
                                    variant="primary"
                                    style={{ border: "none" }}
                                    onClick={handleAccept}
                                >
                                    <b>Pilih Barang</b>
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

export default ModalDetailBarangDonasi;
