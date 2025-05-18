import './PenitipSide.css';
import profileImage from "../../assets/images/Pembeli/Yuki.jpeg";
import { FaMedal } from "react-icons/fa";
import { GiMoneyStack, GiReceiveMoney } from "react-icons/gi";
import { ShowProfilePenitip } from "../../api/apiPenitip";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { getThumbnailPenitip } from "../../api/index";

const PenitipSide = () => {
    const [penitip, setPenitip] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
    const fetchData = async () => {
        try {
        const data = await ShowProfilePenitip();
        setPenitip(data);
        } catch (error) {
        console.error("Gagal mengambil data penitip:", error);
        }
    };

    fetchData();
    }, []);

    if (!penitip) return <p></p>;

    return (
        <div className="penitip-side-container">
            <div className='penitip-profile-container'>
                <img src={getThumbnailPenitip(penitip.foto_penitip)} alt="Profile" />
                <div>
                    <b style={{marginRight:"5px"}}>{penitip.nama_penitip}</b>  
                    {penitip.badge === 1 && <FaMedal color="#facc15" />}
                </div>
            </div>
            <hr />
            <div className='penitip-balance-container'>
                <div className='loyalty-points'>
                    <GiMoneyStack size={24} />
                    <div>
                        <p>Loyalty Points</p>
                        <b>{penitip.poin_loyalitas} Points</b>
                    </div>
                </div>
                <div className='balance'>
                    <GiReceiveMoney size={24} />
                    <div>
                        <p>Balance</p>
                        <b>Rp{penitip.saldo?.toLocaleString('id-ID')}</b>
                    </div>
                </div>
            </div>
            <hr />
            <div className='penitip-product-section'>
                <b>Product</b>
                <ul>
                    <li onClick={() => navigate('/penitip/on-sale')}>Barang yang sedang dijual</li>
                    <li onClick={() => navigate('/penitip/sold-product')}>Barang yang terjual</li>
                    <li onClick={() => navigate('/penitip/extend')}>Perpanjangan Barang</li>
                    <li onClick={() => navigate('/penitip/donated')}>Donasi Barang</li>
                </ul>
            </div>
        </div>
    );
}

export default PenitipSide;
