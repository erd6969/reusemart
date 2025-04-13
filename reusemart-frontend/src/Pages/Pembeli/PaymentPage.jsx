import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap';
import clockIcon from "../../assets/images/clock-icon.png";
import cimbLogo from "../../assets/images/cimb-logo.png";
import './PaymentPage.css';
import { FaRegCopy } from 'react-icons/fa';

const PaymentPage = () => {
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    return (
        <>
            <Container className="container-payment">
                <div className="payment-box">
                    {/* Header */}
                    <div className="header-payment">
                        <div className="header-left-payment">
                            <img src={clockIcon} alt="clock" className="clock-icon" />
                            <div className="header-text">
                                <div className="pay-title">Bayar Sebelum</div>
                                <div className="pay-date">23 Maret 2025, 16:00 WIB</div>
                            </div>
                        </div>
                        <div className="timer-box">
                            00:15:00
                        </div>
                    </div>

                    <hr/>

                    {/* Content */}
                    <div className="title-payment">
                        Pembayaran
                    </div>
                    <div className="content-payment">
                        <div className="left">
                            <div className="bank-info-wrapper">
                                <img src={cimbLogo} alt="CIMB" className="bank-logo" />        
                                <div className="bank-info-text">
                                    <div className="bank-name">
                                        Bank CIMB Niaga
                                    </div>
                                    <div className="label-receiver">
                                        Nama Penerima
                                    </div>
                                    <div className="receiver-name">
                                        ReuseMart Corp
                                    </div>
                                    <div className="label-payment">
                                        Nomor Rekening
                                    </div>
                                    <div className="account-box">
                                        <span className="account-number">
                                            707039994100
                                        </span>
                                        <span className="copy-icon">
                                            <FaRegCopy />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="right">
                            <div className="label-bukti-pembayaran">Bukti Pembayaran</div>
                            <div className="proof-box">
                                {previewImage && (
                                    <img
                                        src={previewImage}
                                        alt="Proof Preview"
                                        className="preview-image"
                                    />
                                )}
                            </div>
                            <label className="upload-btn">
                                Upload
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    </div>

                    <hr/>

                    {/* Footer info */}
                    <div className="footer-info">
                        <div className="footer-transaction-number">
                            <div className="label-transaction-number">Transaction Number</div>
                            <div className="transaction-number-payment">23.03.101</div>
                        </div>
                        <div className="footer-total">
                            <div className="label-total-bill">Total Bill</div>
                            <div className="total-bill-payment">Rp1.270.000</div>
                        </div>
                    </div>
                </div>

                {/* Footer bar */}
                <div className="footer-payment">
                    <button className="confirm-btn" onClick={() => navigate("/pembeli/list-transaksi")}>Konfirmasi Pembayaran</button>
                </div>
            </Container>
            <br />
        </>
    );
};

export default PaymentPage;
