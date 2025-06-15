import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GetLaporanDonasi } from "../../../api/apiPegawai";
import { toast } from "react-toastify";

import '../../CustomerService/CSDiscussionPage.css'

const LaporanDonasi = () => {
    const [date, setDate] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        const fetchPDF = async () => {
            if (date) {
                const bulan = String(date.getMonth() + 1).padStart(2, '0');
                const tahun = date.getFullYear();
                const bulanTahun = `${bulan}-${tahun}`;

                try {
                    const url = await GetLaporanDonasi(bulanTahun);

                    if (!url) {
                        toast.info("Laporan donasi untuk bulan yang dipilih tidak tersedia.");
                        setPdfUrl(null);
                    } else {
                        setPdfUrl(url);
                    }
                } catch (error) {
                    toast.error("Terjadi kesalahan saat mengambil laporan donasi.");
                    setPdfUrl(null);
                    console.error("Fetch PDF Error:", error);
                }
            }
        };

        fetchPDF();
    }, [date]);

    return (
        <Container>
            <div className="cs-diskusi-header-container">
                <h3><b>Laporan Donasi Barang</b></h3>
                <br />
                <DatePicker
                    selected={date}
                    onChange={(date2) => setDate(date2)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    placeholderText="Pilih Bulan & Tahun"
                    className="custom-datepicker-input"
                />
            </div>

            {pdfUrl ? (
                <div style={{ marginTop: '20px' }}>
                    <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
                </div>
            ) : (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p>Silakan pilih bulan dan tahun untuk melihat laporan donasi barang.</p>
                </div>
            )}
        </Container>
    );
};

export default LaporanDonasi;
