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
            onSuccess();
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

    function getDiskonPoin(transaksi) {
        const diskonPoin = transaksi.penggunaan_poin * 100;
        return diskonPoin;
    }

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title><b>Detail Verifikasi Transaksi</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {dataVerifikasi ? (
                    <div className="d-flex flex-column gap-2">
                        <div><strong>No Transaksi:</strong> {formatNomorTransaksi(dataVerifikasi)}</div>
                        <div><strong>Nama Pembeli:</strong> {dataVerifikasi.nama_pembeli || '-'}</div>
                        <div><strong>Status:</strong> {dataVerifikasi.verifikasi_bukti}</div>

                        <h5 className="mb-1 mt-3"><b>Daftar Barang</b></h5>
                            <table className="table table-bordered">
                                <thead className="table-light">
                                    <tr>
                                        <th>Nama Barang</th>
                                        <th>Harga</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataVerifikasi.barang?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.nama_barang}</td>
                                            <td>Rp{item.harga_barang.toLocaleString('id-ID')}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="4" className="text-end fw-bold" style={{ color: 'red' }}>
                                            Potongan Poin : -Rp{getDiskonPoin(dataVerifikasi)?.toLocaleString('id-ID') || '-'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4" className="text-end fw-bold">
                                            Total Harga : Rp{dataVerifikasi.total_pembayaran?.toLocaleString('id-ID') || '-'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        <div><strong>Bukti Transfer :</strong></div>
                        <img
                            src={getThumbnailBuktiPembayaran(dataVerifikasi.bukti_pembayaran)}
                            alt="Bukti Transfer"
                            style={{ maxWidth: '300px', height: 'auto', borderRadius: '8px', }}
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
