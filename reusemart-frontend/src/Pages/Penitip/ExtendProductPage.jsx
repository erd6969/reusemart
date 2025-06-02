import './SoldProductPage.css';
import { FaStar } from 'react-icons/fa';
import { Badge, Container, Spinner, Button } from 'react-bootstrap';
import SearchIcon from "../../assets/images/search-icon.png";
import { use, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { toast } from 'react-toastify';
import { ShowExtendProducts, extendBarang, ambilBarang, SearchBarangExtend } from '../../api/apiPenitip';
import { getThumbnailBarang } from "../../api/index";

import ModalDetailBarang from "../../Components/Modal/ModalPenitip/ModalDetailBarang";


const ExtendProductPage = () => {
    const [extendProducts, setExtendProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);


    const fetchExtendProducts = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await ShowExtendProducts(page);
            setExtendProducts(response.data);
            setTotalPages(response.last_page);
            setCurrentPage(response.current_page);
            console.log("Fetched sold products:", response.data);
        } catch (error) {
            console.error("Error fetching extend products:", error);
            toast.error("Failed to fetch extend products");
            setExtendProducts([]);
        } finally {
            setIsLoading(false);
            setIsFirstLoad(false);
        }
    }
    useEffect(() => {
        fetchExtendProducts(currentPage);
    }, [currentPage]);

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
                SearchBarangExtend(searchQuery.trim())
                    .then((data) => {
                        setExtendProducts(data.data || []); 
                        setTotalPages(data.last_page || 1);
                        setCurrentPage(data.current_page || 1);
                    })
                    .catch((error) => {
                        console.error("Error searching req:", error);
                        setExtendProducts([]);
                    })
                    .finally(() => setIsLoading(false));
            } else {
                fetchExtendProducts(currentPage);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, currentPage]);

    const handleExtend = async (id_detail_transaksi_penitipan) => {
        setIsLoading(true);
        try {
            const response = await extendBarang(id_detail_transaksi_penitipan);
            console.log("Extend response:", response);
            toast.success("Berhasil memperpanjang masa penitipan");
            fetchExtendProducts();
        } catch (error) {
            console.error("Error extending product:", error);
            toast.error("Gagal memperpanjang masa penitipan");
        } finally {
            setIsLoading(false);
        }
    }

    const handleAmbil = async (id_barang) => {
        setIsLoading(true);
        try {
            const response = await ambilBarang(id_barang);
            console.log("Extend response:", response);
            toast.success("Berhasil memperpanjang masa penitipan");
            fetchExtendProducts();
        } catch (error) {
            console.error("Error extending product:", error);
            toast.error("Gagal memperpanjang masa penitipan");
        } finally {
            setIsLoading(false);
        }
    }

    const handlePagination = (page) => {
        if (page >= 1 && page <= totalPages) {
            setIsLoading(true);
            setCurrentPage(page);
            fetchExtendProducts(page);
        }
    };


    return (
        <div className="histori-penitipan-wrapper">
            <div className="sold-products-container">
                <h2><b>Perpanjangan Barang</b></h2>
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

                    <table className="sold-products-table">
                        <thead>
                            <tr>
                                <th>Info Product</th>
                                <th>Harga</th>
                                <th>Tanggal Berakhir</th>
                                <th>Tanggal Batas Ambil</th>
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
                            ) : extendProducts.length > 0 ? (
                                extendProducts.map((product, index) => (
                                    <tr key={index} onClick={() => handleOpenModal(product.id_barang)} style={{ fontSize: '15px', cursor: "pointer" }}>
                                        <td className='product-info'>
                                            <img src={getThumbnailBarang(product.foto_barang) || defaultImage} alt={product.nama_barang} style={{ maxWidth: '8vw' }} />
                                            <b>{product.nama_barang}</b>
                                        </td>
                                        <td style={{ width: '15%' }}>Rp {product.harga_barang?.toLocaleString('id-ID') || '-'} </td>
                                        <td>{product.tanggal_berakhir}</td>
                                        <td>{product.tanggal_batas_pengambilan}</td>
                                        <td>
                                            {product.status_penitipan === "ready jual" ? (
                                                <div className='action-buttons'>
                                                    {product.status_perpanjangan === 0 ? (
                                                        <>
                                                            <button
                                                                className="btn btn-success"
                                                                onClick={e => {
                                                                    e.stopPropagation();
                                                                    handleExtend(product.id_detail_transaksi_penitipan);
                                                                }}
                                                            >
                                                                Extend
                                                            </button>

                                                            <button
                                                                style={{ color: 'white' }}
                                                                className="btn btn-danger"
                                                                onClick={e => {
                                                                    e.stopPropagation();
                                                                    handleAmbil(product.id_barang);
                                                                }}
                                                            >
                                                                Ambil
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            style={{ color: 'white', width: '100%' }}
                                                            className="btn btn-danger"
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                handleAmbil(product.id_barang);
                                                            }}
                                                        >
                                                            Ambil
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <Badge style={{ padding: '12px', fontSize: '15px' }} bg='warning'>Masa Pengambilan</Badge>
                                            )}
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
                <ModalDetailBarang
                    show={showModal}
                    handleClose={handleCloseModal}
                    id_barang={selectedProductId}
                />
            )}
        </div>
    );
};

export default ExtendProductPage;
