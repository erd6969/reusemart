import './PurchasePembeliPage.css';
import { useState, useEffect } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { Container, Button, Modal, InputGroup, Form } from 'react-bootstrap';
import defaultImage from "../../assets/images/Pembeli/Yuki.jpeg";
import clockIcon from "../../assets/images/clock-icon.png";
import cimbLogo from "../../assets/images/cimb-logo.png";

import { FaRegCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { ShowUnpaidPurchase } from "../../api/apiPembeli";
import { getThumbnailBarang } from "../../api/index";
import { CancelTransaksi, FinalizeTransaksi } from '../../api/apiTransaksiPembelian';
import { AddPoint } from '../../api/apiPembeli';

const UnpaidPurchasePage = () => {
    const [unpaidPurchase, setUnpaidPurchase] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalShow, setModalShow] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchValue, setSearchValue] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchUnpaidPurchase = async () => {
            try {
                const response = await ShowUnpaidPurchase(currentPage);
                setUnpaidPurchase(response.data.data);
                setTotalPages(response.data.last_page);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching unpaid purchase:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUnpaidPurchase();
    }, [currentPage]);

    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setModalShow(true);
    };

    const handleSearch = () => {
        setSearchQuery(searchValue);
    };

    const filteredPurchase = unpaidPurchase.filter((item) =>
        item.nama_barang?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container className="purchase-wrapper">
            <div className="purchase-container">
                <h2><b>Menunggu Pembayaran</b></h2>
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

                    {loading ? (
                        <p>Loading...</p>
                    ) : filteredPurchase.length === 0 ? (
                        <p style={{ textAlign: "center" }}>Tidak Ada Transaksi Yang Belum Dibayar.</p>
                    ) : (
                        <table className="purchase-table">
                            <thead>
                                <tr>
                                    <th>Info Produk</th>
                                    <th>Harga Barang</th>
                                    <th>Tanggal Pembelian</th>
                                    <th>Batas Pembayaran</th>
                                    <th>Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPurchase
                                    .sort((a, b) => new Date(b.tanggal_pembelian) - new Date(a.tanggal_pembelian))
                                    .map((history, index) => (
                                        <tr key={index} style={{ cursor: 'pointer' }}>
                                            <td className="product-info">
                                                <img src={getThumbnailBarang(history.foto_barang) || defaultImage} alt={history.nama_barang} />
                                                <b>{history.nama_barang}</b>
                                            </td>
                                            <td>Rp{history.harga_barang?.toLocaleString('id-ID') || '-'}</td>
                                            <td>{history.tanggal_pembelian?.substring(0, 10)}</td>
                                            <td>{history.batas_pembayaran?.substring(0, 10)}</td>
                                            <td>
                                                <Button variant="primary" onClick={() => handleOpenModal(history)}>
                                                    Detail
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
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
                transaksiPembelian={selectedProduct}
            />

        </Container>
    );
}

export default UnpaidPurchasePage;

function MyVerticallyCenteredModal({ show, onHide, transaksiPembelian }) {
    const [previewImage, setPreviewImage] = useState(null);
    const [buktiBayarFile, setBuktiBayarFile] = useState(null);
    const [countdown, setCountdown] = useState('00:00:00');
    const navigate = useNavigate();

    useEffect(() => {
        if (!transaksiPembelian?.batas_pembayaran) return;

        const targetTime = new Date(transaksiPembelian.batas_pembayaran).getTime();

        const interval = setInterval(async () => {
            const now = Date.now();
            const distance = targetTime - now;

            if (distance <= 0) {
                setCountdown('00:00:00');
                clearInterval(interval);
                toast.error("Waktu pembayaran telah habis. Transaksi akan dibatalkan.");

                try {
                    await CancelTransaksi({
                        id_transaksi_pembelian: transaksiPembelian.id_transaksi_pembelian
                    });
                    await AddPoint(transaksiPembelian.penggunaan_poin);

                    toast.warning("Transaksi Telah Dibatalkan Karena Waktu Pembayaran Habis.");
                } catch (error) {
                    toast.error("Gagal membatalkan transaksi.");
                    console.error("Error cancelling transaksi:", error);
                }

                setTimeout(() => {
                    onHide();
                    navigate("/pembeli/list-transaksi");
                }, 2000);
            } else {
                const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((distance / (1000 * 60)) % 60);
                const seconds = Math.floor((distance / 1000) % 60);
                const formatTime = (t) => t.toString().padStart(2, '0');
                setCountdown(`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [transaksiPembelian, navigate]);

    const handleKonfirmasiPembayaran = async () => {
        if (!buktiBayarFile) {
            toast.error("Silakan upload bukti pembayaran terlebih dahulu.");
            return;
        }

        const formData = new FormData();
        formData.append("id_transaksi_pembelian", transaksiPembelian.id_transaksi_pembelian);
        formData.append("bukti_pembayaran", buktiBayarFile);

        try {
            await FinalizeTransaksi(formData);
            toast.success("Pembayaran berhasil dikonfirmasi!");
            onHide();
            navigate("/pembeli/list-transaksi");
        } catch (error) {
            toast.error("Gagal konfirmasi pembayaran.");
            console.error(error);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setBuktiBayarFile(file);
        }
    };

    const formatNomorTransaksi = () => {
        if (!transaksiPembelian?.tanggal_pembelian || !transaksiPembelian?.id_transaksi_pembelian) return '';
        const tanggal = new Date(transaksiPembelian.tanggal_pembelian);
        const year = tanggal.getFullYear().toString().slice(-2);
        const month = String(tanggal.getMonth() + 1).padStart(2, '0');
        const id = String(transaksiPembelian.id_transaksi_pembelian).padStart(3, '0');
        return `${year}.${month}.${id}`;
    };

    if (!transaksiPembelian) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Pembayaran</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <div className="payment-box">
                        <div className="header-payment" style={{marginTop:"-10px"}}>
                            <div className="header-left-payment">
                                <img src={clockIcon} alt="clock" className="clock-icon" />
                                <div className="header-text">
                                    <div className="pay-title">Bayar Sebelum</div>
                                    <div className="pay-date">{transaksiPembelian.batas_pembayaran}</div>
                                </div>
                            </div>
                            <div className="timer-box">{countdown}</div>
                        </div>

                        <hr />

                        <div className="title-payment">Pembayaran</div>
                        <div className="content-payment">
                            <div className="left">
                                <div style={{ flexDirection: "row"}}>
                                    <img src={cimbLogo} alt="CIMB" style={{width:"250px", height: "150px", objectFit:"contain"}}/>
                                    <div style={{ display: "flex", flexDirection: "column", marginLeft: "5px" }}>
                                        <div style={{fontSize:"24px", fontWeight:"bold", marginBottom:"10px"}}>Bank CIMB Niaga</div>
                                        <div style={{fontSize:"16px", color:"grey"}}>Nama Penerima</div>
                                        <div style={{fontSize:"24px", fontWeight:"bold", marginBottom:"10px"}}>ReuseMart Corp</div>
                                        <div style={{fontSize:"16px", color:"grey"}}>Nomor Rekening</div>
                                        <div className="account-box">
                                            <span className="account-number">707039994100</span>
                                            <span className="copy-icon"><FaRegCopy /></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="right">
                                <div className="label-bukti-pembayaran">Bukti Pembayaran</div>
                                <div className="proof-box">
                                    {previewImage && (
                                        <img src={previewImage} alt="Proof Preview" className="preview-image" />
                                    )}
                                </div>
                                <label className="upload-btn">
                                    Upload
                                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                </label>
                            </div>
                        </div>

                        <hr />

                        <div className="footer-info">
                            <div className="footer-transaction-number">
                                <div className="label-transaction-number">Transaction Number</div>
                                <div className="transaction-number-payment">{formatNomorTransaksi()}</div>
                            </div>
                            <div className="footer-total">
                                <div className="label-total-bill">Total Bill</div>
                                <div className="total-bill-payment">
                                    Rp{transaksiPembelian.total_pembayaran?.toLocaleString('id-ID') || '0'}
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <button className="confirm-btn" onClick={handleKonfirmasiPembayaran}>
                    Konfirmasi Pembayaran
                </button>
            </Modal.Footer>
        </Modal>
    );
}