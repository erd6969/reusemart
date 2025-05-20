import React, { useEffect, useState } from 'react';
import { Container, Button, Spinner } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './PenitipanBarangPage.css';
import InputColumn from '../../Components/InputColumn';
import { ShowTransaksiPenitipan, SearchByPenitip } from '../../api/apiTransaksiPenitipan';
import { ShowAllPegawai, DeletePegawai, EditPegawai } from '../../api/apiPegawai';
import ModalEditTransaksiPenitipan from '../../Components/Modal/ModalPegawaiGudang/ModalEditTransaksiPenitipan';
import { toast } from 'react-toastify';
import ModalCreateTransaksiPenitipan from '../../Components/Modal/ModalPegawaiGudang/ModalCreateTransaksiPenitipan';


const SearchComponent = ({ onSearch }) => {
    return (
        <div className="searchComponent">
            <div className="searchContainer">
                <InputColumn
                    typeInput="text"
                    idInput="inputSearch"
                    placeholderInput="Masukkan Nama Penitip atau Email Penitip..."
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </div>
    );
};


const PenitipanBarangPage = () => {

    const [transaksiPenitipanList, setTransaksiPenitipanList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [selectedTransaksi, setSelectedTransaksi] = useState(null);
    const navigate = useNavigate();

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchTransaksiPenitipan = async (page = 1) => {
        setIsLoading(true);
        
        ShowTransaksiPenitipan(page).then((data) => {
            console.log("Pegawai Data:", data);
            setTransaksiPenitipanList(data.data);
            setTotalPages(data.last_page);
            setCurrentPage(data.current_page);
            setIsLoading(false);
            setIsFirstLoad(false);
        })
        .catch((error) => {
            console.error("Error fetching pegawai data:", error);
            setIsLoading(false);
            setIsFirstLoad(false);
        });
    };


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim().length >= 3) {
                setIsLoading(true);
                SearchByPenitip(searchQuery.trim())
                    .then((response) => {
                        const hasil = Array.isArray(response) ? response : [response];
                        setTransaksiPenitipanList(hasil);
                        setTotalPages(1);
                        setCurrentPage(1);
                    })
                    .catch((error) => {
                        console.error("Error searching organisasi:", error);
                        setTransaksiPenitipanList([]);
                    })
                    .finally(() => setIsLoading(false));
            } else {
                fetchTransaksiPenitipan(currentPage); 
            }
        }, 50);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, currentPage]);

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus pegawai ini?")) {
            try {
                await DeletePegawai(id);
                toast.success("Data Pegawai Berhasil Dihapus.");
                fetchTransaksiPenitipan(currentPage);
            } catch (error) {
                console.error("Gagal menghapus pegawai:", error);
            }
        }
    };

    const handleBarangPage = (id) => {
        navigate(`/pegawai-gudang/detail-transaksi-penitipan/${id}`);
    }

    const handleEdit = (tp) => {
        setSelectedTransaksi(tp);
        setShowModal(true);
    };
    
    const handleCreate = () => {
        setShowModalCreate(true);
    };

    const handleModalCreateClose = () => {
        setShowModalCreate(false);
    };

    const handleCreateSuccess = () => {
        fetchTransaksiPenitipan(currentPage);
        toast.success("Data Pegawai Berhasil Ditambahkan.");
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedTransaksi(null);
    };

    const handleUpdateSuccess = () => {
        fetchTransaksiPenitipan(currentPage);
        toast.success("Data Pegawai Berhasil Diperbarui.");
    };

    return (
        <Container>
            <div className="adminMasterPegawaiPage">
                <h1 className="pageTitle">Penitipan Barang Management</h1>
                <SearchComponent onSearch={setSearchQuery} />
                <div style={{display: "flex", justifyContent: "end", paddingInlineEnd: "20px"}}>
                    <Button variant="primary" onClick={() => handleCreate()}>Create Transaksi Penitipan</Button>
                </div>
                <div className="tableContainer">
                    <table className="dataTable">
                        <thead>
                            <tr>
                                <th>ID Penitipan</th>
                                <th>Tanggal Penitipan</th>
                                <th>Nama Penitip</th>
                                <th>Email penitip</th>
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
                            ) : transaksiPenitipanList.length > 0 ? (
                                transaksiPenitipanList.map((tp) => (
                                    <tr key={tp.id_transaksi_penitipan}>
                                        <td>PG.{tp.id_transaksi_penitipan}</td>
                                        <td>{tp.tanggal_penitipan}</td>
                                        <td>{tp.penitip.nama_penitip}</td>
                                        <td>{tp.penitip.email_penitip}</td>
                                        <td className="actionButtons">
                                            <Button variant="warning" onClick={() => handleEdit(tp)}>Edit</Button>
                                            <Button variant="success" onClick={() => handleBarangPage(tp.id_transaksi_penitipan)}>Barang</Button>
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

            {selectedTransaksi && (
                <ModalEditTransaksiPenitipan
                    show={showModal}
                    handleClose={handleModalClose}
                    dataEdit={selectedTransaksi}
                    onSuccess={handleUpdateSuccess}
                />
            )}

            {showModalCreate && (
                <ModalCreateTransaksiPenitipan
                    show={showModalCreate}
                    handleClose={handleModalCreateClose}
                    onSuccess={handleCreateSuccess}
                />
            )}
        </Container>

    );
};


export default PenitipanBarangPage;