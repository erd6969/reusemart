import { Modal, Button, Spinner } from 'react-bootstrap';
import { getThumbnailBuktiPembayaran } from '../../../api';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { VerifikasiTransaksiPenitipan, TolakTransaksiPenitipan } from '../../../api/apiTransaksiPenitipan';

const ModalVerifikasi = ({ show, handleClose, dataVerifikasi, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    const handleVerifikasi = async () => {
        if (!dataVerifikasi?.id_transaksi_pembelian) return;

        try {
            setLoading(true);
            await VerifikasiTransaksiPenitipan(dataVerifikasi.id_transaksi_pembelian);
            toast.success('Transaksi berhasil diverifikasi');
            onSuccess();  // Trigger reload or refresh
            handleClose();
        } catch (err) {
            toast.error('Gagal memverifikasi transaksi');
        } finally {
            setLoading(false);
        }
    };

    const handleTolak = async () => {
        if (!dataVerifikasi?.id_transaksi_pembelian) return;

        try {
            setLoading(true);
            await TolakTransaksiPenitipan(dataVerifikasi.id_transaksi_pembelian);
            toast.success('Transaksi berhasil ditolak');
            onSuccess();  // Trigger reload or refresh
            handleClose();
        } catch (err) {
            toast.error('Gagal menolak transaksi');
        } finally {
            setLoading(false);
        }
    };

    function formatNomorTransaksi(transaksi) {
        if (!transaksi || !transaksi.tanggal_pembelian || !transaksi.id_transaksi_pembelian) return '';

        const tanggal = new Date(transaksi.tanggal_pembelian);
        const year = tanggal.getFullYear().toString().slice(-2);
        const month = String(tanggal.getMonth() + 1).padStart(2, '0');
        const id = String(transaksi.id_transaksi_pembelian).padStart(3, '0');

        return `${year}.${month}.${id}`;
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Detail Verifikasi Transaksi</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {dataVerifikasi ? (
                    <div className="d-flex flex-column gap-2">
                        <div><strong>No Transaksi:</strong> {formatNomorTransaksi(dataVerifikasi)}</div>
                        <div><strong>Nama Pembeli:</strong> {dataVerifikasi.nama_pembeli || '-'}</div>
                        <div><strong>Nama Barang:</strong> {dataVerifikasi.nama_barang || '-'}</div>
                        <div><strong>Jumlah:</strong> 1</div>
                        <div><strong>Total Harga:</strong> Rp {dataVerifikasi.total_pembayaran?.toLocaleString() || '0'}</div>
                        <div><strong>Status:</strong> {dataVerifikasi.verifikasi_bukti}</div>
                        <div><strong>Bukti Transfer:</strong></div>
                        <img
                            src={getThumbnailBuktiPembayaran(dataVerifikasi.bukti_pembayaran)}
                            alt="Bukti Transfer"
                            className="img-fluid rounded border"
                        />
                    </div>
                ) : (
                    <div>Loading data...</div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleTolak} disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : "Tolak"}
                </Button>
                <Button variant="success" onClick={handleVerifikasi} disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : "Verifikasi"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalVerifikasi;
