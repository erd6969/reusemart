// import './SoldProductPage.css';
import { useState, useEffect } from 'react';
import SearchIcon from "../../assets/images/search-icon.png";
import { Button, Badge } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { toast } from 'react-toastify';

import { ShowAmbilBarang, VerifAmbil, SearchBarangVerif } from "../../api/apiBarang";
import { getThumbnailBarang } from "../../api/index";
import ModalDetailPenjualan from "../../Components/Modal/ModalPenitip/ModalDetailBarang";

const VerifikasiSelesaiPage = () => {
    const [ambilBarang, setAmbilBarang] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);


    const fetchAmbilBarang = async (page = 1) => {
        try {
            const response = await ShowAmbilBarang(page);
            setAmbilBarang(response.data);
            setTotalPages(response.last_page);
            setCurrentPage(response.current_page);
            console.log("Fetched barang ambil products:", response);

        } catch (error) {
            console.error("Error fetching ambil barang products:", error);
            setAmbilBarang([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAmbilBarang(currentPage);
    }, [currentPage]);

    const handleOpenModal = (id_barang) => {
        setSelectedProductId(id_barang);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProductId(null);
    };

    const handleVerifikasi = async (id_detail_transaksi_penitipan) => {
        setLoading(true);
        try {
            const response = await VerifAmbil(id_detail_transaksi_penitipan);
            console.log("Extend response:", response);
            toast.success("Berhasil verif");
            fetchAmbilBarang();
        } catch (error) {
            console.error("Error extending product:", error);
            toast.error("Gagal verif");
        } finally {
            setLoading(false);
        }
    }


    const handlePagination = (page) => {
        if (page >= 1 && page <= totalPages) {
            setLoading(true);
            setCurrentPage(page);
            fetchAmbilBarang(page);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim().length >= 3) {
                setLoading(true);
                SearchBarangVerif(searchQuery.trim())
                    .then((data) => {
                        const hasil = Array.isArray(data) ? data : [data];
                        setAmbilBarang(hasil);
                        setTotalPages(1);
                        setCurrentPage(1);
                        console.log("Hasil pencarian:", hasil);
                    })
                    .catch((error) => {
                        console.error("Error searching req:", error);
                        setAmbilBarang([]);
                    })
                    .finally(() => setLoading(false));
            } else {
                fetchAmbilBarang(currentPage);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, currentPage]);

    return (
        <div className="histori-penitipan-wrapper">
            <div className="sold-products-container">
                <h2><b>Verifikasi Pengambilan barang penitip</b></h2>
                <div className="sold-products-content-container">
                    <div className="search-bar">
                        <img src={SearchIcon} alt="Search Icon" className="search-icon-inside" />
                        <input
                            type="text"
                            placeholder="Masukkan Nama Barang..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : ambilBarang.length === 0 ? (
                        <p style={{ textAlign: "center" }}>Tidak ada produk yang sedang didonasikan.</p>
                    ) : (
                        <table className="sold-products-table">
                            <thead>
                                <tr>
                                    <th>Informasi Produk</th>
                                    <th>Nama Penitip</th>
                                    <th>Status</th>
                                    <th>Verifikasi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ambilBarang.map((product, index) => {
                                    return (
                                        <tr key={index} style={{ fontSize: '15px', cursor: "pointer" }}
                                            onClick={() => handleOpenModal(product.id_barang)}>
                                            <td className={"product-info"} style={{ width: '200%' }}>
                                                <img src={getThumbnailBarang(product.foto_barang) || defaultImage} alt={product.nama_barang} style={{ maxWidth: '5vw' }} />
                                                <b>{product.nama_barang}</b>
                                            </td>
                                            <td>
                                                <b>{product.nama_penitip}</b>
                                            </td>
                                            <td>
                                                <Badge style={{ padding: '12px' }} bg="secondary">{product.status_penitipan}</Badge>
                                            </td>
                                            <td>
                                                <Button variant="success" onClick={(e) => { e.stopPropagation(), handleVerifikasi(product.id_detail_transaksi_penitipan) }}>Verifikasi</Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
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
            {selectedProductId && (
                <ModalDetailPenjualan
                    show={showModal}
                    handleClose={handleCloseModal}
                    id_barang={selectedProductId}
                />
            )}
        </div>
    );
};

export default VerifikasiSelesaiPage;
