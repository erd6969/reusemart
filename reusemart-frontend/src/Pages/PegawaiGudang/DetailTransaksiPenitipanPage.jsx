import React, { useEffect, useState } from 'react';
import { Container, Button, Spinner } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import './DetailTransaksiPenitipanPage.css';
import InputColumn from '../../Components/InputColumn';
import { ShowTransaksiPenitipanById, SearchByPenitip, PreviewPdf } from '../../api/apiTransaksiPenitipan';
import ModalEditTransaksiPenitipan from '../../Components/Modal/ModalPegawaiGudang/ModalEditTransaksiPenitipan';
import { toast } from 'react-toastify';
import ModalCreateBarang from '../../Components/Modal/ModalPegawaiGudang/ModalCreateBarang';
import { ShowDTPByIdTransaksiPenitipan } from '../../api/apiDetailTransaksiPenitipan';
import ModalEditBarang from '../../Components/Modal/ModalPegawaiGudang/ModalEditBarang';
import { DeleteWithBarang } from '../../api/apiDetailTransaksiPenitipan';

const DetailTransaksiPenitipanPage = () => {
    const { id_transaksi_penitipan } = useParams();
    const [transaksiPenitipanList, setTransaksiPenitipanList] = useState();
    const [barangPenitipanList, setBarangPenitipanList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [selectedTransaksi, setSelectedTransaksi] = useState(null);
    const navigate = useNavigate();

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchTransaksiPenitipan = async () => {
        setIsLoading(true);
        
        ShowTransaksiPenitipanById(id_transaksi_penitipan).then((data) => {
            setTransaksiPenitipanList(data);
            setIsLoading(false);
            setIsFirstLoad(false);
        })
        .catch((error) => {
            console.error("Error fetching pegawai data:", error);
            setIsLoading(false);
            setIsFirstLoad(false);
        });
    };

    const fetchDetailTransaksiPenitipan = async () => {
        setIsLoading(true);
        ShowDTPByIdTransaksiPenitipan(id_transaksi_penitipan).then((data) => {
            setBarangPenitipanList(data.data);
            setIsLoading(false);
            setIsFirstLoad(false);    
        })
        .catch((error) => {
            console.error("Error fetching barang titipan data:", error);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchTransaksiPenitipan();
        fetchDetailTransaksiPenitipan();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            DeleteWithBarang(id).then(() => {
                toast.success("Data Barang Berhasil Dihapus.");
                fetchDetailTransaksiPenitipan();
            })
            .catch((error) => {
                console.error("Error deleting barang:", error);
                toast.error("Gagal menghapus data barang.");
            });
        }
    }

    const handleEdit = (bp) => {
        setSelectedTransaksi(bp);
        setShowModal(true);
    };
    
    const handleCreate = () => {
        setShowModalCreate(true);
    };

    const handleModalCreateClose = () => {
        setShowModalCreate(false);
    };

    const handleCreateSuccess = () => {
        fetchTransaksiPenitipan();
        fetchDetailTransaksiPenitipan();
        setShowModalCreate(false);
        toast.success("Data Pegawai Berhasil Ditambahkan.");
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedTransaksi(null);
    };

    const handleUpdateSuccess = () => {
        fetchTransaksiPenitipan();
        fetchDetailTransaksiPenitipan();
        toast.success("Data Pegawai Berhasil Diperbarui.");
    };

    const handleNota = () => {
        try{
            PreviewPdf(id_transaksi_penitipan);
        }catch (error) {
            if (error.response && error.response.data.errors) {
                const errors = error.response.data.errors;
                Object.values(errors).forEach((messages) => {
                    messages.forEach((msg) => toast.error(msg));
                });
            } else {
                toast.error(error.message || "Gagal melakukan create pegawai");
            }
        }
    };

    return (
        <Container>
            
                {isLoading ? (
                    <div
                            style={{
                                flex: 1,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                padding: "20px",
                            }}
                        >
                            <div style={{ textAlign: "center"}}>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    variant="primary"
                                    size="lg"
                                    role="status"
                                    aria-hidden="true"
                                />
                                <h6 className="mt-2 mb-0">Loading...</h6>
                            </div>
                        </div>
                    ) : (
                        <div className="adminMasterPegawaiPage">
                            <h1 className="pageTitle">Transaksi Penitipan milik: {transaksiPenitipanList?.penitip.nama_penitip}</h1>
                            <h1 className='pageTitle'>Tanggal Penitipan : {transaksiPenitipanList?.tanggal_penitipan}</h1>
                            <div style={{display: "flex", justifyContent: "end", paddingInlineEnd: "20px"}}>
                                <Button variant="secondary" onClick={() => handleNota()} className="me-2"> Cetak Nota </Button>
                                <Button variant="primary" onClick={() => handleCreate()}>Create Barang</Button>
                            </div>
                            <div className="tableContainer">
                                <table className="dataTable">
                                    <thead>
                                        <tr>
                                            <th>ID Detail Transaksi Penitipan</th>
                                            <th>ID Barang</th>
                                            <th>Nama Barang</th>
                                            <th>Harga Barang</th>
                                            <th>Status Penitipan</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {barangPenitipanList.length > 0 ? (
                                            barangPenitipanList.map((bp) => (
                                                <tr key={bp.id_detail_transaksi_penitipan}>
                                                    <td>DTP.{bp.id_detail_transaksi_penitipan}</td>
                                                    <td>BR.{bp.barang.id_barang}</td>
                                                    <td>{bp.barang.nama_barang}</td>
                                                    <td>{bp.barang.harga_barang}</td>
                                                    <td>{bp.status_penitipan}</td>
                                                    <td className="actionButtons">
                                                        <Button variant="warning" onClick={() => handleEdit(bp)}>Edit</Button>
                                                        <Button variant="danger" onClick={() => handleDelete(bp.id_detail_transaksi_penitipan)}>Delete</Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">
                                                    Tidak ada data Barang.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

            {selectedTransaksi && (
                <ModalEditBarang
                    show={showModal}
                    handleClose={handleModalClose}
                    dataBarang={selectedTransaksi}
                    onSuccess={handleUpdateSuccess}
                />
            )}

            {showModalCreate && (
                <ModalCreateBarang
                    show={showModalCreate}
                    handleClose={handleModalCreateClose}
                    onSuccess={handleCreateSuccess}
                    id_transaksi_penitipan={id_transaksi_penitipan}
                />
            )}
        </Container>

    );
};


export default DetailTransaksiPenitipanPage;