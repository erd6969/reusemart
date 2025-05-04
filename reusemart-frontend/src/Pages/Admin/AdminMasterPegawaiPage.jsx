import React, { useEffect, useState } from 'react';
import { Container, Button, Spinner } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AdminMasterPegawaiPage.css';
import InputColumn from '../../Components/InputColumn';
import { ShowAllPegawai } from '../../api/apiPegawai';
import { deletePegawai } from '../../api/apiPegawai';
import ModalEditPegawai from '../../Components/Modal/ModalAdmin/ModalEditPegawai';


const SearchComponent = ({ onSearch }) => {
    return (
        <div className="searchComponent">
            <div className="searchContainer">
                <InputColumn 
                    typeInput="text"
                    idInput="nama_pegawai"
                    placeholderInput="Masukkan Nama Pegawai..."
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </div>
    );
};


const AdminMasterPegawaiPage = () => {

    const [pegawaiList, setPegawaiList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPegawai, setSelectedPegawai] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchPegawaiData = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await ShowAllPegawai(page);
            console.log("Pegawai Data:", response);
            setPegawaiList(response.data);
            setTotalPages(response.last_page);
            setCurrentPage(response.current_page);
        } catch (error) {
            console.error("Error fetching pegawai data:", error);
            setPegawaiList([]);
        } finally {
            setIsLoading(false);
            setIsFirstLoad(false);
        }
    };


    useEffect(() => {
        fetchPegawaiData(currentPage);
    }, [currentPage]);

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus pegawai ini?")) {
            try {
                await deletePegawai(id);
                fetchPegawaiData(currentPage);
            } catch (error) {
                console.error("Gagal menghapus pegawai:", error);
            }
        }
    };

    const handleEdit = (pgw) => {
        setSelectedPegawai(pgw);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedPegawai(null);
    };

    const handleUpdateSuccess = () => {
        fetchPegawaiData(currentPage);
        toast.success("Data Pegawai Berhasil Diperbarui.");
    };

    return (
        <Container>
            <div className="adminMasterPegawaiPage">
                <h1 className="pageTitle">Master Pegawai</h1>
                <SearchComponent onSearch={setSearchQuery} />
                <div className="tableContainer">
                    <table className="dataTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>ID Jabatan</th>
                                <th>Email</th>
                                <th>Nama</th>
                                <th>Tanggal Lahir</th>
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
                            ) : pegawaiList.length > 0 ? (
                                pegawaiList.map((pgw) => (
                                    <tr key={pgw.id_pegawai}>
                                        <td>PG.{pgw.id_pegawai}</td>
                                        <td>{pgw.id_jabatan}</td>
                                        <td>{pgw.email_pegawai}</td>
                                        <td>{pgw.nama_pegawai}</td>
                                        <td>{pgw.tanggal_lahir}</td>
                                        <td className="actionButtons">
                                            <Button variant="warning" onClick={() => handleEdit(pgw)}>Edit</Button>
                                            <Button variant="danger" onClick={() => handleDelete(pgw.id_pegawai)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        Tidak ada data pegawai yang ditemukan.
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

            {selectedPegawai && (
                <ModalEditPegawai
                    show={showModal}
                    handleClose={handleModalClose}
                    dataEdit={selectedPegawai}
                    onSuccess={handleUpdateSuccess}
                />
            )}
        </Container>

    );
};


export default AdminMasterPegawaiPage;