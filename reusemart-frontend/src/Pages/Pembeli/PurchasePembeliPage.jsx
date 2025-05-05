import './PurchasePembeliPage.css';
import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { Container } from 'react-bootstrap';
import SearchIcon from "../../assets/images/search-icon.png";
import defaultImage from "../../assets/images/Pembeli/Yuki.jpeg";

import { ShowHistoryPurchase } from "../../api/apiPembeli";
import { getThumbnail } from "../../api/index";


const PurchasePembeliPage = () => {
    const [historyPurchase, setHistoryPurchase] = useState([]);
        const [loading, setLoading] = useState(true);
        // const [showModal, setShowModal] = useState(false);
        // const [selectedProductId, setSelectedProductId] = useState(null);
    
        useEffect(() => {
            const fetchPurchaseHistory = async () => {
                try {
                    const response = await ShowHistoryPurchase();
                    setHistoryPurchase(response.data);
                    console.log("Fetched history purchase:", response.data);
                } catch (error) {
                    console.error("Error fetching history purhase:", error);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchPurchaseHistory();
        }, []);
    return (
        <Container className="purchase-wrapper">
            <div className="purchase-container">
                <h2><b>Produk Terjual</b></h2>
                <div className="purchase-content-container">
                    <div className="search-bar">
                        <img src={SearchIcon} alt="Search Icon" className="search-icon-inside" />
                        <input
                            type="text"
                            placeholder="Masukkan Nama Produk..."
                            className="search-input"
                        />
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : historyPurchase.length === 0 ? (
                        <p style={{ textAlign: "center" }}>Tidak ada history pembelian.</p>
                    ) : (
                        <table className="purchase-table">
                            <thead>
                                <tr>
                                    <th>Info Product</th>
                                    <th>Harga Barang</th>
                                    <th>Tanggal Pembelian</th>
                                    <th>Status Pengiriman</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyPurchase.map((history, index) => (
                                    <tr key={index} style={{ cursor: 'pointer' }} onClick={() => handleOpenModal(history.id_barang)}>
                                        <td className="product-info">
                                            <img src={getThumbnail(history.foto_barang) || defaultImage} alt={history.nama_barang} />
                                            <b>{history.nama_barang}</b>
                                        </td>
                                        <td>Rp{history.harga_barang?.toLocaleString('id-ID') || '-'}</td>
                                        <td>{history.tanggal_pembelian?.substring(0, 10)}</td>  
                                        <td>{history.status_pengiriman}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

           
            {/* {selectedProductId && (
                <ModalDetailPenjualan
                    show={showModal}
                    handleClose={handleCloseModal}
                    id_barang={selectedProductId}
                />
            )} */}
        </Container>
    );
}

export default PurchasePembeliPage;