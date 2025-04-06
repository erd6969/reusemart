
import { Nav, Card, Badge } from 'react-bootstrap';
import { useState } from 'react';
import {
    FaMobile, FaTshirt, FaChair, FaBook, FaGamepad,
    FaBaby, FaCar, FaTree, FaBriefcase, FaSmile,
    FaChevronDown, FaChevronRight, FaSearch
} from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import image1 from "../assets/images/Pembeli/Yuki.jpeg";
import image2 from "../assets/images/Orang Palu.png";
import image3 from "../assets/images/Search.png";
import "../Homepage/ShopPage.css";

const kategori = [
    {
        icon: FaMobile,
        name: "Elektronik & Gadget",
        subcategories: [
            "Smartphone & Tablet",
            "Laptop & Komputer",
            "Kamera & Aksesori",
            "Peralatan Audio/Video",
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
            "Suku Cadang & Aksesori Mobil/Motor",
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

function SearchItem() {
    const navigate = useNavigate();

    return (
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
                }}/>
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
                    <Card.Text>
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
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            }}
                        >
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
                            />
                        </div>
                    </Card.Text>
                </Card.ImgOverlay>
                
            </Card>
        </div>
        // <div className="search-container"
        //     style={{
        //         marginTop: "20px",
        //         marginBottom: "20px",
        //         display: "flex",
        //         justifyContent: "center",
        //         alignItems: "center",
        //         backgroundColor: "white",
        //         padding: "5px 15px",
        //         borderRadius: "30px",
        //         width: "500px",
        //         boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        //     }}
        // >
        //     <FaSearch style={{ color: "#777", marginRight: "10px" }} />
        //     <input
        //         type="text"
        //         placeholder="Search for an item"
        //         style={{
        //             width: "100%",
        //             height: "40px",
        //             border: "none",
        //             outline: "none",
        //             fontSize: "16px",
        //             backgroundColor: "transparent",
        //         }}
        //     />
        // </div>
    );
}

function ItemList() {
    const navigate = useNavigate();

    return (
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
            {Array.from({ length: 30 }).map((_, index) => (
                <div
                    key={index}
                    className="item-container"
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "10px",
                        width: "280px",
                        height: "360px",
                        boxShadow: "0px 2px 5px 5px rgb(16, 78, 13)",
                    }}
                    onClick={() => navigate(`/pembeli/detailBarang`)}
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
                                src={image2}
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
                        <p
                            style={{
                                textAlign: "center",
                                paddingTop: "20px",
                                fontWeight: "lighter",
                                fontSize: "18px",
                                fontFamily: "monospace",
                                marginBottom: "0px",
                            }}
                        >
                            Orang Palu Musuh Jawa
                        </p>
                        <p
                            style={{
                                fontWeight: "bolder",
                                fontSize: "26px",
                                fontFamily: "monospace",
                                marginBottom: "0px",
                            }}
                        >
                            Rp. 90.000

                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function CategorySection() {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(null);

    const toggleCategory = (index) => {
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
                                        onClick={() => navigate('/pembeli/profile')}
                                        style={{
                                            padding: "8px 10px",
                                            cursor: "pointer",
                                            borderRadius: "5px",
                                            ':hover': { backgroundColor: "#f5f5f5" }
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
    return (
        <div className="main-container">
            
            
            <div className="item-section"
                style={{
                    display: "flex",
                    overflowY: "auto",
                    height: "100vh",
                }}
            >
                <div style={{display: "flex", flexDirection: "column", overflowX: "hidden"}}>
                    <SearchItem />
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <CategorySection />
                        <ItemList />
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default ShopPage;