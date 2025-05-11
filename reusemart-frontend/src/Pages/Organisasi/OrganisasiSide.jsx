import './OrganisasiSide.css';
// import profileImage from "../../assets/images/Organisasi/Yuki.jpeg";
import { FaMedal } from "react-icons/fa";
import { GiMoneyStack, GiReceiveMoney } from "react-icons/gi";
import { GetProfile} from "../../api/apiOrganisasi";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { getThumbnailOrganisasi } from "../../api/index";

const OrganisasiSide = () => {
    const [organisasi, setOrganisasi] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
    const fetchData = async () => {
        try {
        const data = await GetProfile();
        setOrganisasi(data);
        } catch (error) {
        console.error("Gagal mengambil data Organisasi:", error);
        }
    };

    fetchData();
    }, []);

    if (!organisasi) return <p></p>;

    return (
        <div className="organisasi-side-container">
            <div className='organisasi-profile-container'>
                <img src={getThumbnailOrganisasi(organisasi.foto_organisasi)} alt="Profile" />
                <div>
                    <b style={{marginRight:"5px"}}>{organisasi.nama_organisasi}</b>  
                </div>
            </div>
            <hr />
            <div className='organisasi-product-section'>
                <b>Donasi</b>
                <ul>
                    <li onClick={() => navigate('/organisasi/request-donasi')}>Request Donasi</li>
                    <li onClick={() => navigate('/Organisasi/history-donasi')}>History Request Donasi</li>
                </ul>
            </div>
        </div>
    );
}

export default OrganisasiSide;
