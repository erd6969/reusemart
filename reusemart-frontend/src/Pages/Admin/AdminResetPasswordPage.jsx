import './AdminMasterOrganisasiPage.css';
import InputColumn from '../../Components/InputColumn';
import { Container, Button, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { SearchPegawai } from '../../api/apiPegawai';

const SearchComponent = ({ onSearch }) => {
    return (
        <div className="searchComponent">
            <div className="searchContainer">
                <InputColumn 
                    typeInput="text"
                    idInput="nama_organisasi"
                    placeholderInput="Masukkan Nama Organisasi..."
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </div>
    );
};

const AdminMasterResetPage = () => {
    const [pegawaiList, setPegawaiList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchPegawaiData = async () => {
        setIsLoading(true);
        try {
            const data = await SearchPegawai();
            setPegawaiList(data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
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
                        const hasil = Array.isArray(data) ? data : [data];
                        setPegawaiList(hasil);
                    })
                    .catch((error) => {
                        console.error("Error searching address:", error);
                        setPegawaiList([]);
                    })
                    .finally(() => setIsLoading(false));
            } else {
                fetchPegawaiData(); // Use the original data fetch if the query is short
            }
        }, 500);
    
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);
    

    return (
        <Container>
            <div className="adminMasterOrganisasiPage">
                <h1 className="pageTitle">Master Pegawai</h1>
                <SearchComponent onSearch={setSearchQuery} />
                <div className="tableContainer">
                    <table className="dataTable">
                        <thead>
                            <tr>
                                <th>ID Pegawai</th>
                                <th>Nama Pegawai</th>
                                <th>Jabatan</th>
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
                            ) : pegawaiList.length > 0 ? (
                                pegawaiList.map((pgw) => (
                                    <tr key={pgw.id_pegawai}>
                                        <td>{pgw.id_pegawai}</td>
                                        <td>{pgw.nama_pegawai}</td>
                                        <td>{pgw.nama_jabatan}</td>
                                        <td>{pgw.email_pegawai}</td>
                                        <td className="actionButtons">
                                            <Button
                                                variant="primary"
                                                onClick={async () => {
                                                    try {
                                                        await ResetPassword(pgw.id_pegawai);
                                                        alert("Password berhasil direset!");
                                                    } catch (error) {
                                                        console.error("Error resetting password:", error);
                                                        alert("Gagal mereset password.");
                                                    }
                                                }}
                                            >
                                                Reset Password
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        Tidak ada data pegawai yang ditemukan.
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
