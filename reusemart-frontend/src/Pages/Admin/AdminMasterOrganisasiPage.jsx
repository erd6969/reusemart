import './AdminMasterOrganisasiPage.css';
import InputColumn from '../../Components/InputColumn';
import { Container, Button, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { ShowAllOrganisasi, SearchOrganisasi } from '../../api/apiOrganisasi';

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

const AdminMasterOrganisasiPage = () => {
    const [organisasiList, setOrganisasiList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchOrganisasiData = async () => {
        setIsLoading(true);
        try {
            const response = await ShowAllOrganisasi();
            setOrganisasiList(response.data);
        } catch (error) {
            console.error("Error fetching organisasi data:", error);
            setOrganisasiList([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim().length >= 3) {
                setIsLoading(true);
                SearchOrganisasi(searchQuery.trim())
                    .then((response) => {
                        const hasil = Array.isArray(response.data) ? response.data : [response.data];
                        setOrganisasiList(hasil);
                    })
                    .catch((error) => {
                        console.error("Error searching organisasi:", error);
                        setOrganisasiList([]);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            } else {
                fetchOrganisasiData();
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    useEffect(() => {
        fetchOrganisasiData();
    }, []);

    return (
        <Container>
            <div className="adminMasterOrganisasiPage">
                <h1 className="pageTitle">Master Organisasi</h1>
                <SearchComponent onSearch={setSearchQuery} />
                <div className="tableContainer">
                    <table className="dataTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nama Organisasi</th>
                                <th>Alamat</th>
                                <th>Telepon</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            variant="primary"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <div>Loading...</div>
                                    </td>
                                </tr>
                            ) : organisasiList.length > 0 ? (
                                organisasiList.map((org, index) => (
                                    <tr key={index}>
                                        <td>ORG.{org.id_organisasi}</td>
                                        <td>{org.nama_organisasi}</td>
                                        <td>{org.alamat_organisasi}</td>
                                        <td>{org.nomor_telepon_organisasi}</td>
                                        <td>{org.email_organisasi}</td>
                                        <td>
                                            <Button variant="warning" className="me-2">Edit</Button>
                                            <Button variant="danger">Delete</Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        Tidak ada data organisasi yang ditemukan.
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

export default AdminMasterOrganisasiPage;
