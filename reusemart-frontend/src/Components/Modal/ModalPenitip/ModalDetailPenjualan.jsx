import { useState, useEffect } from 'react';
import { Modal, Container, Button, Spinner } from "react-bootstrap";

import { GetDetailBarang } from "../../../api/apiBarang";
import { ShowDetailPendapatan } from "../../../api/apiPenitip";
import CarouselDetail from "../../Carousel/CarouselDetail";


import '../../../Pages/Homepage/DetailBarangPage.css';


const ModalDetailPenjualan = ({ show, handleClose, id_barang }) => {
    const [detailBarang, setDetailBarang] = useState(null);
    const [pendapatan, setPendapatan] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [barangRes, pendapatanRes] = await Promise.all([
                GetDetailBarang(id_barang),
                ShowDetailPendapatan(id_barang)
            ]);

            setDetailBarang(barangRes.barang);
            setPendapatan(pendapatanRes.data);
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
                <Modal.Title>Detail Penjualan</Modal.Title>
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
                    detailBarang && pendapatan && (
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
                                </div>
                            </Container>

                            <div className="detail-pendapatan">
                                <h5 className="mb-3">Rincian Pendapatan</h5>
                                <table className="table table-bordered">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Pendapatan Kotor</th>
                                            <th>Komisi Hunter</th>
                                            <th>Komisi ReuseMart</th>
                                            <th>Bonus Penitip</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Rp{pendapatan.total_harga_kotor?.toLocaleString('id-ID') || '-'}</td>
                                            <td>Rp{pendapatan.komisi_hunter?.toLocaleString('id-ID') || '-'}</td>
                                            <td>Rp{pendapatan.komisi_reusemart?.toLocaleString('id-ID') || '-'}</td>
                                            <td>Rp{pendapatan.bonus_penitip?.toLocaleString('id-ID') || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4" className="text-end fw-bold">
                                                Total Pendapatan Bersih: Rp{pendapatan.total_harga_bersih?.toLocaleString('id-ID') || '-'}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
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

export default ModalDetailPenjualan;
