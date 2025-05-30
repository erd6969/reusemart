import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { GetLaporanStokGudang } from "../../../api/apiPegawai";

import '../../CustomerService/CSDiscussionPage.css'

const LaporanStokGudang = () => {
    const [date, setDate] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        const fetchPDF = async () => {
            const url = await GetLaporanStokGudang();
            setPdfUrl(url);
        };
        fetchPDF();
    }, []);


    return (
        <Container>
            <div className="cs-diskusi-header-container">
                <h3><b>Laporan Stok Gudang</b></h3>
            </div>

            <div style={{ marginTop: '20px' }}>
                <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
            </div>
            {console.log(pdfUrl)}

        </Container>
    );
}

export default LaporanStokGudang;