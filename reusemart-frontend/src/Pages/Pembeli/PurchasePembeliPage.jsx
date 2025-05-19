import './PurchasePembeliPage.css';
import { useState, useEffect } from 'react';
import { FaStar, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Container, Badge, Button, Modal, InputGroup, Form } from 'react-bootstrap';
import SearchIcon from "../../assets/images/search-icon.png";
import defaultImage from "../../assets/images/Pembeli/Yuki.jpeg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ShowHistoryPurchase } from "../../api/apiPembeli";
import { getThumbnailBarang } from "../../api/index";
import StarRating from "../../Components/Pembeli/StarRating";
import { Star } from 'lucide-react';
import { TambahRating } from '../../api/apiBarang';
import { toast } from 'react-toastify';

const PurchasePembeliPage = () => {
    const [historyPurchase, setHistoryPurchase] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalShow, setModalShow] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchValue, setSearchValue] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    const fetchPurchaseHistory = async () => {
        try {
            const response = await ShowHistoryPurchase(currentPage);
            console.log(response.data.data);
            setHistoryPurchase(response.data.data);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error("Error fetching history purchase:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchPurchaseHistory();
    }, [currentPage]);

    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setModalShow(true);
    };

    const handleSearch = () => {
        setSearchQuery(searchValue);
    };
    

    const filteredPurchase = historyPurchase
        .filter(history => {
            const status = history.status_pengiriman?.toLowerCase() || '';
            const filter = statusFilter.toLowerCase();

            if (filter === 'sudah diterima') {
                return ['sudah diambil', 'sudah sampai'].includes(status);
            }
            if (filter !== 'all') {
                return status === filter;
            }
            return true;
        })
        .filter(history => {
            if (startDate && endDate) {
                const purchaseDate = new Date(history.tanggal_pembelian);
                return purchaseDate >= startDate && purchaseDate <= endDate;
            }
            return true;
        })
        .filter(history => {
            if (searchQuery.trim() !== '') {
                return history.nama_barang?.toLowerCase().includes(searchQuery.toLowerCase());
            }
            return true;
        });

    return (
        <Container className="purchase-wrapper">
            <div className="purchase-container">
                <h2><b>Produk Terjual</b></h2>
                <div className="purchase-content-container">
                    <div className="searchComponent1">
                        <div className="searchContainer1">
                            <InputGroup className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Masukkan Nama Barang..."
                                    className="searchInput"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                                <Button variant="secondary" onClick={handleSearch}>
                                    <FaSearch />
                                </Button>
                            </InputGroup>
                        </div>
                    </div>

                    <div className="mb-3">
                        <Button variant={statusFilter.toLowerCase() === "all" ? "warning" : "outline-warning"} className="me-2" onClick={() => setStatusFilter('all')}>Semua</Button>
                        <Button variant={statusFilter.toLowerCase() === "sedang disiapkan" ? "warning" : "outline-warning"} className="me-2" onClick={() => setStatusFilter('sedang disiapkan')}>Sedang Disiapkan</Button>
                        <Button variant={statusFilter.toLowerCase() === "sedang diantar" ? "warning" : "outline-warning"} className="me-2" onClick={() => setStatusFilter('sedang diantar')}>Sedang Diantar</Button>
                        <Button variant={statusFilter.toLowerCase() === "siap diambil" ? "warning" : "outline-warning"} className="me-2" onClick={() => setStatusFilter('siap diambil')}>Siap diambil</Button>
                        <Button variant={statusFilter.toLowerCase() === "sudah sampai" ? "warning" : "outline-warning"} className="me-2" onClick={() => setStatusFilter('sudah diterima')}>Sudah diterima</Button>
                    </div>

                    <div className="mb-3 d-flex gap-2 align-items-center">
                        <span>Pilih tanggal: </span>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            placeholderText="Dari Tanggal"
                            dateFormat="yyyy-MM-dd"
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            placeholderText="Sampai Tanggal"
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : filteredPurchase.length === 0 ? (
                        <p style={{ textAlign: "center" }}>Tidak ada history pembelian.</p>
                    ) : (
                        <table className="purchase-table">
                            <thead>
                                <tr>
                                    <th>Info Produk</th>
                                    <th>Harga Barang</th>
                                    <th>Tanggal Pembelian</th>
                                    <th>Status Pengiriman</th>
                                    <th>Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPurchase
                                    .sort((a, b) => new Date(b.tanggal_pembelian) - new Date(a.tanggal_pembelian))
                                    .map((history, index) => {
                                        const rawStatus = history.status_pengiriman || '';
                                        const status = ['sudah diambil', 'sudah sampai'].includes(rawStatus.toLowerCase())
                                            ? 'sudah diterima'
                                            : rawStatus;

                                        const badgeColor =
                                            status.toLowerCase() === 'sudah diterima' ? 'success'
                                                : status.toLowerCase() === 'sedang disiapkan' ? 'secondary'
                                                    : status.toLowerCase() === 'sedang diantar' ? 'warning'
                                                        : status.toLowerCase() === 'siap diambil' ? 'info'
                                                            : 'dark';

                                        return (
                                            <tr key={index} style={{ cursor: 'pointer' }}>
                                                <td className="product-info">
                                                    <img src={getThumbnailBarang(history.foto_barang) || defaultImage} alt={history.nama_barang} />
                                                    <b>{history.nama_barang}</b>
                                                </td>
                                                <td>Rp{history.harga_barang?.toLocaleString('id-ID') || '-'}</td>
                                                <td>{history.tanggal_pembelian?.substring(0, 10)}</td>
                                                <td>
                                                    <Badge
                                                        bg={badgeColor}
                                                        style={{
                                                            width: '10vw',
                                                            height: '4vh',
                                                            textAlign: 'center',
                                                            fontSize: '1vw',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {status}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Button variant="primary" onClick={() => handleOpenModal(history)}>
                                                        Detail
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    )}
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
            </div>

            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                product={selectedProduct}
                onRated= {fetchPurchaseHistory}
            />
        </Container>
    );
}

export default PurchasePembeliPage;

function MyVerticallyCenteredModal({ show, onHide, product, onRated }) {
    if (!product) return null;
    const [rating, setRating] = useState(0);
    const formDataToSend = new FormData();

    const handleRating = async () => {
        formDataToSend.append("id_barang", product.id_barang);
        formDataToSend.append("rating", rating);

        try {
            const response = await TambahRating(formDataToSend);
            toast.success("Rating berhasil diberikan");
            onHide();
            onRated();
        } catch (error) {
            console.error("Error giving rating:", error);
            toast.error("Gagal memberikan rating");
        }
    };

    // Fungsi untuk render bintang statis
    const renderStaticStars = (value) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FaStar key={i} color={i <= value ? "#ffc107" : "#e4e5e9"} size={24} />
            );
        }
        return <div className="d-flex gap-1">{stars}</div>;
    };

    const isAlreadyRated = product.rating && product.rating > 0;
    const isReceivedStatus = ["sudah diambil", "sudah sampai"].includes(product.status_pengiriman?.toLowerCase());

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Detail Produk</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
                    <img
                        src={getThumbnailBarang(product.foto_barang) || defaultImage}
                        alt={product.nama_barang}
                        style={{ maxWidth: "30%" }}
                    />
                    <div>
                        <h3 style={{ fontWeight: "bold" }}>{product.nama_barang}</h3>
                        <p><strong>Harga:</strong> Rp{product.harga_barang?.toLocaleString('id-ID') || '-'}</p>
                        <p><strong>Tanggal Pembelian:</strong> {product.tanggal_pembelian?.substring(0, 10)}</p>
                        <p><strong>Status Pengiriman:</strong> {product.status_pengiriman}</p>
                        <p><strong>Deskripsi Barang :</strong> {product.deskripsi_barang}</p>
                        <p><strong>Kondisi Barang :</strong> {product.kondisi_barang}</p>

                        {isReceivedStatus && (
                            <>
                                <p><strong>Rating:</strong></p>
                                {isAlreadyRated ? (
                                    renderStaticStars(product.rating)
                                ) : (
                                    <StarRating onRate={(value) => setRating(value)} />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                {isReceivedStatus && !isAlreadyRated && (
                    <Button variant="primary" onClick={handleRating}>
                        Berikan rating
                    </Button>
                )}
                <Button variant="danger" onClick={onHide}>Tutup</Button>
            </Modal.Footer>
        </Modal>
    );
}
