import { Container } from "react-bootstrap";
import gambarBarang from "../../assets/images/CinaBekas2.jpg";
import gambarToko from "../../assets/images/BurniceKicil.jpg";
import './DetailBarangPage.css';

const DetailBarang = () => {
    return(
        <Container className="detail-barang-container">
            <div className="item-image-container">
                <img src={gambarBarang} alt="barang" className="gambar-barang" />
            </div>
            
            <div className="isi-detail-barang-container">
                <div className="nama-barang">
                    <h1><b>CINA BEKAS 2</b></h1>
                </div>
                
                <div className="harga-barang">
                    <h1><b>Rp1.200.000</b></h1>
                </div>
                
                <div className="deskripsi-wrapper">
                    <div className="label-colon-align">
                        <div className="label">Deskripsi</div>
                        <div className="colon">:</div>
                        <div className="isi-deskripsi">
                            <p>
                                Barang berupa Cina bekas yang berkualitas tinggi. 
                                Namun, kekurangannya karena dagunya panjang sehingga dijual.
                                Tapi overall bagus dan recomended meski ini barang bekas. 
                                Senyumnya yang haha hihi akan membuat harimu indah.
                            </p>
                        </div>
                    </div>

                    <div className="label-colon-align">
                        <div className="label">Kondisi</div>
                        <div className="colon">:</div>
                        <div className="isi-kondisi">
                            <p>Stress dikit karena P3L dan Kecewa dengan KKN</p>
                        </div>
                    </div>

                    <div className="button-barang-container">
                        <button className="cart-button"><b>Tambah ke Keranjang</b></button>
                        <button className="buy-button"><b>Beli Langsung</b></button>
                    </div>
                </div>
            </div>
        </Container>
    )
}

const Toko = () => {
    return(
        <Container className="toko-container">
            <div className="toko-image-container">
                <img src={gambarToko} alt="" />
            </div>
            <div className="detail-toko-container">
                <h3><b>Cahaya Design</b></h3>
                <button className="buy-button"><b>Kunjungi Toko   </b></button>
            </div>
        </Container>
    );
}

const Diskusi = () => {
    return(
        <Container className="diskusi-container">

        </Container>
    );
}

const DetailBarangPage = () => {
    return (
        <Container className="detail-barang-page-container">
            <DetailBarang />
            <hr />
            <Toko />
            <Diskusi />
        </Container>
    );
}

export default DetailBarangPage;