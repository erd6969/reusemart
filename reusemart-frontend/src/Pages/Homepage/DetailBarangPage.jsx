import { Container, Row, Col, Form, Button, FloatingLabel, Spinner } from "react-bootstrap";
import profileImage from "../../assets/images/blank-pembeli-profile-picture.png";
import badgeTopSeller from "../../assets/images/badgeTop.png";
import "./DetailBarangPage.css";
import { FaStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetDetailBarang } from "../../api/apiBarang";
import CarouselDetail from "../../Components/Carousel/CarouselDetail";

import { AddToCart } from "../../api/apiKeranjang";
import { ShowDiskusi, CreateDiskusi } from "../../api/apiDiskusi";
import { GetProfile } from "../../api/apiPembeli";
import { useCart } from "../../Components/Context/CartContext";
import { toast } from "react-toastify";

import { getThumbnailPembeli, getThumbnailPegawai, getThumbnailPenitip } from "../../api";

const DetailBarang = ({ detailBarang, gambar, penitip }) => {
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();
    const { refreshCartCount } = useCart() || {};
    const today = new Date();
    const formatted = today.toISOString().split('T')[0];

    const gambarBarang = [
        detailBarang.foto_barang,
        detailBarang.foto_barang2,
        detailBarang.foto_barang3 ?? null
    ];

    const handleAddToCart = async () => {
        try {
            await AddToCart(detailBarang.id_barang);
            toast.success("Barang berhasil ditambahkan ke keranjang!");
            refreshCartCount();
        } catch (error) {
            console.error("Gagal tambah ke keranjang:", error);
            toast.error("Barang sudah ada di keranjang!");
        }
    };

    return (
        <Container className="detail-barang-container">
            <div className="item-image-container-barang">
                <CarouselDetail gambar={gambarBarang} />
            </div>

            <div className="isi-detail-barang-container">
                <div className="nama-barang">
                    <h1><b>{detailBarang.nama_barang}</b></h1>
                </div>

                <div className="harga-barang">
                    <h1><b>Rp {Number(detailBarang.harga_barang).toLocaleString("id-ID")}</b></h1>
                </div>

                <div className="deskripsi-wrapper">
                    <div className="label-colon-align">
                        <div className="label">Deskripsi</div>
                        <div className="colon">:</div>
                        <div className="isi-deskripsi">
                            <p>{detailBarang.deskripsi_barang}</p>
                        </div>
                    </div>

                    <div className="label-colon-align">
                        <div className="label">Kondisi</div>
                        <div className="colon">:</div>
                        <div className="isi-kondisi">
                            <p>{detailBarang.kondisi_barang}</p>
                        </div>
                    </div>

                    <div className="label-colon-align">
                        <div className="label">Garansi</div>
                        <div className="colon">:</div>
                        <div className="isi-kondisi">
                            <p>{detailBarang.tanggal_garansi ? (formatted > detailBarang.tanggal_garansi ? 'Tanggal Garansi Sudah Lewat yaitu ' + detailBarang.tanggal_garansi : detailBarang.tanggal_garansi) : 'Tidak Punya Garansi'}</p>
                        </div>
                    </div>

                    <div className="button-barang-container">
                        <button className="cart-button" onClick={() => {
                            if (token) {
                                handleAddToCart();
                            } else {
                                navigate("/auth/login");
                            }
                        }}>
                            <b>Tambah ke Keranjang</b>
                        </button>
                        <button
                            className="buy-button"
                            onClick={() => {
                                console.log("penitip saat klik beli langsung:", penitip);
                                if (token) {
                                    navigate("/pembeli/checkout", {
                                        state: { directBuyItem: detailBarang, directBuyItemPenitip: penitip }
                                    });
                                } else {
                                    navigate("/auth/login");
                                }
                            }}
                        >
                            <b>Beli Langsung</b>
                        </button>
                    </div>
                </div>
            </div>
        </Container>
    );
};

const Rating = ({ jumlahBintang }) => (
    <Container className="rating-container">
        {[...Array(5)].map((_, index) => (
            <FaStar
                key={index}
                color={index < jumlahBintang ? "#ffc107" : "#e4e5e9"}
                size={24}
            />
        ))}
    </Container>
);

const Toko = ({ penitip }) => {
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    return (
        <div className="toko-container">
            <div className="toko-info">
                <div className="toko-image-container">
                    <img src={getThumbnailPenitip(penitip.foto_penitip)} alt="Toko" />
                </div>
                <h3>
                    {penitip.badge ? 
                    <img src={badgeTopSeller} alt="Badge" className="badge-image" style={{height: 100}} /> : null}
                </h3>
                <div className="toko-detail">
                    <h3><b>{penitip.nama_penitip}</b></h3>
                    {/* <button
                        className="buy-button"
                        onClick={() => {
                            if (token) {
                                navigate("/pembeli/list-barang-penitip");
                            } else {
                                navigate("/list-barang-penitip");
                            }
                        }}
                    >
                        <b>See Store</b>
                    </button> */}
                </div>
            </div>
            <div className="rating-toko-container">
                <div className="rating-text">
                    <h5><b>{penitip.rerata_rating}</b> <span>from 5</span></h5>
                </div>
                <div className="rating-stars">
                    <Rating jumlahBintang={penitip.rerata_rating} />
                </div>
            </div>
        </div>
    );
};

const Diskusi = () => {
    const [diskusi, setDiskusi] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCommenting, setIsCommenting] = useState(false);
    const [profile, setProfile] = useState({});
    const id = useParams().id_barang;
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    const fetchDiskusi = async () => {
        setLoading(true);
        try {
            const response = await ShowDiskusi(id);
            if (response.status === "success" && Array.isArray(response.data)) {
                setDiskusi(response.data);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching diskusi:", error);
            setError("Failed to load diskusi.");
            setLoading(false);
        }
    };

    useEffect(() => {
        const showProfile = async () => {
        try {
            const data = await GetProfile();
            setProfile(data);
        } catch (error) {
            console.error("Error fetching profile", error);
        }
        }

        showProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        if (!token) {
            navigate("/auth/login");
            return;
        }

        try {
            setIsCommenting(true);
            await CreateDiskusi({ id_barang: id, diskusi: newComment });
            setNewComment("");
            fetchDiskusi();
        } catch (error) {
            console.error("Error adding diskusi:", error);
            setError("Failed to add comment.");
        } finally {
            setIsCommenting(false);
        }
    };


    useEffect(() => {
        fetchDiskusi();
    }, [id]);

    return (
        <Container className="diskusi-container">
            <Form onSubmit={handleSubmit}>
                <div className="d-flex align-items-center">
                    <img
                        src={
                            profile.foto_pembeli
                            ? getThumbnailPembeli(profile.foto_pembeli)
                            : profileImage
                        }
                        alt="User Avatar"
                        className="rounded-circle me-2"
                        style={{ width: 40, height: 40 }}
                    />
                    <div className="flex-grow-1">
                        <Form.Control
                            type="text"
                            className="input-diskusi"
                            placeholder="Tambah Diskusi..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                    </div>
                </div>

                <div className="diskusi-buttons">
                    <button type="button" className="cancel-btn" onClick={() => setNewComment("")}>
                        Batal
                    </button>
                    <button type="submit" className="discuss-btn" disabled={isCommenting}>
                        <b>{isCommenting ? "Memproses..." : "Tambah"}</b>
                    </button>
                </div>
                <br />
            </Form>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            <Row>
                {diskusi.length > 0 ? (
                    diskusi.map((disc, index) => (
                        <Col md={12} className="mb-3" key={index}>
                            <div
                                className="d-flex flex-row justify-content-between align-items-start p-3 diskusi-item"
                                style={{ borderRadius: "10px", border: "1px solid #ccc" }}
                            >
                                <div className="d-flex align-items-start w-100">
                                    <img
                                        src={
                                            disc.id_pembeli
                                                ? getThumbnailPembeli(disc.pembeli.foto_pembeli)
                                                : getThumbnailPegawai(disc.pegawai.foto_pegawai)
                                            }
                                        alt="User"
                                        className="rounded-circle"
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            objectFit: "cover",
                                            marginRight: "15px"
                                        }}
                                    />
                                    <div className="w-100">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0">
                                                <b>
                                                    {disc.id_pembeli
                                                        ? disc.pembeli?.nama_pembeli
                                                        : disc.pegawai?.nama_pegawai}
                                                </b>
                                                {disc.id_pegawai && (
                                                    <span
                                                        className="badge ms-2"
                                                        style={{
                                                            backgroundColor: "#b6f7c1",
                                                            color: "#155724",
                                                            fontSize: "12px",
                                                            padding: "5px 8px"
                                                        }}
                                                    >
                                                        Customer Service
                                                    </span>
                                                )}
                                            </h5>
                                            <span
                                                className="text-muted"
                                                style={{ fontSize: "14px", whiteSpace: "nowrap" }}
                                            >
                                                {disc.waktu_diskusi}
                                            </span>
                                        </div>
                                        <p className="mb-0 mt-1">{disc.diskusi}</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    ))
                ) : (
                    <Col md={12} className="mb-3 d-flex justify-content-center align-items-center">
                        <p>Tidak Ada Diskusi Untuk Produk Ini</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

const DetailBarangPage = () => {
    const [detailBarang, setDetailBarang] = useState([]);
    const [thumbnailGambar, setThumbnailGambar] = useState([]);
    const id = useParams().id_barang;
    const [penitip, setPenitip] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBarangAndPenitip = async () => {
        try {
            const detailBarang = await GetDetailBarang(id);
            setDetailBarang(detailBarang.barang);
            console.log("Detail Barang:", detailBarang);
            setPenitip(detailBarang.penitip);
            const thumbnails = [
                detailBarang.barang.foto_barang1,
                detailBarang.barang.foto_barang2,
                detailBarang.barang.foto_barang3
            ];
            setThumbnailGambar(thumbnails);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching Detail Barang:", error);
        }
    };

    useEffect(() => {
        fetchBarangAndPenitip();
    }, []);

    return (
        <Container className="detail-barang-page-container">
            {isLoading ? (
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        padding: "20px"
                    }}
                >
                    <div style={{ textAlign: "center" }}>
                        <Spinner
                            as="span"
                            animation="border"
                            variant="primary"
                            size="lg"
                            role="status"
                            aria-hidden="true"
                        />
                        <h6 className="mt-2 mb-0">Loading...</h6>
                    </div>
                </div>
            ) : (
                <div>
                    <DetailBarang detailBarang={detailBarang} gambar={thumbnailGambar} penitip={penitip} />
                    <hr />
                    <Toko penitip={penitip} />
                    <hr />
                    <Diskusi />
                </div>
            )}
        </Container>
    );
};

export default DetailBarangPage;
