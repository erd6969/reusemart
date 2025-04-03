// Ini Sementara Aja (Copas Dari Atma Library)

import { useNavigate } from "react-router-dom";
import image1 from "../assets/images/Pembeli/Yuki.jpeg";
import "../Homepage/ShopPage.css";

function BookSection() {
    return (
        <div className="book-container">
            <SearchBook />
            <BookList />
        </div>
    );
}

function SearchBook(){
    const navigate = useNavigate();
    
    return(
        <div className="search-container" style={{marginBottom:"20px"}}>
            <input 
                type="text" 
                placeholder="Search Book"
                style={{width:"900px", height:"40px", marginRight:"20px", borderRadius:"5px"}}
            />
            <button 
                style={{width:"90px", height:"40px", borderRadius:"5px", backgroundColor:"#3E5879", color:"white", fontWeight:"bold"}}
                onClick={() => navigate("/search")}
            >
                Search
            </button>
        </div>
    )
}

function BookList() {
    const navigate = useNavigate();

    return (
        <div
            className="book-list"
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
                justifyContent: "center",
            }}
        >
            {Array.from({ length: 50 }).map((_, index) => (
                <div
                    key={index}
                    className="book-container"
                    style={{
                        backgroundColor: "#D9D9D9",
                        borderRadius: "10px",
                        width: "200px",
                        height: "280px",
                    }}
                    onClick={() => navigate(`/pembeli/detailBarang`)}
                >
                    <img
                        src={image1}
                        alt="book"
                        style={{
                            width: "200px",
                            height: "210px",
                            borderRadius: "10px",
                        }}
                    />
                    <p
                        style={{
                            textAlign: "center",
                            paddingTop: "5px",
                            fontWeight: "bold",
                        }}
                    >
                        Kisah Cinta Nigga Dari Jambi
                    </p>
                </div>
            ))}
        </div>
    );
}

function CategorySection() {
    const navigate = useNavigate();

    return (
        <div className="category-container">
            <h1>Category</h1>
            {Array.from({ length: 50 }).map((_, index) => (
                <p 
                    key={index}
                    onClick={() => navigate(`/category/${index + 1}`)}
                >
                    Bokep {index + 1}
                </p>
            ))}
        </div>
    );
}

const ShopPage = () => {
    return (
        <div className="main-container">
            <div>
                <CategorySection />
            </div>
            <div>
                <BookSection />
            </div>
        </div>
    );
};

export default ShopPage;