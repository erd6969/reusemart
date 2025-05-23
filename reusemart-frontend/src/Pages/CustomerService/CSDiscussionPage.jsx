// CSPenitipManagementPage.js
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import "./CSDiscussionPage.css";

import { ShowDiskusiByDate } from "../../api/apiDiskusi";
import ModalDiskusi from "../../Components/Modal/ModalCS/ModalDiskusi";

import { getThumbnailPembeli } from "../../api";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DiscussionBox = ({ diskusi, onClick }) => {
    return (
        <div className="cs-diskusi-container" onClick={() => onClick(diskusi.barang?.id_barang)}>
            <div className="cs-diskusi-header">
                <div className="cs-diskusi-user">
                    <img src={getThumbnailPembeli(diskusi.pembeli?.foto_pembeli)} alt="avatar" className="cs-diskusi-avatar" />
                    <div className="cs-diskusi-user-info">
                        <p className="cs-diskusi-nama">{diskusi.pembeli?.nama_pembeli || "Nama Pembeli"}</p>
                        <p className="cs-diskusi-produk">
                            Produk: <span className="cs-diskusi-produk-nama">{diskusi.barang?.nama_barang || "Nama Barang"}</span>
                        </p>
                    </div>
                </div>
                <p className="cs-diskusi-tanggal">
                    {new Date(diskusi.waktu_diskusi).toLocaleString("id-ID")}
                </p>
            </div>
            <div className="cs-diskusi-isi">
                {diskusi.diskusi}
            </div>
        </div>
    );
};

const CSPenitipManagementPage = () => {
    const [diskusiList, setDiskusiList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedBarangId, setSelectedBarangId] = useState(null);
    const [date, setDate] = useState(null);

    const openModal = (id) => {
        setSelectedBarangId(id);
        setShowModal(true);
    };

    useEffect(() => {
        const fetchDiskusi = async () => {
            try {
                const response = await ShowDiskusiByDate();
                setDiskusiList(response.data);
                console.log("Diskusi:", response.data);
            } catch (error) {
                console.error("Error fetching diskusi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDiskusi();
    }, []);

    const filteredDiskusi = diskusiList.filter((diskusi) => {
        if(date){
            console.log("Date Diskusi Awal", date);
            const nowDate = new Date(diskusi.waktu_diskusi);
            const nowDateString = nowDate.toISOString().split("T")[0];

            const dateString = date.toLocaleDateString('en-CA');
            
            console.log("Date Diskusi", nowDateString);
            console.log("Date Picker", dateString);
            return nowDateString == dateString;
        }
        return true;
    }
    );

    return (
        <Container>
            <div className="cs-diskusi-header-container">
                <DatePicker
                    selected={date}
                    onChange={(date2) => setDate(date2)}
                    placeholderText="Masukkan Tanggal"
                    dateFormat="yyyy-MM-dd"
                    className="custom-datepicker-input"
                    calendarClassName="custom-datepicker-calendar"
                />
            </div>

            <div className="cs-diskusi-content-container">
                {loading ? (
                    <p>Memuat diskusi...</p>
                ) : (
                    filteredDiskusi.length === 0 ? (
                        <p>Tidak ada diskusi pada tanggal ini.</p>
                    ) : (
                        filteredDiskusi.map((item) => (
                            <DiscussionBox key={item.id_diskusi} diskusi={item} onClick={openModal} />
                        ))
                    )
                )}
            </div>

            <ModalDiskusi
                show={showModal}
                onHide={() => setShowModal(false)}
                id_barang={selectedBarangId}
            />
        </Container>
    );
};

export default CSPenitipManagementPage;
