import './CheckoutPage.css';
import { Container } from 'react-bootstrap';
import { useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const AlamatSection = () => {
    return (
        <Container className="pengiriman-container">
            <div className="pengiriman-content">
                <div className="pengiriman-title-section">
                    <h3><b>Opsi Pengiriman</b></h3>
                </div>
                <div className="opsi-pengiriman-section">
                    <button className="diantar-kurir-button"><b>Diantar Kurir</b></button>
                    <button className="ambil-di-gudang-button"><b>Ambil Di Gudang</b></button>
                </div>
                <div className="alamat-title-container">
                    <h4>
                        <FaMapMarkerAlt style={{ marginRight: '8px' }} />
                        <b>Home - Alinang Kanaeru</b>
                    </h4>
                </div>
            </div>
        </Container>
    );
}

const CheckoutPage = () => {
    return (
        <>
            <h1 className="checkout-title">CHECKOUT</h1>
            <AlamatSection />
        </>
    );
}

export default CheckoutPage;