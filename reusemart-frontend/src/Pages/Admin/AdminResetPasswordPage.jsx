import './AdminMasterOrganisasiPage.css';
import InputColumn from '../../Components/InputColumn';
import { Container, Button, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { SearchPegawai, ResetPassword } from '../../api/apiPegawai';
import { SearchHunter, ResetPasswordHunter } from '../../api/apiHunter';
import { toast } from 'react-toastify';

const SearchComponent = ({ onSearch }) => {
    return (
        <div className="searchComponent">
            <div className="searchContainer">
                <InputColumn 
                    typeInput="text"
                    idInput="nama_pegawai"
                    placeholderInput="Masukkan Nama Pegawai..."
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </div>
    );
};

const AdminMasterResetPage = () => {
    const [pegawaiList, setPegawaiList] = useState([]);
    const [hunterList, setHunterList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Function to fetch Pegawai data
    const fetchPegawaiData = async () => {
        setIsLoading(true);
        try {
            const data = await SearchPegawai();
            setPegawaiList(data.data);
            console.log("Pegawai Data:", data);
        } catch (error) {
            console.error("Error fetching pegawai data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to fetch Hunter data
    const fetchHunterData = async () => {
        setIsLoading(true);
        try {
            const data = await SearchHunter();
            setHunterList(data.data);
            console.log("Hunter Data:", data);
        } catch (error) {
            console.error("Error fetching hunter data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim().length >= 3) {
                setIsLoading(true);
                SearchPegawai(searchQuery.trim())
                    .then((data) => {
                        const hasilPegawai = Array.isArray(data) ? data : [data];
                        setPegawaiList(hasilPegawai);
                    })
                    .catch((error) => {
                        console.error("Error searching Pegawai:", error);
                        setPegawaiList([]);
                    })
                    .finally(() => {
                        SearchHunter(searchQuery.trim())
                            .then((data) => {
                                const hasilHunter = Array.isArray(data) ? data : [data];
                                setHunterList(hasilHunter);
                            })
                            .catch((error) => {
                                console.error("Error searching Hunter:", error);
                                setHunterList([]);
                            })
                            .finally(() => {
                                setIsLoading(false);
                            });
                    });
            } else {
                fetchPegawaiData();
                fetchHunterData();
            }
        }, 500);
    
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);
    

    return (
        <Container>
            <div className="adminMasterOrganisasiPage">
                <h1 className="pageTitle">Master Pegawai dan Hunter</h1>
                <SearchComponent onSearch={setSearchQuery} />
                <div className="tableContainer">
                    <table className="dataTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nama</th>
                                <th>Jabatan/Posisi</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        <Spinner animation="border" variant="primary" />
                                        <div>Loading...</div>
                                    </td>
                                </tr>
                            ) : (pegawaiList.length > 0 || hunterList.length > 0) ? (
                                [...pegawaiList, ...hunterList].map((item) => (
                                    <tr key={item.id_pegawai || item.id_hunter}>
                                        <td>
                                            <span>
                                                {item.nama_jabatan ? `PEG.${item.id_pegawai}` : `HT.${item.id_hunter}`}
                                            </span>
                                        </td>
                                        <td>{item.nama_pegawai || item.nama_hunter}</td>
                                        <td>{item.nama_jabatan || "Hunter"}</td>
                                        <td>{item.email_pegawai || item.email_hunter}</td>
                                        <td className="actionButtons">
                                        <Button
                                            variant="danger"
                                            onClick={async () => {
                                                try {
                                                    if (item.nama_jabatan) {
                                                        // Pegawai
                                                        await ResetPassword(item.id_pegawai);
                                                    } else {
                                                        // Hunter
                                                        await ResetPasswordHunter(item.id_hunter);
                                                    }
                                                    toast.success(`Password berhasil direset`);
                                                } catch (error) {
                                                    console.error("Error resetting password:", error);
                                                    toast.error("Gagal mereset password.");
                                                }
                                            }}
                                            style={{ width: "100%", margin: "0 auto", maxWidth: "150px" }}
                                        >
                                            Reset Password
                                        </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        Tidak ada data ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Container>
    );
};

export default AdminMasterResetPage;
