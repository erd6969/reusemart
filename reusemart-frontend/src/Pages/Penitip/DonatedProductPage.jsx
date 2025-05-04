import './SoldProductPage.css';
import { useState, useEffect } from 'react';
import SearchIcon from "../../assets/images/search-icon.png";

import { ShowDonatedProduct } from "../../api/apiPenitip";
import { getThumbnail } from "../../api/index";

const DonatedProductPage = () => {
    const [donatedProduct, setDonatedProduct] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonatedProduct = async () => {
            try {
                const response = await ShowDonatedProduct();
                setDonatedProduct(response.data);
                console.log("Fetched on sale products:", response.data);

            } catch (error) {
                console.error("Error fetching sold products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDonatedProduct();
    }, []);

    return (
        <div className="histori-penitipan-wrapper">
            <div className="sold-products-container">
                <h2><b>Produk Didonasikan</b></h2>
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
                    ) : donatedProduct.length === 0 ? (
                        <p style={{textAlign:"center"}}>Tidak ada produk yang sedang didonasikan.</p>
                    ) : (
                        <table className="sold-products-table">
                            <thead>
                                <tr>
                                    <th>Informasi Produk</th>
                                    <th>Tanggal Donasi</th>
                                    <th>Organisasi</th>
                                    <th>Nama Penerima</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donatedProduct.map((product, index) => (
                                    <tr key={index}>
                                        <td className="product-info">
                                            <img src={getThumbnail(product.foto_barang) || defaultImage} alt={product.nama_barang} />
                                            <b>{product.nama_barang}</b>
                                        </td>
                                        <td>{product.tanggal_donasi?.substring(0, 10)}</td>
                                        <td>{product.nama_organisasi}</td>
                                        <td>{product.nama_penerima}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonatedProductPage;
