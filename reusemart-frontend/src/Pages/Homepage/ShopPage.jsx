
import { Nav, Card, Badge, Spinner } from 'react-bootstrap';
import { useState } from 'react';
import {
    FaMobile, FaTshirt, FaChair, FaBook, FaGamepad,
    FaBaby, FaCar, FaTree, FaBriefcase, FaSmile,
    FaChevronDown, FaChevronRight, FaSearch, FaBoxOpen
} from 'react-icons/fa';
import { data, useNavigate } from "react-router-dom";
import image3 from "../../assets/images/Search.png";
import "./ShopPage.css";

import { GetAllBarang, GetAllBarangByCategory, SearchBarang } from "../../api/apiBarang";
import { useEffect } from 'react';

import { getThumbnailBarang } from '../../api';

const kategori = [
    {
        icon: FaMobile,
        name: "Elektronik & Gadget",
        subcategories: [
            "Smartphone & Tablet",
            "Laptop & Komputer",
            "Kamera & Aksesori",
            "Peralatan Audio atau Video",
            "Konsol Game & Aksesorinya",
            "Printer & Scanner",
            "Peralatan Dapur Elektronik"
        ]
    },
    {
        icon: FaTshirt,
        name: "Pakaian & Aksesori",
        subcategories: [
            "Pakaian Pria, Wanita, dan Anak",
            "Jaket, Sweater, dan Outerwear",
            "Sepatu, Sandal, dan Boots",
            "Tas, Dompet, dan Ransel",
            "Perhiasan & Aksesori",
            "Topi, Syal, dan Aksesori lainnya"
        ]
    },
    {
        icon: FaChair,
        name: "Perabotan Rumah Tangga",
        subcategories: [
            "Sofa, Meja, Kursi",
            "Lemari, Rak Buku, dan Meja TV",
            "Tempat Tidur & Kasur",
            "Peralatan Masak",
            "Dekorasi Rumah",
            "Alat Kebersihan"
        ]
    },
    {
        icon: FaBook,
        name: "Buku, Alat Tulis, & Peralatan Sekolah",
        subcategories: [
            "Buku Pelajaran & Buku Bacaan",
            "Buku Koleksi",
            "Alat Tulis",
            "Tas Sekolah & Peralatan Laboratorium",
            "Kalkulator & Alat Ukur"
        ]
    },
    {
        icon: FaGamepad,
        name: "Hobi, Mainan, & Koleksi",
        subcategories: [
            "Mainan Anak",
            "Alat Musik",
            "Perlengkapan Olahraga",
            "Barang Koleksi",
            "Buku Komik, CD Musik, DVD Film",
            "Peralatan Memancing atau Camping"
        ]
    },
    {
        icon: FaBaby,
        name: "Perlengkapan Bayi & Anak",
        subcategories: [
            "Pakaian Bayi & Anak",
            "Perlengkapan Makan Bayi",
            "Mainan Edukasi",
            "Stroller, Car Seat, & Baby Carrier",
            "Tempat Tidur & Perlengkapan Bayi"
        ]
    },
    {
        icon: FaCar,
        name: "Otomotif & Aksesori",
        subcategories: [
            "Sepeda Motor & Sepeda Bekas",
            "Suku Cadang & Aksesori Mobil atau Motor",
            "Helm, Jaket Riding, dan Sarung Tangan",
            "Ban, Velg, dan Aksesori Kendaraan",
            "Peralatan Perawatan Kendaraan"
        ]
    },
    {
        icon: FaTree,
        name: "Perlengkapan Taman & Outdoor",
        subcategories: [
            "Peralatan Berkebun",
            "Meja & Kursi Taman",
            "Alat BBQ & Outdoor Cooking",
            "Tenda, Sleeping Bag, & Peralatan Camping"
        ]
    },
    {
        icon: FaBriefcase,
        name: "Peralatan Kantor & Industri",
        subcategories: [
            "Meja & Kursi Kantor",
            "Lemari Arsip",
            "Mesin Fotokopi, Printer, dan Scanner",
            "Alat-alat Teknik & Perkakas",
            "Rak Gudang & Peralatan Penyimpanan"
        ]
    },
    {
        icon: FaSmile,
        name: "Kosmetik & Perawatan Diri",
        subcategories: [
            "Alat Kecantikan",
            "Parfum & Produk Perawatan",
            "Aksesori Kecantikan"
        ]
    }
];

const ItemList = ({ barang }) => {
    const navigate = useNavigate();
    const { nama_barang, harga_barang, foto_barang } = barang;

    return (
        <div
            className="item-container"
            style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                width: "280px",
                height: "360px",
                boxShadow: "0px 2px 5px 5px rgb(16, 78, 13)",
            }}
            onClick={() => {
                const token = sessionStorage.getItem("token");
                if (token) {
                    navigate(`/pembeli/detailBarang/${barang.id_barang}`);
                } else {
                    navigate(`/detailBarang/${barang.id_barang}`);
                }
            }}
        >
            <div
                className="item-image-container"
                style={{ display: "flex", justifyContent: "center" }}
            >

                <div
                    className="inside-item-container"
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "10px",
                        marginTop: "10px",
                        boxShadow: "2px 2px 2px 2px rgba(22, 40, 21, 0.33)",
                        width: "260px",
                        height: "250px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >

                    <img
                        src={getThumbnailBarang(foto_barang)}
                        alt="item"
                        style={{
                            width: "180px",
                            height: "190px",
                            borderRadius: "10px",
                        }}
                    />
                </div>
            </div>
            <div
                className="item-description"
                style={{
                    display: "flex",
                    paddingLeft: "20px",
                    flexDirection: "column",
                    alignItems: "flex-start",
                }}
            >
                <div
                    style={{
                        textAlign: "start",
                        paddingTop: "20px",
                        fontWeight: "lighter",
                        fontSize: "18px",
                        fontFamily: "monospace",
                        marginBottom: "0px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        width: "200px",
                        textOverflow: "ellipsis",
                    }}
                >
                    {nama_barang}
                </div>
                <div
                    style={{
                        fontWeight: "bolder",
                        fontSize: "26px",
                        fontFamily: "monospace",
                        marginBottom: "0px",
                    }}
                >
                    Rp {Number(harga_barang).toLocaleString("id-ID")}

                </div>
            </div>
        </div>
    );
}

function CategorySection({ categoryNameSelect }) {
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeSubcategory, setActiveSubcategory] = useState(null);

    const handleCategorySelect = (category, subIndex) => {
        if (activeSubcategory === subIndex) {
            setActiveSubcategory(null);
            categoryNameSelect(null);
        } else {
            categoryNameSelect(category);
            setActiveSubcategory(subIndex);
        }
    };

    const toggleCategory = (index) => {
        if (activeCategory !== index) {
            setActiveSubcategory(null);
        } else {
            setActiveSubcategory(null);
            categoryNameSelect(null);
        }
        setActiveCategory(activeCategory === index ? null : index);
    }

    return (
        <div
            className="category-container"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "20px",
                marginLeft: "20px",
                boxShadow: "0px 0px 5px 6px rgba(12, 77, 17, 0.99)",
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                overflowY: "auto",
                height: "100vh",
                width: "300px",
                overflowX: "hidden",
                position: "sticky",
                top: 0,
            }}
        >

            <Badge style={{ marginBottom: "20px", width: "300px" }} bg="success">
                <h2>Categories</h2>
            </Badge>
            <div
                className="category-list"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    width: "100%",
                }}
            >
                {kategori.map((kat, index) => (
                    <div key={index} style={{ marginBottom: "20px" }}>
                        <div
                            onClick={() => toggleCategory(index)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "10px",
                                cursor: "pointer",
                                backgroundColor: activeCategory === index ? "#316910" : "#FFFFFF",
                                color: activeCategory === index ? "#FFFFFF" : "#000000",
                                borderRadius: "5px",
                                transition: "background-color 0.3s",
                            }}
                        >
                            <kat.icon style={{ fontSize: "25px", marginRight: "20px" }} />
                            <span style={{ flex: 1, fontWeight: "bold" }}> {kat.name} </span>
                            {activeCategory === index ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
                        </div>


                        {activeCategory === index && (
                            <div
                                style={{ paddingLeft: "20px", marginTop: "5px" }}
                            >
                                {kat.subcategories.map((subkategori, subIndex) => (
                                    <div
                                        key={subIndex}
                                        onClick={() => handleCategorySelect(subkategori, subIndex)}
                                        style={{
                                            padding: "8px 10px",
                                            cursor: "pointer",
                                            borderRadius: "5px",
                                            backgroundColor: activeSubcategory === subIndex ? "#316910" : "#FFFFFF",
                                            color: activeSubcategory === subIndex ? "#FFFFFF" : "#000000",
                                        }}
                                    >
                                        {subkategori}

                                    </div>
                                ))}

                            </div>
                        )}
                    </div>

                ))}
            </div>
        </div>
    );
}

const ShopPage = () => {

    const [barang, setBarang] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const fetchBarang = async () => {
        try {
            // setIsLoading(true);
            const data = await GetAllBarang();
            setBarang(data);
        } catch (error) {
            console.error("Error fetching barang:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const fetchBarangByCategory = async (kategori) => {
        if (!kategori) {
            fetchBarang();
            return;
        }

        try {
            const data = await GetAllBarangByCategory(kategori);
            console.log("Data barang by category:", data);
            setBarang(data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching barang by category:", error);
            setIsLoading(true);
        }
    }

    const refreshPage = () => {
        fetchBarang();
        setSearchQuery("");
    };

    useEffect(() => {
        fetchBarang();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.length >= 3) {
                setIsLoading(true);
                SearchBarang(searchQuery)
                    .then((data) => {
                        const hasil = Array.isArray(data) ? data : [data];
                        setBarang(hasil);
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        console.error("Error searching address:", error);
                        setBarang([]);
                        setIsLoading(false);
                    });
            } else {
                fetchBarang();
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    return (
        <div className="main-container">

            <div className="item-section"
                style={{
                    display: "flex",
                    overflowY: barang.length > 0 ? "auto" : "hidden",
                    height: "100vh",
                    justifyContent: "center"
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", overflowX: "hidden", overflowY: barang.length > 0 ? "auto" : "hidden", }}>
                    <div
                        className="search-container"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "20px",
                            marginBottom: "20px",
                        }}
                    >
                        <Card className="bg-dark text-white" >
                            <Card.Img src={image3} alt="Card image" style={{
                                height: "250px",
                                width: "100%",
                                objectFit: "cover"
                            }} />
                            <Card.ImgOverlay
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-end",
                                    alignItems: "start",
                                    paddingBottom: "10px",
                                    paddingLeft: "30px",
                                }}
                            >
                                <Card.Title></Card.Title>
                                <Card.Text>

                                </Card.Text>
                                <div className="search-container"
                                    style={{
                                        marginTop: "20px",
                                        marginBottom: "20px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "white",
                                        padding: "5px 15px",
                                        borderRadius: "30px",
                                        width: "300px",
                                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                                    }}>
                                    <FaSearch style={{ color: "#777", marginRight: "10px" }} />
                                    <input
                                        type="text"
                                        placeholder="Search for an item"
                                        style={{
                                            width: "100%",
                                            height: "20px",
                                            border: "none",
                                            outline: "none",
                                            fontSize: "16px",
                                            backgroundColor: "transparent",
                                        }}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </Card.ImgOverlay>

                        </Card>
                    </div>
                    {isLoading ? (
                        <div
                            style={{
                                flex: 1,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                padding: "20px",
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
                        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>


                            {/* tampilan barang  */}

                            {barang.length > 0 ? (
                                <>
                                    <CategorySection categoryNameSelect={fetchBarangByCategory} />
                                    <div
                                        className="item-list"
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(4, 1fr)",
                                            gap: "20px",
                                            justifyContent: "center",
                                            marginTop: "20px",
                                            paddingLeft: "20px",
                                            marginBottom: "0px",
                                            height: "100%",
                                            width: "100%",
                                        }}
                                    >
                                        {barang.map((brg, index) => (
                                            <ItemList key={index} barang={brg} />
                                        ))}
                                        {/* pemberi jarak dibawah */}
                                        <div></div>
                                    </div>
                                </>
                            ) : (
                                <div
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "60vh",
                                        flexDirection: "column",
                                        marginLeft: "auto",
                                        marginRight: "auto"
                                    }}
                                >
                                    <FaBoxOpen size={80} color="#000" style={{ marginBottom: "10px" }} />
                                    <h4 style={{ color: "#000", fontWeight: "normal" }}>
                                        Barang tidak ditemukan
                                    </h4>
                                    <p style={{ color: "#000", fontSize: "14px" }}>
                                        Silakan coba kata kunci lain atau pilih kategori berbeda.
                                    </p>
                                    <button
                                        onClick={refreshPage}
                                        style={{
                                            padding: "10px 20px",
                                            backgroundColor: "#316910",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)"
                                        }}
                                    >
                                        Refresh
                                    </button>
                                </div>
                            )
                            }

                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ShopPage;