import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Container } from 'react-bootstrap';
import clockIcon from "../../assets/images/clock-icon.png";
import cimbLogo from "../../assets/images/cimb-logo.png";
import './PaymentPage.css';
import { FaRegCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { getTransaksiPembelian, CancelTransaksi, FinalizeTransaksi } from '../../api/apiTransaksiPembelian';
import { AddPoint } from '../../api/apiPembeli';

const PaymentPage = () => {
    const [previewImage, setPreviewImage] = useState(null);
    const [transaksiPembelian, setTransaksiPembelian] = useState({});
    const [buktiBayarFile, setBuktiBayarFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState('00:00:00');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransaksiPembelian = async () => {
            try {
                const data = await getTransaksiPembelian();
                setTransaksiPembelian(data.transaksi || {});
            } catch (error) {
                console.error("Error fetching transaksi pembelian:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransaksiPembelian();
    }, []);

    // Countdown timer with auto-cancel on timeout
    useEffect(() => {
        if (!transaksiPembelian.batas_pembayaran) return;

        const targetTime = new Date(transaksiPembelian.batas_pembayaran).getTime();

        const interval = setInterval(async () => {
            const now = Date.now();
            const distance = targetTime - now;

            if (distance <= 0) {
                setCountdown('00:00:00');
                clearInterval(interval);

                toast.error("Waktu pembayaran telah habis. Transaksi akan dibatalkan.");

                // Cancel transaksi otomatis
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

                // Redirect setelah delay
                setTimeout(() => {
                    navigate("/");
                }, 2000);

                return;
            }

            const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((distance / (1000 * 60)) % 60);
            const seconds = Math.floor((distance / 1000) % 60);

            const formatTime = (t) => t.toString().padStart(2, '0');

            setCountdown(`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [transaksiPembelian, navigate]);

    function formatNomorTransaksi(transaksi) {
        if (!transaksi || !transaksi.tanggal_pembelian || !transaksi.id_transaksi_pembelian) return '';

        const tanggal = new Date(transaksi.tanggal_pembelian);
        const year = tanggal.getFullYear().toString().slice(-2);
        const month = String(tanggal.getMonth() + 1).padStart(2, '0');
        const id = String(transaksi.id_transaksi_pembelian).padStart(3, '0');

        return `${year}.${month}.${id}`;
    }

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


    return (
        <>
            <Container className="container-payment">
                <div className="payment-box">
                    <div className="header-payment">
                        <div className="header-left-payment">
                            <img src={clockIcon} alt="clock" className="clock-icon" />
                            <div className="header-text">
                                <div className="pay-title">Bayar Sebelum</div>
                                <div className="pay-date">{transaksiPembelian.batas_pembayaran}</div>
                            </div>
                        </div>
                        <div className="timer-box">
                            {countdown}
                        </div>
                    </div>

                    <hr/>

                    <div className="title-payment">
                        Pembayaran
                    </div>
                    <div className="content-payment">
                        <div className="left">
                            <div className="bank-info-wrapper">
                                <img src={cimbLogo} alt="CIMB" className="bank-logo" />        
                                <div className="bank-info-text">
                                    <div className="bank-name">Bank CIMB Niaga</div>
                                    <div className="label-receiver">Nama Penerima</div>
                                    <div className="receiver-name">ReuseMart Corp</div>
                                    <div className="label-payment">Nomor Rekening</div>
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

                    <hr/>

                    <div className="footer-info">
                        <div className="footer-transaction-number">
                            <div className="label-transaction-number">Transaction Number</div>
                            <div className="transaction-number-payment">{formatNomorTransaksi(transaksiPembelian)}</div>
                        </div>
                        <div className="footer-total">
                            <div className="label-total-bill">Total Bill</div>
                            <div className="total-bill-payment">
                                Rp{transaksiPembelian?.total_pembayaran ? transaksiPembelian.total_pembayaran.toLocaleString('id-ID') : '0'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-payment">
                    <button className="confirm-btn" onClick={handleKonfirmasiPembayaran}>
                        Konfirmasi Pembayaran
                    </button>
                </div>
            </Container>
            <br />
        </>
    );
};

export default PaymentPage;
