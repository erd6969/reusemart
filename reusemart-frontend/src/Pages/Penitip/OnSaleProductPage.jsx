import './OnSaleProductPage.css';
import { Container, Spinner, Button } from 'react-bootstrap';
import SearchIcon from "../../assets/images/search-icon.png";
import { use, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { toast } from 'react-toastify';
import { ShowOnSaleProducts, SearchBarangJual } from '../../api/apiPenitip';
import { getThumbnailBarang } from "../../api/index";

import ModalDetailPenjualan from "../../Components/Modal/ModalPenitip/ModalDetailBarang";



const OnSaleProductPage = () => {
    const [onSaleProducts, setOnSaleProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);



    const fetchOnSaleProducts = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await ShowOnSaleProducts(page);
            setOnSaleProducts(response.data);
            setTotalPages(response.last_page);
            setCurrentPage(response.current_page);
        } catch (error) {
            console.error("Error fetching on sale products:", error);
            toast.error("Failed to fetch on sale products");
            setOnSaleProducts([]);
        } finally {
            setIsLoading(false);
            setIsFirstLoad(false);
        }
    }

    useEffect(() => {
        fetchOnSaleProducts(currentPage);
    }, [currentPage]);

    const handlePagination = (page) => {
        if (page >= 1 && page <= totalPages) {
            setIsLoading(true);
            setCurrentPage(page);
            fetchOnSaleProducts(page);
        }
    };

    const handleOpenModal = (id_barang) => {
        setSelectedProductId(id_barang);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProductId(null);
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim().length >= 3) {
                setIsLoading(true);
                SearchBarangJual(searchQuery.trim())
                    .then((data) => {
                        setOnSaleProducts(data.data || []); 
                        setTotalPages(data.last_page || 1);
                        setCurrentPage(data.current_page || 1);
                    })
                    .catch((error) => {
                        console.error("Error searching req:", error);
                        setOnSaleProducts([]);
                    })
                    .finally(() => setIsLoading(false));
            } else {
                fetchOnSaleProducts(currentPage);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, currentPage]);
    return (
        <div className="onsale-penitipan-wrapper">
            <div className="onsale-products-container">
                <h2><b>Produk Sedang Dijual</b></h2>
                <div className="onsale-products-content-container">
                    <div className="search-bar-onsale">
                        <img src={SearchIcon} alt="Search Icon" className="search-icon-inside" />
                        <input
                            type="text"
                            placeholder="Masukkan Nama Barang..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <table className="onsale-products-table">
                        <thead>
                            <tr>
                                <td><b>Gambar Produk</b></td>
                                <td><b>Nama Barang</b></td>
                                <td><b>Harga Jual</b></td>
                                <td><b>Tanggal Exp</b></td>

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
                            ) : onSaleProducts.length > 0 ? (
                                onSaleProducts.map((product, index) => (
                                    <tr key={index} style={{ fontSize: '15px', cursor: "pointer" }}
                                        onClick={() => handleOpenModal(product.id_barang)}
                                    >
                                        <td style={{ width: '5%' }}>
                                            <img src={getThumbnailBarang(product.foto_barang) || defaultImage} alt={product.nama_barang} style={{ maxWidth: '6vw' }} />
                                           
                                        </td>
                                        <td style={{ width: '42%' }}>
                                             <b>{product.nama_barang}</b>  
                                        </td>
                                        <td>Rp {product.harga_barang?.toLocaleString('id-ID') || '-'} </td>
                                        <td>{product.tanggal_berakhir}</td>
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

export default OnSaleProductPage;
