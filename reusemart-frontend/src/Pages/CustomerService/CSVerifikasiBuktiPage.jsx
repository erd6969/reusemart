import './CSVerifikasiBuktiPage.css';
import { Container, Button, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from 'react-toastify';

import { ShowUnverifiedBarang } from '../../api/apiBarang';
import ModalVerifikasi from '../../Components/Modal/ModalCS/ModalVerifikasi';

const CSVerifikasiBuktiPage = () => {
    const [transaksiList, setTransaksiList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const fetchData = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await ShowUnverifiedBarang(page);
            const data = response.transaksi?.data || [];
            setTransaksiList(data);
            setTotalPages(response.transaksi?.last_page || 1);
            console.log("Data fetched:", data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Gagal mengambil data transaksi");
        } finally {
            setIsLoading(false);
            setIsFirstLoad(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const handlePagination = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleOpenModal = (trx) => {
        setSelectedData(trx);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedData(null);
    };

    const handleSuccess = () => {
        fetchData(currentPage);
        handleCloseModal();
    };

    function formatNomorTransaksi(transaksi) {
        if (!transaksi || !transaksi.tanggal_pembelian || !transaksi.id_transaksi_pembelian) return '';

        const tanggal = new Date(transaksi.tanggal_pembelian);
        const year = tanggal.getFullYear().toString().slice(-2);
        const month = String(tanggal.getMonth() + 1).padStart(2, '0');
        const id = String(transaksi.id_transaksi_pembelian).padStart(3, '0');

        return `${year}.${month}.${id}`;
    }

    return (
        <>
            <Container>
                <div className="CSVerifikasiPage">
                    <h1 className="pageTitleVerifikasi">Verifikasi Pembayaran</h1>

                    <div className="tableContainerVerifikasi">
                        <table className="dataTableVerifikasi">
                            <thead>
                                <tr>
                                    <th>Nomor Transaksi</th>
                                    <th>Nama Pembeli</th>
                                    <th>Tanggal Pembayaran</th>
                                    <th>Total Harga</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(isLoading || isFirstLoad) ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            <Spinner animation="border" variant="primary" />
                                            <div>Loading...</div>
                                        </td>
                                    </tr>
                                ) : transaksiList.length > 0 ? (
                                    transaksiList.map((trx) => (
                                        <tr key={trx.id_transaksi_pembelian}>
                                            <td>{formatNomorTransaksi(trx)}</td>
                                            <td>{trx.nama_pembeli || "-"}</td>
                                            <td>{trx.tanggal_pembayaran || "-"}</td>
                                            <td>Rp{trx.total_pembayaran?.toLocaleString() || "0"}</td>
                                            <td className="text-center">
                                                <Button
                                                    variant="primary"
                                                    style={{ width: "100%" }}
                                                    onClick={() => handleOpenModal(trx)}
                                                >
                                                    <b>Verify</b>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            Tidak ada transaksi yang perlu diverifikasi.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination d-flex justify-content-center align-items-center mt-4">
                        <Button
                            variant="secondary"
                            disabled={currentPage === 1}
                            onClick={() => handlePagination(currentPage - 1)}
                            className="me-2"
                        >
                            <FaChevronLeft />
                        </Button>
                        <span>Halaman {currentPage} dari {totalPages}</span>
                        <Button
                            variant="secondary"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePagination(currentPage + 1)}
                            className="ms-2"
                        >
                            <FaChevronRight />
                        </Button>
                    </div>
                </div>
            </Container>

            <ModalVerifikasi
                show={showModal}
                handleClose={handleCloseModal}
                dataVerifikasi={selectedData}
                onSuccess={handleSuccess}
            />
        </>
    );
};

export default CSVerifikasiBuktiPage;
