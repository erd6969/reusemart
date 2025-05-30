import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GetLaporanKomisiBulanan } from "../../../api/apiPegawai";

import '../../CustomerService/CSDiscussionPage.css'

const LaporanKomisiBulanan = () => {
    const [date, setDate] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        const fetchPDF = async () => {
            if (date) {
                const bulan = String(date.getMonth() + 1).padStart(2, '0');
                const tahun = date.getFullYear();
                const bulanTahun = `${bulan}-${tahun}`;
                const url = await GetLaporanKomisiBulanan(bulanTahun);
                setPdfUrl(url);
            }
        };

        fetchPDF();
    }, [date]);

    return (
        <Container>
            <div className="cs-diskusi-header-container">
                <h3><b>Laporan Komisi Bulanan</b></h3>
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

            {pdfUrl && (
            <>
                {console.log("PDF URL:", pdfUrl)}
                <div style={{ marginTop: '20px' }}>
                <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
                </div>
            </>
            )}

        </Container>
    );
};

export default LaporanKomisiBulanan;
