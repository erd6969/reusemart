import { Container } from "react-bootstrap";
import { FaStar } from "react-icons/fa"; 
import gambarToko from "../../assets/images/BurniceKicil.jpg";
import SearchIcon from "../../assets/images/search-icon.png";
import gambarBarang from "../../assets/images/CinaBekas2.jpg";
import './ListBarangPenitipPage.css';


const Toko = () => {
    return (
        <Container className="toko-container">
            <div className="toko-image-container-detail">
                <img src={gambarToko} alt="Toko" className="toko-image-detail"/>
            </div>
            <div className="toko-detail">
                <h3 className="toko-nama"><b>Cahaya Design</b></h3>
                <button className="total-produk-button">
                    <b>Total Produk : 20</b>
                </button>
            </div>
            <div className="rating-toko-container">
                <h5 className="rating-title"><b>Rating</b></h5>
                <div className="rating-stars">
                    <FaStar size={40} color="#FCCD2A" style={{marginTop:"40px"}}/>
                    <FaStar size={60} color="#FCCD2A" />
                    <FaStar size={40} color="#FCCD2A" style={{marginTop:"40px"}}/>
                </div>
                <p className="rating-score"><b>8,3</b></p>
            </div>
        </Container>
    );
}

const BarangCard = ({ nama, harga, gambar }) => {
    return (
        <div className="barang-card">
            <img src={gambar} alt={nama} className="barang-card-image" />
            <div className="barang-card-detail">
                <p className="barang-card-nama">{nama}</p>
                <p className="barang-card-harga"><b>{harga}</b></p>
            </div>
        </div>
    );
};

const ListBarang = () => {
    const barangList = [
        { nama: "Kalvin bekas", harga: "Rp1.000", gambar: gambarBarang },
        { nama: "Kalvin bekas", harga: "Rp1.000", gambar: gambarBarang },
        { nama: "Kalvin bekas", harga: "Rp1.000", gambar: gambarBarang },
        { nama: "Kalvin bekas", harga: "Rp1.000", gambar: gambarBarang },
        { nama: "Kalvin bekas", harga: "Rp1.000", gambar: gambarBarang },
        { nama: "Kalvin bekas", harga: "Rp1.000", gambar: gambarBarang },
        { nama: "Kalvin bekas", harga: "Rp1.000", gambar: gambarBarang },
        { nama: "Kalvin bekas", harga: "Rp1.000", gambar: gambarBarang },
        { nama: "Kalvin bekas", harga: "Rp1.000", gambar: gambarBarang },
        { nama: "Kalvin bekas", harga: "Rp1.000", gambar: gambarBarang },
        { nama: "Kalvin bekas", harga: "Rp1.000", gambar: gambarBarang },
        { nama: "Kalvin bekas", harga: "Rp1.000", gambar: gambarBarang },
        { nama: "Kalvin bekas", harga: "Rp1.000", gambar: gambarBarang },
        { nama: "Kalvin bekas", harga: "Rp1.000", gambar: gambarBarang },
        { nama: "Kalvin bekas", harga: "Rp1.000", gambar: gambarBarang },
        { nama: "Kalvin bekas", harga: "Rp1.000", gambar: gambarBarang },
        { nama: "Kalvin bekas", harga: "Rp1.000", gambar: gambarBarang },
        { nama: "Kalvin bekas", harga: "Rp1.000", gambar: gambarBarang },
    ];

    return (
        <Container className="list-barang-container">
            <div className="search-container">
                <div className="search-bar">
                    <img src={SearchIcon} alt="Search Icon" className="search-icon-inside" />
                    <input 
                        type="text" 
                        placeholder="Masukkan Nama Barang..."
                        name="searchBarang"
                        className="search-input-barang"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
            </div>
            <br />
            <h2 className="list-barang-title"><b>List Produk</b></h2>
            <div className="barang-grid">
                {barangList.map((barang, index) => (
                    <BarangCard key={index} {...barang} />
                ))}
            </div>
        </Container>
    );
}

const ListBarangPenitipPage = () => {
    return (
        <Container className="list-barang-penitip-container">
            <Toko />
            <br />
            <ListBarang />
        </Container>
    );
}

export default ListBarangPenitipPage;
