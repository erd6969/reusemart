import './CSPenitipManagementPage.css';
import { Container, Button, Spinner, InputGroup, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { ShowAllPenitip, SearchPenitip, DeletePenitip } from '../../api/apiPenitip';
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { toast } from 'react-toastify';
// import ModalEditPenitip from '../../Components/Modal/ModalAdmin/ModalEditPenitip';

const CSPenitipManagementPage = () => {
    const [penitipList, setPenitipList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // digunakan untuk request ke backend
    const [searchValue, setSearchValue] = useState(""); // digunakan untuk input field
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPenitip, setSelectedPenitip] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchPenitipData = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await ShowAllPenitip(page);
            setPenitipList(response.data);
            setTotalPages(response.last_page);
            setCurrentPage(response.current_page);
        } catch (error) {
            console.error("Error fetching penitip data:", error);
            setPenitipList([]);
        } finally {
            setIsLoading(false);
            setIsFirstLoad(false);
        }
    };

    const fetchSearchData = async () => {
        if (searchQuery.trim() === "") {
            fetchPenitipData(1);
        } else {
            setIsLoading(true);
            try {
                const response = await SearchPenitip(searchQuery);
                setPenitipList(response.data);
                setCurrentPage(1);
            } catch (error) {
                console.error("Error searching penitip:", error);
                setPenitipList([]);
            } finally {
                setIsLoading(false);
                setIsFirstLoad(false);
            }
        }
    };

    useEffect(() => {
        fetchSearchData();
    }, [searchQuery]);

    const handleSearch = () => {
        setSearchQuery(searchValue); 
    };

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus penitip ini?")) {
            try {
                await DeletePenitip(id);
                fetchPenitipData(currentPage);
            } catch (error) {
                console.error("Gagal menghapus penitip:", error);
            }
        }
    };

    const handleEdit = (penitip) => {
        setSelectedPenitip(penitip);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedPenitip(null);
    };

    const handleUpdateSuccess = () => {
        fetchPenitipData(currentPage);
        toast.success("Data Penitip Berhasil Diperbarui.");
    };

    return (
        <Container>
            <div className="CSPage">
                <h1 className="pageTitle1">Master Penitip</h1>

                {/* Search Input */}
                <div className="searchComponent1">
                    <div className="searchContainer1">
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Masukkan Nama Penitip..."
                                className="searchInput"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <Button variant="secondary" onClick={handleSearch}>
                                <FaSearch />
                            </Button>
                        </InputGroup>
                    </div>
                </div>

                {/* Table */}
                <div className="tableContainer1">
                    <table className="dataTable1">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nama Penitip</th>
                                <th>Email</th>
                                <th>Telepon</th>
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
                            ) : penitipList.length > 0 ? (
                                penitipList.map((penitip) => (
                                    <tr key={penitip.id_penitip}>
                                        <td>PNT.{penitip.id_penitip}</td>
                                        <td>{penitip.nama_penitip}</td>
                                        <td>{penitip.email_penitip}</td>
                                        <td>{penitip.nomor_telepon_penitip}</td>
                                        <td className="actionButtons1">
                                            <Button variant="warning" onClick={() => handleEdit(penitip)}>Edit</Button>
                                            <Button variant="danger" onClick={() => handleDelete(penitip.id_penitip)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        Tidak ada data penitip yang ditemukan.
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
                        className="me-2"
                    >
                        <FaChevronLeft />
                    </Button>
                    <span>Halaman {currentPage} dari {totalPages}</span>
                    <Button
                        variant="secondary"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="ms-2"
                    >
                        <FaChevronRight />
                    </Button>
                </div>
            </div>

            {selectedPenitip && (
                <ModalEditPenitip
                    show={showModal}
                    handleClose={handleModalClose}
                    dataEdit={selectedPenitip}
                    onSuccess={handleUpdateSuccess}
                />
            )}
        </Container>
    );
};

export default CSPenitipManagementPage;
