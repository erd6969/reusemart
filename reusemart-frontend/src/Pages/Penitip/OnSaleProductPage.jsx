import './SoldProductPage.css';
import { FaStar } from 'react-icons/fa';
import { Container } from 'react-bootstrap';
import SearchIcon from "../../assets/images/search-icon.png";

import rajangImage from "../../assets/images/Pembeli/Yuki.jpeg";
import kucingImage from "../../assets/images/BurniceKicil.jpg";

const DonatedProductPage = () => {
  return (
    <div className="histori-penitipan-wrapper">
        <div className="sold-products-container">
            <h2><b>Produk Sedang Dijual</b></h2>
            <div className="sold-products-content-container">
                <div className="search-bar">
                    <img src={SearchIcon} alt="Search Icon" className="search-icon-inside" />
                    <input
                        type="text"
                        placeholder="Masukkan Nama Produk..."
                        className="search-input"
                    />
                </div>

                <table className="sold-products-table">
                    <thead>
                        <tr>
                            <th>Info Product</th>
                            <th>Price</th>
                            <th>Sold Date</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="product-info">
                                <img src={rajangImage} alt="Rajang Bekas" />
                                <b>Rajang Bekas</b>
                            </td>
                            <td>Rp100.000</td>
                            <td>23/10/2025</td>
                            <td>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <FaStar key={i} color={i === 1 ? "#e5e7eb" : "#facc15"} />
                                ))}
                            </td>
                        </tr>
                        <tr>
                            <td className="product-info">
                                <img src={kucingImage} alt="Kucing Bekas" />
                                <b>Kucing Bekas</b>
                            </td>
                            <td>Rp12.000</td>
                            <td>24/10/2025</td>
                            <td>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <FaStar key={i} color={i === 5 ? "#e5e7eb" : "#facc15"} />
                                ))}
                            </td>
                        </tr>
                        <tr>
                            <td className="product-info">
                                <img src={rajangImage} alt="Rajang Bekas" />
                                <b>Rajang Bekas</b>
                            </td>
                            <td>Rp100.000</td>
                            <td>23/10/2025</td>
                            <td>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <FaStar key={i} color={i === 1 ? "#e5e7eb" : "#facc15"} />
                                ))}
                            </td>
                        </tr>
                        <tr>
                            <td className="product-info">
                                <img src={kucingImage} alt="Kucing Bekas" />
                                <b>Kucing Bekas</b>
                            </td>
                            <td>Rp12.000</td>
                            <td>24/10/2025</td>
                            <td>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <FaStar key={i} color={i === 5 ? "#e5e7eb" : "#facc15"} />
                                ))}
                            </td>
                        </tr>
                        <tr>
                            <td className="product-info">
                                <img src={kucingImage} alt="Kucing Bekas" />
                                <b>Kucing Bekas</b>
                            </td>
                            <td>Rp12.000</td>
                            <td>24/10/2025</td>
                            <td>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <FaStar key={i} color={i === 5 ? "#e5e7eb" : "#facc15"} />
                                ))}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default DonatedProductPage;
