
import './HistoryRequestDonasiPage.css';
import { useState, useEffect } from 'react';
import { Container, Button, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import SearchIcon from "../../assets/images/search-icon.png";


import { ShowHistoryRequestById, SearchRequestHistory } from "../../api/apiOrganisasi";

const HistoryDonasiPage = () => {
    const [historyDonasi, setHistoryDonasi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchHistoryReqDonasi = async () => {
        setLoading(true);
        try {
            const response = await ShowHistoryRequestById();
            setHistoryDonasi(response.data);
        } catch (error) {
            console.error("Error fetching history donasi :", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim().length >= 3) {
                setLoading(true);
                SearchRequestHistory(searchQuery.trim())
                    .then((data) => {
                        const hasil = Array.isArray(data) ? data : [data];
                        setHistoryDonasi(hasil);
                        console.log("Hasil pencarian:", hasil);
                    })
                    .catch((error) => {
                        console.error("Error searching history:", error);
                        setHistoryDonasi([]);
                    })
                    .finally(() => setLoading(false));
            } else {
                fetchHistoryReqDonasi();
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);


    return (
        <Container className="hstry-wrapper">
            <div className="histo-donasi-container">
                <h2><b>History Donasi</b></h2>
                <div className="histo-donasi-content-container">
                    <div style={{ display: "flex", gap: '10px', justifyContent: "space-between" }}>
                        <div className="search-bar-hstry">
                            <img src={SearchIcon} alt="Search Icon" className="search-icon-inside" />
                            <input
                                type="text"
                                placeholder="Masukkan History Donasi..."
                                className="search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : historyDonasi.length === 0 ? (
                        <p style={{ textAlign: "center" }}>Tidak ada request untuk saat ini.</p>
                    ) : (
                        <table className="histo-donasi-table">
                            <thead>
                                <tr>
                                    <th>Detail Request</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyDonasi.map((req, index) => (
                                    <tr key={index}>
                                        <td>{req.detail_request}</td>
                                        <td className='action-buttons-req'>
                                            <h4>
                                                <Badge bg={
                                                    req.status_request?.toLowerCase() === 'accepted'
                                                        ? 'success'
                                                        : req.status_request?.toLowerCase() === 'rejected'
                                                            ? 'danger'
                                                            : 'secondary'
                                                }>
                                                    {req.status_request}
                                                </Badge>
                                            </h4>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default HistoryDonasiPage;
