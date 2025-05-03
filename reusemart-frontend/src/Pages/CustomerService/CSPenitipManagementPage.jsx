import './CSPenitipManagementPage.css';
import InputColumn from '../../Components/InputColumn';
import { Container, Button, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { ShowAllPenitip, SearchPenitip, DeletePenitip } from '../../api/apiPenitip';
// import ModalEditPenitip from '../../Components/Modal/ModalAdmin/ModalEditPenitip';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from 'react-toastify';

const SearchComponent = ({ onSearch }) => {
    return (
        <div className="searchComponent">
            <div className="searchContainer">
                <InputColumn 
                    typeInput="text"
                    idInput="nama_penitip"
                    placeholderInput="Masukkan Nama Penitip..."
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </div>
    );
};

const CSPenitipManagementPage = () => {
    const [penitipList, setPenitipList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
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

    useEffect(() => {
        fetchPenitipData(currentPage);
    }, [currentPage]);

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
                <SearchComponent onSearch={setSearchQuery} />
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
