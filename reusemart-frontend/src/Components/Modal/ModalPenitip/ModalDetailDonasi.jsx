import { useState, useEffect } from 'react';
import { Modal, Container, Button, Spinner } from "react-bootstrap";


import { GetDetailDonasiBarang } from "../../../api/apiPenitip";
import CarouselDetail from "../../Carousel/CarouselDetail";
import '../../../Pages/Homepage/DetailBarangPage.css';
import { getThumbnailBarang } from '../../../api/index';

const ModalDetailDonasi = ({ show, handleClose, id_barang }) => {
    const [detailBarang, setDetailBarang] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    const fetchData = async () => {
        try {
            const barangRes = await Promise.all([
                GetDetailDonasiBarang(id_barang),
                console.log("ID Barang:", id_barang)
            ]);
            console.log("Barang Res:", barangRes[0].data);
            setDetailBarang(barangRes[0].data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (show && id_barang) {
            setIsLoading(true);
            fetchData();
        }
    }, [show, id_barang]);



    let gambarBarang = [];
    if (detailBarang) {
        gambarBarang = [
            detailBarang.foto_barang,
            detailBarang.foto_barang2,
            detailBarang.foto_barang3
        ].filter(Boolean);
    }

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Detail Barang</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                            <div className="mt-2">Loading...</div>
                        </div>
                    </div>
                ) : (
                    console.log("Detail Barang:", detailBarang),
                    detailBarang && (
                        
                        <>
                            <Container className="detail-barang-container">
                                <div className="item-image-container-barang">
                                    <CarouselDetail gambar={gambarBarang} />
                                </div>

                                <div className="isi-detail-barang-container mb-4">
                                    <h3 className="mb-2"><b>{detailBarang.nama_barang}</b></h3>
                                    <h4 className="mb-3 text-success text-start"><b>Rp {Number(detailBarang.harga_barang).toLocaleString("id-ID")}</b></h4>

                                    <div className="mb-2">
                                        <strong>Deskripsi:</strong>
                                        <p>{detailBarang.deskripsi_barang}</p>
                                    </div>
                                    <div>
                                        <strong>Kondisi:</strong>
                                        <p>{detailBarang.kondisi_barang}</p>
                                    </div>
                                    <div>
                                        <strong>Berat:</strong>
                                        <p>{detailBarang.berat_barang} KG</p>
                                    </div>
                                    <div>
                                        <strong>Nama Organisasi:</strong>
                                        <p>{detailBarang.nama_organisasi}</p>
                                    </div>
                                    <div>
                                        <strong>Nama Penerima:</strong>
                                        <p>{detailBarang.nama_penerima}</p>
                                    </div>
                                    
                                </div>
                            </Container>
                        </>
                    )
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Tutup
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDetailDonasi;
