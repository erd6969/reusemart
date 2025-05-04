// CSPenitipManagementPage.js
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import "./CSDiscussionPage.css";

import { ShowDiskusiByDate } from "../../api/apiDiskusi";
import FotoProfil from "../../../src/assets/images/Pembeli/Yuki.jpeg";
import ModalDiskusi from "../../Components/Modal/ModalCS/ModalDiskusi";

const DiscussionBox = ({ diskusi, onClick }) => {
    return (
        <div className="cs-diskusi-container" onClick={() => onClick(diskusi.barang?.id_barang)}>
            <div className="cs-diskusi-header">
                <div className="cs-diskusi-user">
                    <img src={FotoProfil} alt="avatar" className="cs-diskusi-avatar" />
                    <div className="cs-diskusi-user-info">
                        <p className="cs-diskusi-nama">{diskusi.pembeli?.nama || "Nama Pembeli"}</p>
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

    return (
        <Container>
            <div className="cs-diskusi-header-container">
                <h2>
                    {new Date().toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })}
                </h2>
            </div>

            <div className="cs-diskusi-content-container">
                {loading ? (
                    <p>Memuat diskusi...</p>
                ) : diskusiList.length === 0 ? (
                    <p>Tidak ada diskusi hari ini.</p>
                ) : (
                    diskusiList.map((item, idx) => (
                        <DiscussionBox key={idx} diskusi={item} onClick={openModal} />
                    ))
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
