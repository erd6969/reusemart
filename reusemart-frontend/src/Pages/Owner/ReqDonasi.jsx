import './ReqDonasi.css';
import InputColumn from '../../Components/InputColumn';
import { Container, Button, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {  SearchRequestDonasiWaiting, ShowWaitingRequestDonasi } from '../../api/apiRequestDonasi';
import ModalDetailRequestDonasi from '../../Components/Modal/ModalOwner/ModalDetailRequestDonasi';
import ModalFormTransaksiDonasi from '../../Components/Modal/ModalOwner/ModalFormTransaksiDonasi';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from 'react-toastify';

const SearchComponent = ({ onSearch }) => {
    return (
        <div className="searchComponent">
            <div className="searchContainer">
                <InputColumn
                    typeInput="text"
                    idInput="nama_organisasi"
                    placeholderInput="Masukkan Nama Organisasi..."
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </div>
    );
};

const ReqDonasi = () => {
    const [request_donasiList, setRequestDonasiList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedRequestDonasi, setSelectedRequestDonasi] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchRequestDonasiData = async (page = 1) => {
        setIsLoading(true);
        ShowWaitingRequestDonasi(page)
            .then((data) => {
                console.log("Data fetched:", data.data);
                setRequestDonasiList(data.data);
                setTotalPages(data.last_page);
                setCurrentPage(data.current_page);
                setIsLoading(false);
                setIsFirstLoad(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setIsLoading(false);
                setIsFirstLoad(false);
            });
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedRequestDonasi(null);
    };

    const handleDetail = (data) => {
        setSelectedRequestDonasi(data);
        setShowModal(true);
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim().length >= 3) {
                setIsLoading(true);
                SearchRequestDonasiWaiting(searchQuery.trim())
                    .then((response) => {
                        const hasil = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
                        setRequestDonasiList(hasil);
                        setTotalPages(1); // Karena hasil pencarian tidak paginasi
                        setCurrentPage(1);
                    })
                    .catch((error) => {
                        console.error("Error searching request_donasi:", error);
                        setRequestDonasiList([]);
                    })
                    .finally(() => setIsLoading(false));
            } else {
                fetchRequestDonasiData(currentPage); // Aktifkan pagination saat tidak mencari
            }
        }, 50);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, currentPage]);


    return (
        <Container>
            <div className="adminMasterRequestDonasiPage">
                <h1 className="pageTitle">Master Request Donasi</h1>
                <SearchComponent onSearch={setSearchQuery} />
                <div className="tableContainer">
                    <table className="dataTable">
                        <thead>
                            <tr>
                                <th>ID Request Donasi</th>
                                <th>Nama Organisasi</th>
                                <th>Email</th>
                                <th>Telepon</th>
                                <th>Status Request</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading || isFirstLoad ? (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        <Spinner animation="border" variant="primary" />
                                        <div>Loading...</div>
                                    </td>
                                </tr>
                            ) : request_donasiList.length > 0 ? (
                                request_donasiList.map((data) => (
                                    <tr key={data.id_request_donasi}>
                                        <td>RQD.{data.id_request_donasi}</td>
                                        <td>{data.organisasi?.nama_organisasi}</td>
                                        <td>{data.organisasi?.email_organisasi}</td>
                                        <td>{data.organisasi?.nomor_telepon_organisasi}</td>
                                        <td style={{color:'blue'}}>{data.status_request}</td>
                                        <td className="actionButtons">
                                            <Button
                                                variant="success"
                                                onClick={() => handleDetail(data)}
                                                style={{
                                                    height: '35px',
                                                    width: '60px',
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: 0,
                                                }}
                                            >
                                                Detail
                                            </Button>

                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        Tidak ada data request_donasi yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination d-flex justify-content-center align-items-center mt-4">
                    <Button
                        variant="secondary"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="me-2 d-flex align-items-center justify-content-center"
                    >
                        <FaChevronLeft />
                    </Button>

                    <span>Halaman {currentPage} dari {totalPages}</span>

                    <Button
                        variant="secondary"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="ms-2 d-flex align-items-center justify-content-center"
                    >
                        <FaChevronRight />
                    </Button>
                </div>
            </div>


            <ModalDetailRequestDonasi
                show={showModal}
                handleClose={() => setShowModal(false)}
                dataDetail={selectedRequestDonasi}
                onSuccess={() => {
                    fetchRequestDonasiData(currentPage);  // Refresh list setelah terima/tolak
                    setShowModal(false);
                }}
                onAccept={() => {
                    setShowModal(false);      // Tutup modal detail
                    setShowFormModal(true);   // Buka modal form
                }}
            />

            <ModalFormTransaksiDonasi
                showModalForm={showFormModal}
                handleClose={() => {
                    setShowFormModal(false);  // Tutup form
                    setShowModal(true);       // Buka kembali modal detail
                }}
                id_request_donasi={selectedRequestDonasi?.id_request_donasi}
            />

        </Container>
    );
};

export default ReqDonasi;
