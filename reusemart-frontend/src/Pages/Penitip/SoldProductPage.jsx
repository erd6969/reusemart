import './SoldProductPage.css';
import { useState, useEffect } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight, } from 'react-icons/fa';
import { Container, Button } from 'react-bootstrap';
import SearchIcon from "../../assets/images/search-icon.png";
import defaultImage from "../../assets/images/Pembeli/Yuki.jpeg";

import { ShowSoldProducts, SearchBarangTerjual } from "../../api/apiPenitip";
import { getThumbnailBarang } from "../../api/index";

import ModalDetailPenjualan from "../../Components/Modal/ModalPenitip/ModalDetailPenjualan";

const SoldProductPage = () => {
    const [soldProducts, setSoldProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchSoldProducts = async (page = 1) => {
        try {
            const response = await ShowSoldProducts(page);
            setSoldProducts(response.data);
            setTotalPages(response.last_page);
            setCurrentPage(response.current_page);
            console.log("Fetched sold products:", response.data);
        } catch (error) {
            setSoldProducts([]);
            console.error("Error fetching sold products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSoldProducts(currentPage);
    }, [currentPage]);

    const handleOpenModal = (id_barang) => {
        setSelectedProductId(id_barang);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProductId(null);
    };

    const handlePagination = (page) => {
        if (page >= 1 && page <= totalPages) {
            setLoading(true);
            setCurrentPage(page);
            fetchSoldProducts(page);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim().length >= 3) {
                setLoading(true);
                SearchBarangTerjual(searchQuery.trim())
                    .then((data) => {
                        setSoldProducts(data.data || []);
                        setTotalPages(data.last_page || 1);
                        setCurrentPage(data.current_page || 1);
                    })
                    .catch((error) => {
                        console.error("Error searching req:", error);
                        setSoldProducts([]);
                    })
                    .finally(() => setLoading(false));
            } else {
                fetchSoldProducts(currentPage);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, currentPage]);


    return (
        <Container className="histori-penitipan-wrapper">
            <div className="sold-products-container">
                <h2><b>Produk Terjual</b></h2>
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
                    ) : soldProducts.length === 0 ? (
                        <p style={{ textAlign: "center" }}>Tidak ada produk yang terjual.</p>
                    ) : (
                        <table className="sold-products-table">
                            <thead>
                                <tr>
                                    <th>Info Product</th>
                                    <th>Price</th>
                                    <th>Sold Date</th>
                                    <th>Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {soldProducts.map((product, index) => (
                                    <tr
                                        key={index}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleOpenModal(product.id_barang)}
                                    >
                                        <td className="product-info">
                                            <img
                                                src={getThumbnailBarang(product.foto_barang) || defaultImage}
                                                alt={product.nama_barang}
                                            />
                                            <b>{product.nama_barang}</b>
                                        </td>
                                        <td>
                                            Rp{product.harga_barang?.toLocaleString("id-ID") || "-"}
                                        </td>
                                        <td>{product.tanggal_pembelian?.substring(0, 10)}</td>
                                        <td>
                                            {product.rating === null || product.rating === undefined ? (
                                                <span className="badge badge-warning" style={{
                                                    backgroundColor: "#facc15",
                                                    color: "#fff",
                                                    padding: "1 4px",
                                                    borderRadius: "8px",
                                                    fontSize: "1em"
                                                }}>
                                                    Proses Pembayaran
                                                </span>
                                            ) : (
                                                [1, 2, 3, 4, 5].map((i) => (
                                                    <FaStar
                                                        key={i}
                                                        color={i <= product.rating ? "#facc15" : "#e5e7eb"}
                                                    />
                                                ))
                                            )}
                                        </td>
                                    </tr>
                                ))}
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

            {/* Modal detail */}
            {selectedProductId && (
                <ModalDetailPenjualan
                    show={showModal}
                    handleClose={handleCloseModal}
                    id_barang={selectedProductId}
                />
            )}
        </Container>
    );
};

export default SoldProductPage;
