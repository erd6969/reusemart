import './OnSaleProductPage.css';
import { FaStar } from 'react-icons/fa';
import { Container, Spinner } from 'react-bootstrap';
import SearchIcon from "../../assets/images/search-icon.png";
import { use, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ShowOnSaleProducts } from '../../api/apiPenitip';
import { getThumbnailBarang } from "../../api/index";


const DonatedProductPage = () => {
    const [onSaleProducts, setOnSaleProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const fetchOnSaleProducts = async () => {
        setIsLoading(true);
        try {
            const response = await ShowOnSaleProducts();
            setOnSaleProducts(response.data);
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
        fetchOnSaleProducts();
    }, []);
    return (
        <div className="onsale-penitipan-wrapper">
            <div className="onsale-products-container">
                <h2><b>Produk Sedang Dijual</b></h2>
                <div className="onsale-products-content-container">
                    <div className="search-bar-onsale">
                        <img src={SearchIcon} alt="Search Icon" className="search-icon-inside" />
                        <input
                            type="text"
                            placeholder="Masukkan Nama Produk..."
                            className="search-input"
                        />
                    </div>

                    <table className="onsale-products-table">
                        <thead>
                            <tr>
                                <td><b>Info Produk</b></td>
                                <td><b>Deskripsi dan Kondisi</b></td>
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
                                    <tr key={index} style={{ fontSize: '15px' }}>
                                        <td style={{ width: '5%' }}>
                                            <img src={getThumbnailBarang(product.foto_barang) || defaultImage} alt={product.nama_barang} style={{ maxWidth: '6vw' }} />
                                            <b>{product.nama_barang}</b>
                                        </td>
                                        <td style={{ width: '42%' }}>
                                            <><strong>Deskripsi Barang :</strong><br />{product.deskripsi_barang}<br /></>
                                            <><strong>Kondisi Barang : </strong><br />{product.kondisi_barang}</>
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
            </div>
        </div>
    );
};

export default DonatedProductPage;
