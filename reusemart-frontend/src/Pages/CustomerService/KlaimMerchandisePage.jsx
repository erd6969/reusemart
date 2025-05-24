import './KlaimMerchandisePage.css';
import { Container, Button, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from 'react-toastify';

import { ShowUnverifiedBarang } from '../../api/apiBarang';
import { ShowAllTransaksiMerchandise } from '../../api/apiTransaksiMerchandise';
import ModalVerifikasi from '../../Components/Modal/ModalCS/ModalVerifikasi';
import ModalClaimMerchandise from '../../Components/Modal/ModalCS/ModalClaimMerchandise';

const KlaimMerchandisePage = () => {
    const [transaksiList, setTransaksiList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchData = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await ShowAllTransaksiMerchandise(page);
            const data = response.data.data;
            setTransaksiList(data);
            setTotalPages(response.data.last_page || 1);
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

    const handleOpenModal = (trm) => {
        setSelectedData(trm);
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

    return (
        <>
            <Container>
                <div className="KlaimMerchandisePage">
                    <h1 className="pageTitleKlaimMerchandise">Klaim Merchandise</h1>
                    <div className="p-2 d-flex justify-content-end">
                        <select
                            className="form-select w-auto"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">Show All</option>
                            <option value="unclaimed">Show Only Unclaimed</option>
                        </select>
                    </div>


                    <div className="tableContainerKlaimMerchandise">
                        <table className="dataTableKlaimMerchandise">
                            <thead>
                                <tr>
                                    <th>ID Transaksi Merchandise</th>
                                    <th>Nama Pembeli</th>
                                    <th>Merchandise</th>
                                    <th>Jumlah Klaim</th>
                                    <th>Tanggal Ambil</th>
                                    <th>Status Ambil</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(isLoading || isFirstLoad) ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            <Spinner animation="border" variant="primary" />
                                            <div>Loading...</div>
                                        </td>
                                    </tr>
                                ) : transaksiList.length > 0 ? (
                                    transaksiList
                                        .filter(trm => filterStatus === 'all' || trm.status_claim === 0)
                                        .map((trm) => (
                                            <tr key={trm.id_transaksi_merchandise}>
                                                <td>{trm.id_transaksi_merchandise}</td>
                                                <td>{trm.pembeli.nama_pembeli}</td>
                                                <td>{trm.merchandise.nama_merchandise}</td>
                                                <td>{trm.jumlah_claim}</td>
                                                <td>{trm.tanggal_claim ? trm.tanggal_claim : "Tanggal Belum di Set"}</td>
                                                <td className="text-center">
                                                    <Button
                                                        variant={trm.status_claim == 0 ? "danger" : "success"}
                                                        style={{ width: "100%" }}
                                                        cursor="pointer"
                                                    >
                                                        <b>{trm.status_claim == 0 ? "Belum Diambil" : "Sudah Diambil"}</b>
                                                    </Button>
                                                </td>
                                                <td className="text-center">
                                                    <Button
                                                        variant="warning"
                                                        style={{ width: "100%" }}
                                                        onClick={() => handleOpenModal(trm)}
                                                        cursor="pointer"
                                                    >
                                                        <b>Set</b>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            Tidak ada data transaksi merchandise yang ditemukan.
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

            <ModalClaimMerchandise
                show={showModal}
                handleClose={handleCloseModal}
                dataEdit={selectedData}
                onSuccess={handleSuccess}
            />
        </>
    );
};

export default KlaimMerchandisePage;
