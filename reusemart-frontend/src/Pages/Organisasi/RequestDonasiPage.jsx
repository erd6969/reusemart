import '../Penitip/SoldProductPage.css';
import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { Container } from 'react-bootstrap';
import SearchIcon from "../../assets/images/search-icon.png";
import defaultImage from "../../assets/images/Pembeli/Yuki.jpeg";

import { ShowSoldProducts } from "../../api/apiPenitip";
import { getThumbnail } from "../../api/index";

import ModalDetailPenjualan from "../../Components/Modal/ModalPenitip/ModalDetailPenjualan";

const RequestDonasiPage = () => {
    const [soldProducts, setSoldProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    useEffect(() => {
        const fetchSoldProducts = async () => {
            try {
                const response = await ShowSoldProducts();
                setSoldProducts(response.data);
                console.log("Fetched sold products:", response.data);
            } catch (error) {
                console.error("Error fetching sold products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSoldProducts();
    }, []);

    const handleOpenModal = (id_barang) => {
        setSelectedProductId(id_barang);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProductId(null);
    };

    return (
        <Container className="histori-penitipan-wrapper">
            <div className="sold-products-container">
                <h2><b>Produk Terjual</b></h2>
                <div className="sold-products-content-container">
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
                                    <tr key={index} style={{ cursor: 'pointer' }} onClick={() => handleOpenModal(product.id_barang)}>
                                        <td className="product-info">
                                            <img src={getThumbnail(product.foto_barang) || defaultImage} alt={product.nama_barang} />
                                            <b>{product.nama_barang}</b>
                                        </td>
                                        <td>Rp{product.harga_barang?.toLocaleString('id-ID') || '-'}</td>
                                        <td>{product.tanggal_pembelian?.substring(0, 10)}</td>
                                        <td>
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <FaStar
                                                    key={i}
                                                    color={i <= 0 ? "#facc15" : "#e5e7eb"}
                                                />
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
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

export default RequestDonasiPage;
