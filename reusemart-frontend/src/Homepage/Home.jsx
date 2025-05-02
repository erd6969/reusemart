import { useState } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import image3 from "../assets/images/Search.png";
import CarouselHome from "../Components/CarouselHome.jsx";
import {
    FaSearch, FaEye, FaBullseye
} from 'react-icons/fa';
import "./Home.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import dhiaz from "../assets/images/logohomehd.png";
import burnice from "../assets/images/BurniceKicil.jpg";
import benefit2 from "../assets/images/benefit2.png";
import chen from "../assets/images/chen-quotes.jpeg";
import benefit1 from "../assets/images/onkle.png";

const Home = () => {
    const [count, setCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();
    return (
        <>
            <div
                className="search-container"
                style={{
                    position: "absolute",
                    top: "30%",
                    left: "23.5%",
                    zIndex: 1,
                }}
            >
                <Card className="bg-dark text-white" >
                    <Card.Img src={image3} alt="Card image" style={{
                        height: "35vh",
                        width: "55vw",
                        objectFit: "cover"
                    }} />
                    <Card.ImgOverlay
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            alignItems: "start",
                            paddingBottom: "1vh",
                            paddingLeft: "2vw",
                            width: "100%",
                        }}
                    >
                        <div className="search-container"
                            style={{
                                marginBottom: "3vh",
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "white",
                                padding: "2vh 1vw",
                                borderRadius: "30vw",
                                width: "30vw",
                                height: "5vh",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                            }}>
                            <FaSearch style={{ color: "#777", marginRight: "1vw", fontSize: "10vh" }} />
                            <input
                                type="text"
                                placeholder="Search for an item"
                                style={{
                                    width: "100vw",
                                    height: "20vh",
                                    border: "none",
                                    outline: "none",
                                    fontSize: "2vh",
                                    backgroundColor: "transparent",
                                }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </Card.ImgOverlay>

                </Card>
            </div>
            {/* Carousel */}
            <CarouselHome className="w-full" />



            <div className="text-center mb-3" style={{ backgroundColor: "#347928", borderRadius: "50px", transform: "translateY(-6vh)", paddingTop: "20vh" }}>

                <div className="kotak-kuning">
                    <img src={dhiaz} alt="" style={{ width: "18%" }} />


                    <h1 style={{ fontSize: "3vw" }}>
                        <strong>
                            Reuse mart is a company that makes it easy for people to buy used stuff or sell them!
                        </strong>
                    </h1>

                </div>
            </div>

            <div className="kotak-visimisi">
                <div className="visi" >
                    <h1 style={{ fontWeight: "bold", textShadow: "0px 2px 1px #203C0E" }}>
                        <FaEye style={{ transform: "translateY(-5px)" }} /> Vision
                    </h1>
                    <h4>
                        <strong>
                            Reuse mart is a company that makes it easy for people to buy used stuff or sell them!
                        </strong>
                    </h4>
                </div>

                <div className="misi">
                    <h1 style={{ fontWeight: "bold", textShadow: "0px 2px 1px #203C0E" }}>
                        <FaBullseye style={{ transform: "translateY(-5px)" }} /> Mission
                    </h1>

                    <h4>
                        <strong>
                            Reuse mart is a company that makes it easy for people to buy used stuff or sell them!
                        </strong>
                    </h4>
                </div>
            </div>
            
            <div style={{marginBottom: "30vh"}}>

                <Swiper
                    spaceBetween={50}
                    slidesPerView={2}
                    loop={true}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                    style={{display: "flex", justifyContent: "center"}}
                >
                    <SwiperSlide className="swiper-slide"><img src={benefit1} className="img-swiper" /></SwiperSlide>
                    <SwiperSlide className="swiper-slide"><img src={benefit2} className="img-swiper" /></SwiperSlide>
                    <SwiperSlide className="swiper-slide"><img src={chen} className="img-swiper" /></SwiperSlide>
                </Swiper>
            </div>


            <div className="gambar-founder">
                <img src={chen} style={{height: "70vh", width: "25vw", borderRadius:"20px", transform: "translateY(-17vh)", marginLeft: "6vw", marginRight: "2vw"}} />
                <div className="bagian-nama-founder">
                    <div style={{backgroundColor: "#fbd332", width: "1vw", height: "12vh"}}>

                    </div>
                    <div style={{marginLeft: "2vw"}}>
                        <h1>
                            Meet Our Founder
                        </h1>
                        <h2>
                            Mr. Raka Pratama
                        </h2>
                    </div>
                </div>
            </div>
            <div className="kotak-kuning-founder">
                <div style={{ display: "flex", justifyContent: "end", width: "60%"}}>
                    <h2>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </h2>
                    
                </div>
            </div>

        </>
    );
}

export default Home;