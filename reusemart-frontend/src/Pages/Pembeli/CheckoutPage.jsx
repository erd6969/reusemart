import './CheckoutPage.css';
import { Container } from 'react-bootstrap';
import { useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import gambarBarang from '../../assets/images/CinaBekas2.jpg';
import gambarToko from '../../assets/images/BurniceKicil.jpg';
import ModalListAlamat from '../../Components/Modal/ModalListAlamat';
import ModalPoint from '../../Components/Modal/ModalPoint';

const AlamatSection = () => {
    const [shippingOption, setShippingOption] = useState('courier');
    const [showModal, setShowModal] = useState(false);

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
                            <b>{shippingOption === 'courier' ? 'Rumah - Alinang Kanaeru' : 'Gudang ReuseMart Yogyakarta'}</b>
                        </h4>
                        {shippingOption === 'courier' && (
                            <button className="change-button" onClick={() => setShowModal(true)}>Ubah</button>
                        )}
                    </div>

                    <div className="alamat-detail-container">
                        {shippingOption === 'courier' ? (
                            <p>Jl. Putanginamo Talaga Gago No. 69 (Depan Silintwangi), Caturtunggal, Depok, Kabupaten Sleman, 55198</p>
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
            <ModalListAlamat
                show={showModal}
                handleClose={() => setShowModal(false)}
            />
        </Container>
    );
};


const OrderList = ({ cartItems }) => {
    return (
        <Container className="order-container">
            {cartItems.map((toko, tokoIndex) => (
                <div className="order-box" key={tokoIndex}>
                    <h4>Pesanan {tokoIndex + 1}</h4>
                    <div className="seller-name">
                        <img src={gambarToko} alt="Penjual" />
                        {toko.toko}
                    </div>
                    {toko.items.map((item, itemIndex) => (
                        <div className="order-item" key={itemIndex}>
                            <div className="order-item-info">
                                <img src={item.gambar} alt="Produk" />
                                <span className="order-item-name">{item.nama}</span>
                            </div>
                            <span className="order-item-price">{item.quantity} x Rp{item.harga.toLocaleString('id-ID')}</span>
                        </div>
                    ))}
                </div>
            ))}
        </Container>
    );
};

const PaymentDetail = ({ cartItems }) => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const totalHarga = cartItems.reduce(
        (acc, toko) => acc + toko.items.reduce((sum, item) => sum + item.harga * item.quantity, 0),
        0
    );

    const ongkir = 100000;
    const potonganPoin = 100000;
    const totalBayar = totalHarga + ongkir - potonganPoin;
    const poinDapat = Math.floor(totalBayar / 10000);

    return (
        <>
            <div className="payment-box">
                <h3><b>Rincian Pembayaran</b></h3>

                <p>
                    <span>Total Harga</span>
                    <span>Rp{totalHarga.toLocaleString('id-ID')}</span>
                </p>

                <p>
                    <span>Biaya Pengiriman</span>
                    <span>Rp{ongkir.toLocaleString('id-ID')}</span>
                </p>

                <p>
                    <span>
                        Diskon Poin<br />
                    </span>
                    <span className="discount">- Rp{potonganPoin.toLocaleString('id-ID')}</span>
                </p>

                <p style={{ fontSize: '12px', textAlign: 'right', marginTop: '10px', color: '#888', float: 'right', marginBottom: '-10px' }}>
                    1000 Poin Tersedia
                </p>

                <button className="loyalty-button" onClick={() => setShowModal(true)}>Gunakan Poin</button>
            </div>

            <div className="total-bill-section">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><b>Total Bayar : </b></span>
                    <span className="total-bill-amount"><span className="point-earned">(+{poinDapat} Poin)</span> Rp{totalBayar.toLocaleString('id-ID')}</span>
                </div>

                <button className="pay-button" onClick={() => navigate("/pembeli/pembayaran")}>Bayar Sekarang</button>
            </div>
            <ModalPoint
                show={showModal}
                handleClose={() => setShowModal(false)}
            />
        </>
    );
};

const CheckoutPage = () => {
    const [cartItems] = useState([
        {
            toko: "Cahaya Design",
            items: [
                { id: 1, nama: "Cina bekas 2", harga: 1200000, quantity: 1, gambar: gambarBarang },
                { id: 2, nama: "Hog Rider Solo", harga: 69000, quantity: 1, gambar: gambarBarang },
            ],
        },
        {
            toko: "Monster Melvern",
            items: [
                { id: 3, nama: "Kobo Batang", harga: 1000, quantity: 1, gambar: gambarBarang },
            ],
        },
    ]);

    return (
        <>
            <h1 className="checkout-title">CHECKOUT</h1>
            <div className="checkout-content">
                <div className="left-section">
                    <AlamatSection />
                    <OrderList cartItems={cartItems} />
                </div>
                <div className="right-section">
                    <PaymentDetail cartItems={cartItems} />
                </div>
            </div>
        </>
    );
};

export default CheckoutPage;
