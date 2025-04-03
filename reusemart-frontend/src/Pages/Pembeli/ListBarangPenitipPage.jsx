import { Container } from "react-bootstrap";
import gambarToko from "../../assets/images/BurniceKicil.jpg";
import './ListBarangPenitipPage.css';

const Toko = () => {

    return (
        <Container className="toko-container">
            <div className="toko-info">
                <div className="toko-image-container">
                    <img src={gambarToko} alt="Toko" />
                </div>
                <div className="toko-detail">
                    <h3><b>Cahaya Design</b></h3>
                    <button 
                        className="buy-button" 
                       
                    >
                        <b>See Store</b>
                    </button>
                </div>
            </div>
            <div className="rating-toko-container">
                <div className="rating-text">
                    <h5><b>5</b> <span>from 5</span></h5>
                </div>
            </div>
        </Container>
    );
}

const ListBarangPenitipPage = () => {
    return (
        <>
            <Container className="list-barang-penitip-container">
                <Toko />
            </Container>
        </>
    );
}

export default ListBarangPenitipPage;