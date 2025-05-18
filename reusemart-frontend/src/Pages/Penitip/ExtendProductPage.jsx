import './SoldProductPage.css';
import { FaStar } from 'react-icons/fa';
import { Badge, Container, Spinner } from 'react-bootstrap';
import SearchIcon from "../../assets/images/search-icon.png";
import { use, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ShowExtendProducts, extendBarang, ambilBarang } from '../../api/apiPenitip';
import { getThumbnailBarang } from "../../api/index";


const ExtendProductPage = () => {
    const [extendProducts, setExtendProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const fetchExtendProducts = async () => {
        setIsLoading(true);
        try {
            const response = await ShowExtendProducts();
            setExtendProducts(response.data);
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

    useEffect(() => {
        fetchExtendProducts();
    }, []);
    return (
        <div className="histori-penitipan-wrapper">
            <div className="sold-products-container">
                <h2><b>Produk Masa Penitipan Habis</b></h2>
                <div className="sold-products-content-container">
                    <div className="search-bar">
                        <img src={SearchIcon} alt="Search Icon" className="search-icon-inside" />
                        <input
                            type="text"
                            placeholder="Masukkan Nama Produk..."
                            className="search-input"
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
                                    <tr key={index} style={{ fontSize: '15px' }}>
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
                                                            <button className="btn btn-success" onClick={() => handleExtend(product.id_detail_transaksi_penitipan)}>
                                                                Extend
                                                            </button>

                                                            <button style={{ color: 'white' }} className="btn btn-danger" onClick={() => handleAmbil(product.id_barang)}>
                                                                Ambil
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button style={{ color: 'white', width:'100%' }} className="btn btn-danger" onClick={() => handleAmbil(product.id_barang)}>
                                                            Ambil
                                                        </button>)}
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
            </div>
        </div>
    );
};

export default ExtendProductPage;
