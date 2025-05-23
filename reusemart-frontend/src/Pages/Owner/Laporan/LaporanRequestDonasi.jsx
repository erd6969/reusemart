import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { GetLaporanRequestDonasi } from "../../../api/apiPegawai";

import '../../CustomerService/CSDiscussionPage.css'

const LaporanRequestDonasi = () => {
    const [date, setDate] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        const fetchPDF = async () => {
            const url = await GetLaporanRequestDonasi();
            setPdfUrl(url);
        };
        fetchPDF();
    }, []);


    return (
        <Container>
            <div className="cs-diskusi-header-container">
                <h3><b>Laporan Request Donasi</b></h3>
            </div>

            <div style={{ marginTop: '20px' }}>
                <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
            </div>
            {console.log(pdfUrl)}

        </Container>
    );
}

export default LaporanRequestDonasi;