import { Container, Row, Col, Form, Button, FloatingLabel } from "react-bootstrap";
import gambarBarang from "../../assets/images/CinaBekas2.jpg";
import gambarToko from "../../assets/images/BurniceKicil.jpg";
import profileImage from "../../assets/images/Pembeli/Yuki.jpeg";
import csProfileImage from "../../assets/images/blank-profile-picture.jpg";
import './DetailBarangPage.css';
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

const Rating = ({jumlahBintang}) => {
    return(
        <Container className="rating-container">
            {[...Array(5)].map((_, index) => (
                <FaStar
                    key={index}
                    color={index < jumlahBintang ? "#ffc107" : "#e4e5e9"}
                    size={24}
                />
            ))}
        </Container>
    )
}

const Toko = () => {
    const navigate = useNavigate();

    return (
        <div className="toko-container">
            <div className="toko-info">
                <div className="toko-image-container">
                    <img src={gambarToko} alt="Toko" />
                </div>
                <div className="toko-detail">
                    <h3><b>Cahaya Design</b></h3>
                    <button 
                        className="buy-button" 
                        onClick={() => navigate("/pembeli/list-barang-penitip")}
                    >
                        <b>See Store</b>
                    </button>
                </div>
            </div>
            <div className="rating-toko-container">
                <div className="rating-text">
                    <h5><b>5</b> <span>from 5</span></h5>
                </div>
                <div className="rating-stars">
                    <Rating jumlahBintang={5} />
                </div>
            </div>
        </div>
    );
}

const Diskusi = () => {
    const komen = [
        {
            profil: profileImage,
            nama: "Yuki Suou",
            comment: "Panjang Dagunya Berapa Emang ?",
            tanggal: "Selasa, 12 September 2023",
        },
        {
            profil: csProfileImage,
            nama: "CS Agus",
            comment: "Lupa. Kek e 12 CM terakhir itung",
            tanggal: "Selasa, 12 September 2023",
        },
        {
            profil: profileImage,
            nama: "Yuki Suou",
            comment: "Apakah produk ini bisa membantu saya dalam banyak hal seperti menyelesaikan 100 soal permasalahan Informasi dan Struktur Data dalam bahasa Cina Kuno yang terdiri dari banyak sekali Hanzi ?",
            tanggal: "Selasa, 10 September 2023",
        },
        {
            profil: csProfileImage,
            nama: "CS Agus",
            comment: "Y.",
            tanggal: "Selasa, 10 September 2023",
        }]

    return(
        <>
            <Container className="diskusi-container">
            <Form>
                <div className="d-flex align-items-center">
                    <img 
                        src={profileImage}
                        alt="User Avatar" 
                        className="rounded-circle me-2"
                        style={{ width: 40, height: 40 }}
                    />

                    <div className="flex-grow-1">
                        <Form.Control
                            type="text"
                            className="input-diskusi"
                            placeholder="Tambah Diskusi..."
                        />
                    </div>
                </div>

                <div className="diskusi-buttons">
                    <button className="cancel-btn">Batal</button>
                    <button className="discuss-btn"><b>Tambah</b></button>
                </div>
            </Form>
            <br />
            <Row>
                {komen.map((item, index) => (
                    <Col md={12} className="mb-3" key={index}>
                        <div className="d-flex flex-row justify-content-between align-items-start p-3" 
                            style={{ borderRadius: "10px", border: "1px solid #ccc" }}>
                            <div className="d-flex align-items-start w-100">
                                <img
                                    src={item.profil}
                                    alt="User"
                                    className="rounded-circle"
                                    style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "15px" }}
                                />
                                <div className="w-100">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0"><b>{item.nama}</b></h5>
                                        <span className="text-muted" style={{ fontSize: "14px", whiteSpace: "nowrap" }}>
                                            {item.tanggal}
                                        </span>
                                    </div>
                                    <p className="mb-0 mt-1">{item.comment}</p>
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
            </Container>
        </>
    );
}

const DetailBarangPage = () => {
    return (
        <Container className="detail-barang-page-container">
            <DetailBarang />
            <hr />
            <Toko />
            <hr />
            <Diskusi />
        </Container>
    );
}

export default DetailBarangPage;