import './PurchasePembeliPage.css';
import { useState, useEffect } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Container, Badge, Button, Modal, InputGroup, Form } from 'react-bootstrap';
import defaultImage from "../../assets/images/Pembeli/Yuki.jpeg";

import { ShowVerificationPurchase } from "../../api/apiPembeli";
import { getThumbnailBarang } from "../../api/index";

const PurchaseVerificationPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalShow, setModalShow] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await ShowVerificationPurchase(currentPage);
                setData(response.data.data);
                setTotalPages(response.data.last_page);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentPage]);

    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setModalShow(true);
    };

    const handleSearch = () => {
        setSearchQuery(searchValue);
    };

    const statusLabels = {
        "belum diverifikasi": "Menunggu Verifikasi",
        "transaksi ditolak": "Verifikasi Ditolak",
    };

    const statusBadgeColors = {
        "belum diverifikasi": "warning",
        "transaksi ditolak": "danger",
    };

    const filteredPurchase = data
        .filter(item => {
            if (statusFilter === 'all') return true;

            let itemStatusLabel = "";
            if (item.verifikasi_bukti === "belum diverifikasi") {
                itemStatusLabel = "menunggu verifikasi";
            } else if (item.verifikasi_bukti === "transaksi ditolak") {
                itemStatusLabel = "verifikasi ditolak";
            } else {
                return false;
            }
            return itemStatusLabel === statusFilter.toLowerCase();
        })
        .filter(item => {
            if (searchQuery.trim() === '') return true;
            return item.nama_barang?.toLowerCase().includes(searchQuery.toLowerCase());
        });

    return (
        <Container className="purchase-wrapper">
            <div className="purchase-container">
                <h2><b>Verifikasi Pembayaran</b></h2>
                <div className="purchase-content-container">
                    <div className="searchComponent1">
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

                    <div className="mb-3">
                        <Button variant={statusFilter === "all" ? "warning" : "outline-warning"} className="me-2" onClick={() => setStatusFilter('all')}>Semua</Button>
                        <Button variant={statusFilter === "menunggu verifikasi" ? "warning" : "outline-warning"} className="me-2" onClick={() => setStatusFilter('menunggu verifikasi')}>Menunggu Verifikasi</Button>
                        <Button variant={statusFilter === "verifikasi ditolak" ? "warning" : "outline-warning"} onClick={() => setStatusFilter('verifikasi ditolak')}>Verifikasi Ditolak</Button>
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
                                    <th>Status Verifikasi</th>
                                    <th>Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPurchase
                                    .sort((a, b) => new Date(b.tanggal_pembelian) - new Date(a.tanggal_pembelian))
                                    .map((history, index) => {
                                        const statusKey = history.verifikasi_bukti || "0";
                                        const statusLabel = statusLabels[statusKey] || "Menunggu Verifikasi";
                                        const badgeColor = statusBadgeColors[statusKey] || "warning";

                                        return (
                                            <tr key={index} style={{ cursor: 'pointer' }}>
                                                <td className="product-info">
                                                    <img
                                                        src={getThumbnailBarang(history.foto_barang) || defaultImage}
                                                        alt={history.nama_barang}
                                                    />
                                                    <b>{history.nama_barang}</b>
                                                </td>
                                                <td>Rp{history.harga_barang?.toLocaleString('id-ID') || '-'}</td>
                                                <td>{history.tanggal_pembelian?.substring(0, 10)}</td>
                                                <td>
                                                    <Badge
                                                        bg={badgeColor}
                                                        style={{
                                                            width: '100%',
                                                            height: '4vh',
                                                            textAlign: 'center',
                                                            fontSize: '1vw',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {statusLabel}
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
            />
        </Container>
    );
}

export default PurchaseVerificationPage;

function MyVerticallyCenteredModal({ show, onHide, product }) {
    if (!product) return null;

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
                        <p><strong>Status Pengiriman:</strong> {product.status_pengiriman || '-'}</p>
                        <p><strong>Deskripsi Barang :</strong> {product.deskripsi_barang}</p>
                        <p><strong>Kondisi Barang :</strong> {product.kondisi_barang}</p>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onHide}>Tutup</Button>
            </Modal.Footer>
        </Modal>
    );
}
