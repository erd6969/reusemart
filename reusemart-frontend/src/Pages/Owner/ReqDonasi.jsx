import './ReqDonasi.css';
import InputColumn from '../../Components/InputColumn';
import { Container, Button, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { ShowAllRequestDonasi, SearchRequestDonasi } from '../../api/apiRequestDonasi';
import ModalEditRequestDonasi from '../../Components/Modal/ModalAdmin/ModalEditRequestDonasi';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from 'react-toastify';

const SearchComponent = ({ onSearch }) => {
    return (
        <div className="searchComponent">
            <div className="searchContainer">
                <InputColumn 
                    typeInput="text"
                    idInput="nama_request_donasi"
                    placeholderInput="Masukkan Nama RequestDonasi..."
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

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchRequestDonasiData = async (page = 1) => {
        setIsLoading(true);
        ShowAllRequestDonasi(page)
            .then((data) => {
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


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim().length >= 3) {
                setIsLoading(true);
                SearchRequestDonasi(searchQuery.trim())
                    .then((response) => {
                        const hasil = Array.isArray(response.data) ? response.data : [response.data];
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
                                <th>ID</th>
                                <th>Nama Request Donasi</th>
                                <th>Alamat</th>
                                <th>Telepon</th>
                                <th>Email</th>
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
                                request_donasiList.map((org) => (
                                    <tr key={org.id_request_donasi}>
                                        <td>ORG.{org.id_request_donasi}</td>
                                        <td>{org.nama_request_donasi}</td>
                                        <td>{org.alamat_request_donasi}</td>
                                        <td>{org.nomor_telepon_request_donasi}</td>
                                        <td>{org.email_request_donasi}</td>
                                        <td className="actionButtons">
                                        <Button
                                            variant="warning"
                                            onClick={() => handleEdit(org)}
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
                                            Edit
                                        </Button>

                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(org.id_request_donasi)}
                                            style={{
                                                height: '35px',
                                                width: '65px',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: 0,
                                            }}
                                        >
                                            Delete
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

            {selectedRequestDonasi && (
                <ModalEditRequestDonasi
                    show={showModal}
                    handleClose={handleModalClose}
                    dataEdit={selectedRequestDonasi}
                    onSuccess={handleUpdateSuccess}
                />
            )}
        </Container>
    );
};

export default ReqDonasi;
