import './SoldProductPage.css';
import { useState, useEffect } from 'react';
import SearchIcon from "../../assets/images/search-icon.png";
import { Button, Badge } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { ShowDonatedProduct, SearchBarangDonasi } from "../../api/apiPenitip";
import { getThumbnailBarang } from "../../api/index";


import ModalDetailDonasi from "../../Components/Modal/ModalPenitip/ModalDetailDonasi";


const DonatedProductPage = () => {
    const [donatedProduct, setDonatedProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [selectedProductId, setSelectedProductId] = useState(null);



    const fetchDonatedProduct = async (page = 1) => {
        try {
            const response = await ShowDonatedProduct(page);
            setDonatedProduct(response.data);
            setTotalPages(response.last_page);
            setCurrentPage(response.current_page);
            console.log("Fetched doanted products:", response.data);

        } catch (error) {
            console.error("Error fetching donted products:", error);
            setDonatedProduct([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchDonatedProduct(currentPage);
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
            fetchDonatedProduct(page);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim().length >= 3) {
                setLoading(true);
                SearchBarangDonasi(searchQuery.trim())
                    .then((data) => {
                        setDonatedProduct(data.data || []); 
                        setTotalPages(data.last_page || 1);
                        setCurrentPage(data.current_page || 1);
                    })
                    .catch((error) => {
                        console.error("Error searching req:", error);
                        setDonatedProduct([]);
                    })
                    .finally(() => setLoading(false));
            } else {
                fetchDonatedProduct(currentPage);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, currentPage]);

    return (
        <div className="histori-penitipan-wrapper">
            <div className="sold-products-container">
                <h2><b>Produk Didonasikan</b></h2>
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
                    ) : donatedProduct.length === 0 ? (
                        <p style={{ textAlign: "center" }}>Tidak ada produk yang sedang didonasikan.</p>
                    ) : (
                        <table className="sold-products-table">
                            <thead>
                                <tr>
                                    <th>Informasi Produk</th>
                                    <th>Tanggal Donasi</th>
                                    <th>Organisasi</th>
                                    <th>Nama Penerima</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donatedProduct.map((product, index) => {
                                    const isOpenDonasi = product.status_penitipan === "open donasi";
                                    return (
                                        <tr key={index} style={{ cursor: "pointer" }}
                                            onClick={() => handleOpenModal(product.id_barang)}>
                                            <td className={"product-info"} style={{ width: '200%' }}>
                                                <img src={getThumbnailBarang(product.foto_barang) || defaultImage} alt={product.nama_barang} style={{ maxWidth: '5vw' }} />
                                                <b>{product.nama_barang}</b>
                                            </td>
                                            <td>{isOpenDonasi ? "-" : product.tanggal_donasi?.substring(0, 10)}</td>
                                            <td>{isOpenDonasi ? "-" : product.nama_organisasi}</td>
                                            <td>{isOpenDonasi ? "-" : product.nama_penerima}</td>
                                            <td>

                                                {product.status_penitipan?.toLowerCase() === "open donasi" ? (
                                                    <Badge style={{ fontSize: '15px', width: '10vw', padding: '17px', alignItems: 'center' }} bg="success">Open Donasi</Badge>
                                                ) : product.status_penitipan?.toLowerCase() === "didonasikan" ? (
                                                    <Badge style={{ fontSize: '15px', width: '10vw', padding: '17px', alignItems: 'center' }} bg="secondary">Didonasikan</Badge>
                                                ) : (
                                                    <Badge style={{ fontSize: '15px', width: '10vw', padding: '17px', alignItems: 'center' }} bg="warning">Status ga ada</Badge>
                                                )}

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
                <ModalDetailDonasi
                    show={showModal}
                    handleClose={handleCloseModal}
                    id_barang={selectedProductId}
                />
            )}
        </div>
    );
};

export default DonatedProductPage;
