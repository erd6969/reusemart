import './PembeliSide.css';
import profileImage from "../../assets/images/Pembeli/Yuki.jpeg";
import { FaMedal } from "react-icons/fa";
import { GiMoneyStack, GiReceiveMoney } from "react-icons/gi";
import { GetProfile} from "../../api/apiPembeli";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { getThumbnailPembeli } from "../../api/index";

const PembeliSide = () => {
    const [pembeli, setPembeli] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
    const fetchData = async () => {
        try {
        const data = await GetProfile();
        setPembeli(data);
        } catch (error) {
        console.error("Gagal mengambil data pembeli:", error);
        }
    };

    fetchData();
    }, []);

    if (!pembeli) return <p></p>;

    return (
        <div className="pembeli-side-container">
            <div className='pembeli-profile-container'>
                <img src={getThumbnailPembeli(pembeli.foto_pembeli)} alt="Profile" />
                <div>
                    <b style={{marginRight:"5px"}}>{pembeli.nama_pembeli}</b>  
                </div>
            </div>
            <hr />
            <div className='pembeli-balance-container'>
                <div className='loyalty-points'>
                    <GiMoneyStack size={24} />
                    <div>
                        <p>Loyalty Points</p>
                        <b>{pembeli.poin_loyalitas} Points</b>
                    </div>
                </div>
            </div>
            <hr />
            <div className='pembeli-product-section'>
                <b>Product</b>
                <ul>
                    <li onClick={() => navigate('/pembeli/purchase')}>Purchase List</li>
                    {/* <li onClick={() => navigate('/pembeli/history')}>Sold Products</li>
                    <li onClick={() => navigate('/pembeli/expired')}>Expired Custody Products</li>
                    <li onClick={() => navigate('/pembeli/donated')}>Donated Products</li> */}
                </ul>
            </div>
        </div>
    );
}

export default PembeliSide;
