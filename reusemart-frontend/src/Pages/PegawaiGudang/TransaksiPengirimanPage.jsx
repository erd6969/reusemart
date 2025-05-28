// import './SoldProductPage.css';
import { useState, useEffect } from 'react';
import SearchIcon from "../../assets/images/search-icon.png";
import { Button, Badge } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaSearch, FaFile } from "react-icons/fa";
import { toast } from 'react-toastify';

import { ShowPengirimanBarang, SearchBarangPengiriman, VerifyPengambilanPembeli } from "../../api/apiBarang";
import { PreviewPdfTransaksiPembelian } from "../../api/apiTransaksiPembelian";
import { getThumbnailBarang } from "../../api/index";
import ModalDetailPenjualan from "../../Components/Modal/ModalPenitip/ModalDetailBarang";
import ModalUpdateTanggalPengiriman from '../../Components/Modal/ModalPegawaiGudang/ModalUpdateTanggalPengiriman';
import ModalPengirimanKurir from '../../Components/Modal/ModalPegawaiGudang/ModalPengirimanKurir';


const TransaksiPengirimanPage = () => {
    const [pengirimanBarang, setPengirimanBarang] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedTransaksi, setSelectedTransaksi] = useState(null);
    const [selectedPengiriman, setSelectedPengiriman] = useState(null);


    const fetchPengirimanBarang = async (page = 1) => {
        try {
            const response = await ShowPengirimanBarang(page);
            setPengirimanBarang(response.data);
            setTotalPages(response.last_page);
            setCurrentPage(response.current_page);
            console.log("Fetched barang pengiriman products:", response);

        } catch (error) {
            console.error("Error fetching barang pengiriman products:", error);
            setPengirimanBarang([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPengirimanBarang(currentPage);
    }, [currentPage]);

    const handleVerifPengambilan = async (id_transaksi_pembelian) => {
        console.log("ID transaksi pembelian:", id_transaksi_pembelian);
        setLoading(true);
        try {
            const response = await VerifyPengambilanPembeli(id_transaksi_pembelian);
            console.log("Extend response:", response);
            toast.success("Berhasil verif");
            fetchPengirimanBarang();
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
            fetchPengirimanBarang(page);
        }
    };

    const handleOpenModal = (id_barang) => {
        setSelectedProductId(id_barang);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProductId(null);
        setSelectedTransaksi(null);
        setSelectedPengiriman(null);
    };

    const handleJadwalkan = async (produk) => {
        setSelectedTransaksi(produk);
        setShowModal(true);
    };

    const handlePengiriman = async (produk) => {
        setSelectedPengiriman(produk);
        setShowModal(true);
    };

    const handleNota = (id_transaksi_pembelian) => {
        PreviewPdfTransaksiPembelian(id_transaksi_pembelian);
    };


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim().length >= 3) {
                setLoading(true);
                SearchBarangPengiriman(searchQuery.trim())
                    .then((data) => {
                        setPengirimanBarang(data.data || []);
                        setTotalPages(data.last_page || 1);
                        setCurrentPage(data.current_page || 1);
                    })
                    .catch((error) => {
                        console.error("Error searching req:", error);
                        setPengirimanBarang([]);
                    })
                    .finally(() => setLoading(false));
            } else {
                fetchPengirimanBarang(currentPage);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, currentPage]);

    return (
        <div className="histori-penitipan-wrapper">
            <div className="sold-products-container">
                <h2><b>Transaksi Pengiriman</b></h2>
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
                    ) : pengirimanBarang.length === 0 ? (
                        <p style={{ textAlign: "center" }}>Tidak ada produk yang sedang didonasikan.</p>
                    ) : (
                        <table className="sold-products-table">
                            <thead>
                                <tr>
                                    <th>Transaksi Pembelian ID</th>
                                    <th>Nama Barang</th>
                                    <th>Pengiriman</th>
                                    <th>Status Pengiriman</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pengirimanBarang.map((product, index) => {
                                    return (
                                        <tr key={index} style={{ fontSize: '15px', cursor: "pointer" }}
                                            onClick={() => handleOpenModal(product.id_barang)}>
                                            <td style={{ width: '10%' }}>
                                                <b>TP.{product.id_transaksi_pembelian}</b>
                                            </td>
                                            <td style={{ width: '35%' }}>
                                                {product.nama_barang}
                                            </td>
                                            <td style={{ width: '20%' }}>
                                                <h5>
                                                    <Badge bg='warning' style={{ width: '100%', padding: '10px' }}>
                                                        {product.pengiriman}
                                                    </Badge>
                                                </h5>
                                            </td>
                                            <td style={{ width: '20%' }}>
                                                <h5>
                                                    <Badge bg='secondary' style={{ width: '100%', padding: '10px' }}>
                                                        {product.status_pengiriman}
                                                    </Badge>
                                                </h5>
                                            </td>
                                            <td className='actionButtons'>
                                                {product.status_pengiriman === "siap diambil" ? (
                                                    <Button
                                                        variant='success'
                                                        style={{ width: '100%' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleVerifPengambilan(product.id_transaksi_pembelian);
                                                        }}
                                                    >
                                                        Confirm
                                                    </Button>
                                                ) : (product.status_pengiriman === "sudah diambil" || product.status_pengiriman === "sedang diantar") ? (
                                                    <Button
                                                        style={{ width: '100%' }}
                                                        variant='dark'
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleNota(product.id_transaksi_pembelian);
                                                        }}
                                                    >
                                                        <FaFile />
                                                    </Button>
                                                ) : product.pengiriman === "diantar kurir" ? (
                                                    product.status_pengiriman === "sedang disiapkan" ? (
                                                        product.tanggal_pengiriman === null ? (
                                                                <Button
                                                                    variant='success'
                                                                    style={{ width: '100%' }}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handlePengiriman(product);
                                                                    }}
                                                                >
                                                                    Kirim
                                                                </Button>
                                                        ) : (
                                                            <Badge bg='danger' style={{ width: '95%', padding: '10px' }}>
                                                               Menunggu
                                                            </Badge>
                                                        )
                                                    ) : (
                                                        !product.tanggal_pengiriman && (
                                                            <Button
                                                                variant='success'
                                                                style={{ width: '100%' }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handlePengiriman(product);
                                                                }}
                                                            >
                                                                Kirim
                                                            </Button>
                                                        )
                                                    )
                                                ) : product.pengiriman === "diambil sendiri" ? (
                                                    product.status_pengiriman === "sedang disiapkan" ? (
                                                        <Button
                                                            variant='warning'
                                                            style={{ width: '100%' }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleJadwalkan(product);
                                                            }}
                                                        >
                                                            Jadwalkan
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant='success'
                                                            style={{ width: '100%' }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleVerifPengambilan(product.id_transaksi_pembelian);
                                                            }}
                                                        >
                                                            Confirm
                                                        </Button>
                                                    )
                                                ) : (
                                                    <Button>gatau</Button>
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
                <ModalDetailPenjualan
                    show={showModal}
                    handleClose={handleCloseModal}
                    id_barang={selectedProductId}

                />
            )}

            {selectedTransaksi && (
                <ModalUpdateTanggalPengiriman
                    show={showModal}
                    handleClose={handleCloseModal}
                    dataEdit={selectedTransaksi}
                    onSuccess={fetchPengirimanBarang}

                />
            )}

            {selectedPengiriman && (
                <ModalPengirimanKurir
                    show={showModal}
                    handleClose={handleCloseModal}
                    dataEdit={selectedPengiriman}
                    onSuccess={fetchPengirimanBarang}
                />
            )}
        </div>
    );
};

export default TransaksiPengirimanPage;
