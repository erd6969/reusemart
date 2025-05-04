import './AdminMasterOrganisasiPage.css';
import InputColumn from '../../Components/InputColumn';
import { Container, Button, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { SearchPegawai, ResetPassword } from '../../api/apiPegawai';
import { toast } from 'react-toastify';

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
                fetchPegawaiData();
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
                                        <td>
                                            <span>
                                                {(() => {
                                                    switch (pgw.nama_jabatan) {
                                                        case "Owner":
                                                            return `OWNR.${pgw.id_pegawai}`;
                                                        case "Admin":
                                                            return `ADM.${pgw.id_pegawai}`;
                                                        case "Pegawai Gudang":
                                                            return `PG.${pgw.id_pegawai}`;
                                                        case "Kurir":
                                                            return `KR.${pgw.id_pegawai}`;
                                                        default:
                                                            return `CS.${pgw.id_pegawai}`;
                                                    }
                                                })()}
                                            </span>
                                        </td>
                                        <td>{pgw.nama_pegawai}</td>
                                        <td>{pgw.nama_jabatan}</td>
                                        <td>{pgw.email_pegawai}</td>
                                        <td className="actionButtons">
                                            <Button
                                                variant="danger"
                                                onClick={async () => {
                                                    try {
                                                        await ResetPassword(pgw.id_pegawai);
                                                        toast.success(`Password berhasil direset ke tanggal lahir dengan format YYYY-MM-DD`);
                                                    } catch (error) {
                                                        console.error("Error resetting password:", error);
                                                        toast.error("Gagal mereset password.");
                                                    }
                                                }}
                                                style={{ width: "100%", margin: "0 auto" }}
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
