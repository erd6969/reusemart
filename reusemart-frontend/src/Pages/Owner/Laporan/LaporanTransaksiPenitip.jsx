import InputColumn from '../../../Components/InputColumn';
import { Container, Button, Spinner } from 'react-bootstrap';
import { SearchPenitip, ShowAllPenitip } from '../../../api/apiPenitip';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GetLaporanTransaksiPenitip } from '../../../api/apiPegawai';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SearchComponent = ({ onSearch, selectedDate, onDateChange }) => {
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        onSearch(inputValue);
    }, [inputValue, onSearch]);

    return (
        <div className="searchComponent">
            <div className="searchContainer">
                <InputColumn 
                    typeInput="text"
                    idInput="nama_penitip"
                    placeholderInput="Masukkan Nama Penitip..."
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </div>
            <div style={{ minWidth: "200px", marginLeft: "15px", marginTop: "4px" }}>
                <DatePicker
                    selected={selectedDate}
                    onChange={onDateChange}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    placeholderText="Pilih Bulan & Tahun"
                    className="custom-datepicker-input"
                />
            </div>
        </div>
    );
};

const LaporanTransaksiPenitip = () => {
    const [penitipList, setPenitipList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedDate, setSelectedDate] = useState(null);

    const fetchPenitipData = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await ShowAllPenitip(page);
            setPenitipList(response.data);
            setTotalPages(response.last_page);
            setCurrentPage(response.current_page);
        } catch (error) {
            console.error("Error fetching penitip data:", error);
            setPenitipList([]);
        } finally {
            setIsLoading(false);
            setIsFirstLoad(false);
        }
    };

    const fetchSearchData = async () => {
        if (searchQuery.trim() === "") {
            fetchPenitipData(1);
        } else {
            setIsLoading(true);
            try {
                const response = await SearchPenitip(searchQuery);
                setPenitipList(response.data);
                setCurrentPage(1);
                setTotalPages(1);
            } catch (error) {
                console.error("Error searching penitip:", error);
                setPenitipList([]);
            } finally {
                setIsLoading(false);
                setIsFirstLoad(false);
            }
        }
    };

    const handleDownloadPdf = async (id_penitip, date) => {
        if (!date) {
            alert("Silakan pilih bulan dan tahun terlebih dahulu.");
            return;
        }
        const bulan = String(date.getMonth() + 1).padStart(2, '0');
        const tahun = date.getFullYear();
        const bulanTahun = `${bulan}-${tahun}`;
        try {
            const fileURL = await GetLaporanTransaksiPenitip(id_penitip, bulanTahun);
            if (fileURL) {
                window.open(fileURL, "_blank");
            } else {
                alert("Laporan tidak ditemukan.");
            }
        } catch (error) {
            console.error("Error getting laporan PDF:", error);
            alert("Terjadi kesalahan saat mengunduh laporan.");
        }
    };

    useEffect(() => {
        fetchSearchData();
    }, [searchQuery]);

    const handlePagination = (page) => {
        fetchPenitipData(page);
    };

    return (
        <Container>
            <div className="cs-diskusi-header-container">
                <h3><b>Laporan Transaksi Penitip</b></h3>
                <SearchComponent 
                    onSearch={setSearchQuery} 
                    selectedDate={selectedDate} 
                    onDateChange={setSelectedDate} 
                />
            </div>
            <br />

            {/* Table */}
            <div className="tableContainer1">
                <table className="dataTable1">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama Penitip</th>
                            <th>Email</th>
                            <th>Telepon</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(isLoading || isFirstLoad) ? (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    <Spinner animation="border" variant="primary" />
                                    <div>Loading...</div>
                                </td>
                            </tr>
                        ) : penitipList.length > 0 ? (
                            penitipList.map((penitip) => (
                                <tr key={penitip.id_penitip}>
                                    <td>PNT.{penitip.id_penitip}</td>
                                    <td>{penitip.nama_penitip}</td>
                                    <td>{penitip.email_penitip}</td>
                                    <td>{penitip.nomor_telepon_penitip}</td>
                                    <td className="actionButtons1">
                                        <Button 
                                            variant="primary" 
                                            onClick={() => handleDownloadPdf(penitip.id_penitip, selectedDate)}
                                        >
                                            Laporan
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Tidak ada data penitip yang ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {searchQuery.trim() === "" && (
                    <div className="pagination d-flex justify-content-center align-items-center mt-4">
                        <Button
                            variant="secondary"
                            disabled={currentPage === 1}
                            onClick={() => handlePagination(currentPage - 1)}
                            className="me-2"
                        >
                            <FaChevronLeft />
                        </Button>
                        <span>Halaman {currentPage} dari {totalPages}</span>
                        <Button
                            variant="secondary"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePagination(currentPage + 1)}
                            className="ms-2"
                        >
                            <FaChevronRight />
                        </Button>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default LaporanTransaksiPenitip;
