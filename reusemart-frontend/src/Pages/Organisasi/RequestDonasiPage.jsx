
import './RequestDonasiPage.css';
import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { Container, Button, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import SearchIcon from "../../assets/images/search-icon.png";
import defaultImage from "../../assets/images/Pembeli/Yuki.jpeg";

import { ShowWaitingRequestById, SearchRequest, DeleteRequest } from "../../api/apiOrganisasi";

import { getThumbnail } from "../../api/index";

import ModalCreateRequestDonasi from "../../Components/Modal/ModalOrganisasi/ModalCreateRequestDonasi";
import ModalEditRequestDonasi from '../../Components/Modal/ModalOrganisasi/ModalEditRequestDonasi';
const RequestDonasiPage = () => {
    const [requestDonasi, setRequestDonasi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedRequestDonasi, setSelectedRequestDonasi] = useState(null);

    const fetchWaitingReqDonasi = async () => {
        setLoading(true);
        try {
            const response = await ShowWaitingRequestById();
            setRequestDonasi(response.data);
        } catch (error) {
            console.error("Error fetching organisasi req:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim().length >= 3) {
                setLoading(true);
                SearchRequest(searchQuery.trim())
                    .then((data) => {
                        const hasil = Array.isArray(data) ? data : [data];
                        setRequestDonasi(hasil);
                        console.log("Hasil pencarian:", hasil);
                    })
                    .catch((error) => {
                        console.error("Error searching req:", error);
                        setRequestDonasi([]);
                    })
                    .finally(() => setLoading(false));
            } else {
                fetchWaitingReqDonasi();
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);


    const handleCreate = () => {
        setShowModalCreate(true);
    };

    const handleCreateClose = () => {
        setShowModalCreate(false);
    };

    const handleCreateSuccess = () => {
        fetchWaitingReqDonasi();
        toast.success("Request Donasi berhasil dibuat!");
    };

    const handleEdit = (requestDonasi) => {
        setSelectedRequestDonasi(requestDonasi);
        setShowModalEdit(true);
    };
    
    const handleEditClose = () => {
        setShowModalEdit(false);
        setSelectedRequestDonasi(null);
    }

    const handleUpdateSuccess = () => {
        fetchWaitingReqDonasi();
        toast.success("Data request Berhasil Diperbarui.");
    };

    const handleDelete = async (id) => {
            if (window.confirm("Apakah Anda yakin ingin menghapus request ini?")) {
                try {
                    await DeleteRequest(id);
                    toast.success("Data request Berhasil Dihapus.");
                    fetchWaitingReqDonasi();
                } catch (error) {
                    toast.error("gagal.");
                    console.error("Gagal menghapus request:", error);
                }
            }
        };


    return (
        <Container className="org-wrapper">
            <div className="req-donasi-container">
                <h2><b>Request Donasi</b></h2>
                <div className="req-donasi-content-container">
                    <div style={{ display: "flex", gap: '10px', justifyContent: "space-between" }}>
                        <div className="search-bar-org">
                            <img src={SearchIcon} alt="Search Icon" className="search-icon-inside" />
                            <input
                                type="text"
                                placeholder="Masukkan Request Donasi..."
                                className="search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div style={{ padding: '3px' }}>
                            <Button style={{ padding: '12px' }} variant="primary" onClick={() => handleCreate()}>Buat Req Donasi</Button>
                        </div>
                    </div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : requestDonasi.length === 0 ? (
                        <p style={{ textAlign: "center" }}>Tidak ada request untuk saat ini.</p>
                    ) : (
                        <table className="req-donasi-table">
                            <thead>
                                <tr>
                                    <th>Detail Request</th>
                                    <th>Status Request</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requestDonasi.map((req, index) => (
                                    <tr key={index}>
                                        <td>{req.detail_request}</td>
                                        <td><h4><Badge bg="secondary">{req.status_request}</Badge></h4></td>
                                        <td className='action-buttons-req'>
                                            <Button variant="warning" onClick={() => handleEdit(req)}>Edit</Button>
                                            <Button variant="danger" onClick={() => handleDelete(req.id_request_donasi)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>


            {showModalCreate && (
                <ModalCreateRequestDonasi
                    show={showModalCreate}
                    handleClose={handleCreateClose}
                    onSuccess={handleCreateSuccess}
                />
            )}

            {selectedRequestDonasi && (
                <ModalEditRequestDonasi
                    show={showModalEdit}
                    handleClose={handleEditClose}
                    dataEdit={selectedRequestDonasi}
                    onSuccess={handleUpdateSuccess}
                />
            )}
        </Container>
    );
};

export default RequestDonasiPage;
