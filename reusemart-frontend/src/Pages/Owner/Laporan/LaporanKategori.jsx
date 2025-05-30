import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GetLaporanKategori } from "../../../api/apiPegawai";

import '../../CustomerService/CSDiscussionPage.css'

const LaporanKategori = () => {
    const [date, setDate] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        const fetchPDF = async () => {
            if (date) {
                const tahun = date.getFullYear();
                const url = await GetLaporanKategori(tahun.toString()); 
                setPdfUrl(url);
            }
        };

        fetchPDF();
    }, [date]);

    return (
        <Container>
            <div className="cs-diskusi-header-container">
                <h3><b>Laporan Penjualan per Kategori Barang</b></h3>
                <br />
                <DatePicker
                    selected={date}
                    onChange={(date2) => setDate(date2)}
                    dateFormat="yyyy"
                    showYearPicker
                    placeholderText="Pilih Tahun"
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

export default LaporanKategori;
