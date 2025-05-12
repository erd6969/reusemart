import './AdminMasterPegawaiPage.css';
import InputColumn from '../../Components/InputColumn';
import { Container, Button, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { ShowAllOrganisasi, DeleteOrganisasi, SearchOrganisasi } from '../../api/apiOrganisasi';
import ModalEditOrganisasi from '../../Components/Modal/ModalAdmin/ModalEditOrganisasi';
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

const AdminMasterOrganisasiPage = () => {
    const [organisasiList, setOrganisasiList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrganisasi, setSelectedOrganisasi] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchOrganisasiData = async (page = 1) => {
        setIsLoading(true);
        ShowAllOrganisasi(page)
            .then((data) => {
                setOrganisasiList(data.data);
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

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus organisasi ini?")) {
            try {
                await DeleteOrganisasi(id);
                fetchOrganisasiData(currentPage);
            } catch (error) {
                console.error("Gagal menghapus organisasi:", error);
            }
        }
    };

    const handleEdit = (org) => {
        setSelectedOrganisasi(org);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedOrganisasi(null);
    };

    const handleUpdateSuccess = () => {
        fetchOrganisasiData(currentPage);
        toast.success("Data Organisasi Berhasil Diperbarui.");
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim().length >= 3) {
                setIsLoading(true);
                SearchOrganisasi(searchQuery.trim())
                    .then((response) => {
                        const hasil = Array.isArray(response.data) ? response.data : [response.data];
                        setOrganisasiList(hasil);
                        setTotalPages(1); // Karena hasil pencarian tidak paginasi
                        setCurrentPage(1);
                    })
                    .catch((error) => {
                        console.error("Error searching organisasi:", error);
                        setOrganisasiList([]);
                    })
                    .finally(() => setIsLoading(false));
            } else {
                fetchOrganisasiData(currentPage); // Aktifkan pagination saat tidak mencari
            }
        }, 50);
    
        return () => clearTimeout(delayDebounce);
    }, [searchQuery, currentPage]);
    

    return (
        <Container>
            <div className="adminMasterOrganisasiPage">
                <h1 className="pageTitle">Master Organisasi</h1>
                <SearchComponent onSearch={setSearchQuery} />
                <div className="tableContainer">
                    <table className="dataTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nama Organisasi</th>
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
                            ) : organisasiList.length > 0 ? (
                                organisasiList.map((org) => (
                                    <tr key={org.id_organisasi}>
                                        <td>ORG.{org.id_organisasi}</td>
                                        <td>{org.nama_organisasi}</td>
                                        <td>{org.alamat_organisasi}</td>
                                        <td>{org.nomor_telepon_organisasi}</td>
                                        <td>{org.email_organisasi}</td>
                                        <td className="actionButtons">
                                        <Button variant="warning" onClick={() => handleEdit(org)}>
                                            Edit
                                        </Button>

                                        <Button variant="danger" onClick={() => handleDelete(org.id_organisasi)}>
                                            Delete
                                        </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        Tidak ada data organisasi yang ditemukan.
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

            {selectedOrganisasi && (
                <ModalEditOrganisasi
                    show={showModal}
                    handleClose={handleModalClose}
                    dataEdit={selectedOrganisasi}
                    onSuccess={handleUpdateSuccess}
                />
            )}
        </Container>
    );
};

export default AdminMasterOrganisasiPage;
