import './CheckoutPage.css';
import { Container, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import ModalListAlamat from '../../Components/Modal/ModalAlamat/ModalListAlamat';
import ModalPoint from '../../Components/Modal/ModalTransaksi/ModalPoint';

import { ShowCart } from '../../api/apiKeranjang';
import { getThumbnailBarang, getThumbnailPenitip } from "../../api";

import { GetAlamatUtama, GetAlamatById } from '../../api/apiAlamat';
import { GetProfile, ReducePoint } from '../../api/apiPembeli';
import { CreateKomisi, GetKomponenKomisi } from '../../api/apiKomisi';
import { CreateTransaksiPembelian } from '../../api/apiTransaksiPembelian';

import { useCart } from "../../Components/Context/CartContext";
import { toast } from 'react-toastify';

const AlamatSection = ({ alamatUtama, setShowModal, shippingOption, setShippingOption }) => {
    return (
        <Container className="bagian-pengiriman-container">
            <div className="pengiriman-content">
                <div className="pengiriman-title-section">
                    <h3><b>Opsi Pengiriman</b></h3>
                </div>

                <div className="opsi-pengiriman-section">
                    <button
                        className={`shipping-button ${shippingOption === 'courier' ? 'active-courier' : 'inactive'}`}
                        onClick={() => setShippingOption('courier')}
                    >
                        <b>Antar Kurir</b>
                    </button>
                    <button
                        className={`shipping-button ${shippingOption === 'pickup' ? 'active-pickup' : 'inactive'}`}
                        onClick={() => setShippingOption('pickup')}
                    >
                        <b>Ambil di Gudang</b>
                    </button>
                </div>

                <div className="alamat-section">
                    <div className="alamat-title-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4>
                            <FaMapMarkerAlt style={{ marginRight: '8px' }} />
                            <b>
                                {shippingOption === 'courier'
                                    ? alamatUtama?.nama_alamat || 'Loading...'
                                    : 'Gudang ReuseMart Yogyakarta'}
                            </b>
                        </h4>
                        {shippingOption === 'courier' && (
                            <button className="change-button" onClick={() => setShowModal(true)}>Ubah</button>
                        )}
                    </div>

                    <div className="alamat-detail-container">
                        {shippingOption === 'courier' ? (
                            alamatUtama ? (
                                <p>
                                    {alamatUtama.alamat} ({alamatUtama.keterangan}), {alamatUtama.kelurahan}, {alamatUtama.kecamatan}, Kabupaten {alamatUtama.kabupaten}, {alamatUtama.kode_pos}
                                </p>
                            ) : (
                                <p>Loading alamat utama...</p>
                            )
                        ) : (
                            <>
                                <p>Jl. Cyka Blyat No. 01, Jomblangan, Banguntapan, Kabupaten Bantul, 55888</p>
                                <p className="pickup-warning">
                                    *Catatan: Kamu harus mengambil barang sesuai jadwal yang ditentukan atau transaksi akan dibatalkan.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
};

const OrderList = ({ cartItems }) => {
    return (
        <Container className="order-container">
            {cartItems.map((toko, tokoIndex) => (
                <div className="order-box" key={toko.id_penitip}>
                    <h4>Pesanan {tokoIndex + 1}</h4>
                    <div className="seller-name">
                        <img src={getThumbnailPenitip(toko.foto_penitip)} alt="Penjual" />
                        {toko.nama_penitip}
                    </div>
                    {toko.barang.map((item) => (
                        <div className="order-item" key={item.id_barang}>
                            <div className="order-item-info">
                                <img src={getThumbnailBarang(item.foto_barang)} alt="Produk" />
                                <span className="order-item-name">{item.nama_barang}</span>
                            </div>
                            <span className="order-item-price">1 x Rp{item.harga_barang?.toLocaleString('id-ID')}</span>
                        </div>
                    ))}
                </div>
            ))}
        </Container>
    );
};

const PaymentDetail = ({ cartItems, alamatUtama, shippingOption }) => {
    const [profile, setProfile] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedPoints, setSelectedPoints] = useState(0);
    const [komisi, setKomisi] = useState([]);
    const { refreshCartCount } = useCart() || {};
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const response = await GetProfile();
            setProfile(response);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const totalHarga = cartItems.reduce((total, toko) => {
        return total + toko.barang.reduce((subTotal, item) => subTotal + (item.harga_barang || 0), 0);
    }, 0);

    const handleBayarSekarang = async () => {
        if (cartItems.length === 0) return;

        try {
            const promises = cartItems.flatMap(barang =>
                barang.barang.map(item => GetKomponenKomisi(item.id_barang))
            );
            const results = await Promise.all(promises);
            setKomisi(results);

            const createPromises = [];
            cartItems.forEach(barang => {
                barang.barang.forEach(item => {
                    const komisiData = results.shift();
                    const payload = {
                        total_harga_kotor: item.harga_barang + ongkir - potonganPoin,
                        total_harga_bersih: item.harga_barang + komisiData.bonus_penitip - (
                            komisiData.komisi_hunter +
                            komisiData.komisi_reusemart
                        ),
                        komisi_hunter: komisiData.komisi_hunter,
                        komisi_reusemart: komisiData.komisi_reusemart,
                        bonus_penitip: komisiData.bonus_penitip,
                    };
                    createPromises.push(CreateKomisi(item.id_barang, payload));
                });
            });
            await Promise.all(createPromises);
            await ReducePoint(selectedPoints);
            refreshCartCount();
            const transaksiData = {
                id_alamat: shippingOption === 'courier' ? alamatUtama.id_alamat : null,
                pengiriman: shippingOption,
                penggunaan_poin: selectedPoints,
                tambahan_poin: poinDapat,
                total_pembayaran: totalBayar,
            };

            const transaksiResponse = await CreateTransaksiPembelian(transaksiData);

            if (!transaksiResponse) {
                toast.error("Gagal melakukan transaksi");
                return;
            }
        } catch (error) {
            console.error("Error saat proses bayar:", error);
        } finally {
            navigate("/pembeli/pembayaran");
        }
    };


    const ongkir = totalHarga < 1500000 ? 100000 : 0;
    const potonganPoin = selectedPoints > 0 ? selectedPoints * 100 : 0;
    const totalBayar = totalHarga + ongkir - potonganPoin;
    const poinDapat = totalHarga >= 500000 ? Math.floor((totalBayar / 10000) + ((totalBayar / 10000) * 0.2)) : Math.floor(totalBayar / 10000);

    return (
        <>
            <div className="payment-box">
                <h3><b>Rincian Pembayaran</b></h3>
                <p><span>Total Harga</span><span>Rp{totalHarga.toLocaleString('id-ID')}</span></p>
                <p><span>Biaya Pengiriman</span><span>Rp{ongkir.toLocaleString('id-ID')}</span></p>
                <p><span>Diskon Poin</span><span className="discount">- Rp{potonganPoin.toLocaleString('id-ID')}</span></p>
                <p style={{ fontSize: '12px', textAlign: 'right', marginTop: '10px', color: '#888', float: 'right', marginBottom: '-10px' }}>
                    {profile.poin_loyalitas} Poin Tersisa
                </p>
                <button className="loyalty-button" onClick={() => setShowModal(true)}>Gunakan Poin</button>
            </div>

            <div className="total-bill-section">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><b>Total Bayar : </b></span>
                    <span className="total-bill-amount"><span className="point-earned">(+{poinDapat} Poin)</span> Rp{totalBayar.toLocaleString('id-ID')}</span>
                </div>

                <button className="pay-button" onClick={handleBayarSekarang}>
                    Bayar Sekarang
                </button>

            </div>

            <ModalPoint
                show={showModal}
                handleClose={() => setShowModal(false)}
                onConfirm={(points) => setSelectedPoints(points)}
            />
        </>
    );
};

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [alamatUtama, setAlamatUtama] = useState(null);
    const [shippingOption, setShippingOption] = useState('courier');
    const [showModalAlamat, setShowModalAlamat] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCartData = async () => {
        setIsLoading(true);
        try {
            const response = await ShowCart();
            setCartItems(response);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAlamatUtama = async () => {
        try {
            const response = await GetAlamatUtama();
            setAlamatUtama(response);
        } catch (error) {
            console.error("Error fetching main address:", error);
        }
    };

    const fetchAlamatById = async (id) => {
        try {
            const response = await GetAlamatById(id);
            setAlamatUtama(response);
        } catch (error) {
            console.error("Error fetching address by ID:", error);
        }
    };

    useEffect(() => {
        fetchCartData();
        fetchAlamatUtama();
    }, []);

    useEffect(() => {
        if (!isLoading && cartItems.length === 0) {
            toast.warning("Terjadi kesalahan, tidak ada barang yang hendak dicheckout");
            navigate("/pembeli/shop");
        }
    }, [isLoading, cartItems, navigate]);

    return isLoading ? (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <Spinner animation="border" role="status" variant="primary" >
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </Container>
    ) : (
        <>
            <h1 className="checkout-title">CHECKOUT</h1>
            <div className="checkout-content">
                <div className="left-section">
                    <AlamatSection
                        alamatUtama={alamatUtama}
                        setShowModal={setShowModalAlamat}
                        shippingOption={shippingOption}
                        setShippingOption={setShippingOption}
                    />
                    <OrderList cartItems={cartItems} />
                </div>
                <div className="right-section">
                    <PaymentDetail
                        cartItems={cartItems}
                        alamatUtama={alamatUtama}
                        shippingOption={shippingOption}
                    />
                </div>
            </div>
            <ModalListAlamat
                show={showModalAlamat}
                handleClose={() => setShowModalAlamat(false)}
                onSelect={(id) => {
                    fetchAlamatById(id);
                    setAlamatUtama(null);
                }}
            />
        </>
    );

};

export default CheckoutPage;
