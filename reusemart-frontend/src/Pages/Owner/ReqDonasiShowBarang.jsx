import './ReqDonasiShowBarang.css';
import InputColumn from '../../Components/InputColumn';
import { Container, Button, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { SearchBarangByOpenDonasi } from '../../api/apiRequestDonasi';
import ModalDetailRequestDonasi from '../../Components/Modal/ModalOwner/ModalDetailRequestDonasi';
import ModalFormTransaksiDonasi from '../../Components/Modal/ModalOwner/ModalFormTransaksiDonasi';
import { ShowBarangByOpenDonasi } from '../../api/apiRequestDonasi';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import ModalDetailBarangDonasi from '../../Components/Modal/ModalOwner/ModalDetailBarangDonasi';

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

const ReqDonasiShowBarang = () => {
    const { nama_organisasi, id_request_donasi } = useParams();
    const [barangOpenDonasi, setBarangOpenDonasi] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedBarangDonasi, setSelectedBarangDonasi] = useState(null);
    const [selectedIdBarang, setSelectedIdBarang] = useState(null);
    const dataReqDon = {
        id_request_donasi: id_request_donasi,
        nama_organisasi: nama_organisasi,
    };
    const [showFormModal, setShowFormModal] = useState(false);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchBarangDonasiData = async (page = 1) => {
        setIsLoading(true);
        ShowBarangByOpenDonasi(page)
            .then((data) => {
                console.log("Data fetched:", data.data);
                setBarangOpenDonasi(data.data);
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
        setSelectedBarangDonasi(null);
    };

    const handleDetail = (data) => {
        setSelectedBarangDonasi(data);
        
        setShowModal(true);
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim().length >= 3) {
                setIsLoading(true);
                SearchBarangByOpenDonasi(searchQuery.trim())
                    .then((response) => {
                        const hasil = Array.isArray(response.data) ? response.data : [response.data];
                        setBarangOpenDonasi(hasil);
                        setTotalPages(1); // Karena hasil pencarian tidak paginasi
                        setCurrentPage(1);
                    })
                    .catch((error) => {
                        console.error("Error searching request_donasi:", error);
                        setBarangOpenDonasi([]);
                    })
                    .finally(() => setIsLoading(false));
            } else {
                fetchBarangDonasiData(currentPage); // Aktifkan pagination saat tidak mencari
            }
        }, 50);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, currentPage]);


    return (
        <Container>
            <div className="adminMasterBarangDonasiPage">
                <h1 className="pageTitle">Nama Organisasi : {nama_organisasi}</h1>
                <h1 className="pageTitle">Pilihan Barang yang siap didonasikan</h1>
                <SearchComponent onSearch={setSearchQuery} />
                <div className="tableContainer">
                    <table className="dataTable">
                        <thead>
                            <tr>
                                <th>ID Barang</th>
                                <th>Nama Barang</th>
                                <th>Harga Barang</th>
                                <th>Tanggal Garansi</th>
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
                            ) : barangOpenDonasi.length > 0 ? (
                                barangOpenDonasi.map((data) => (
                                    <tr key={data.id_barang}>
                                        <td>BR.{data.id_barang}</td>
                                        <td>{data.nama_barang}</td>
                                        <td>{data.harga_barang}</td>
                                        <td>{data.tanggal_garansi || 'Tidak ada Garansi'}</td>
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


            <ModalDetailBarangDonasi
                show={showModal}
                handleClose={() => setShowModal(false)}
                dataBarang={selectedBarangDonasi}
                onSuccess={() => {
                    fetchBarangDonasiData(currentPage);  // Refresh list setelah terima/tolak
                    setShowModal(false);
                }}
                onAccept={(idBarang) => {
                    setSelectedIdBarang(idBarang); // simpan id_barang
                    setShowModal(false);
                    setShowFormModal(true);
                }}
                dataReqDon={dataReqDon}
            />

            <ModalFormTransaksiDonasi
                showModalForm={showFormModal}
                handleClose={() => {
                    setShowFormModal(false);  // Tutup form
                    setShowModal(false);
                }}
                id_request_donasi={dataReqDon.id_request_donasi}
                id_barang={selectedIdBarang} 
            />

        </Container>
    );
};

export default ReqDonasiShowBarang;
