import { useState } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import image3 from "../../assets/images/Search.png";
import CarouselHome from "../../Components/Carousel/CarouselHome.jsx";
import {
    FaSearch, FaEye, FaBullseye
} from 'react-icons/fa';
import "./Home.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import logo from "../../assets/images/logohomehd.png";
import burnice from "../../assets/images/BurniceKicil.jpg";
import benefit2 from "../../assets/images/kasiduit.png";
import chen from "../../assets/images/chen-quotes.jpeg";
import benefit1 from "../../assets/images/onkle.png";

import yuki from "../../assets/images/Pembeli/Yuki.jpeg";
import test from "../../assets/images/testcarousel.jpg";

import Gudang from "../../assets/images/pegawai gudang.jpeg";
import kurir from "../../assets/images/kurir.webp";
import deal from "../../assets/images/deal.png";
import barangBekas from "../../assets/images/barangbekas.jpg";
import ambilbarang from "../../assets/images/ambilbarang.png";

const gambar = [
    {
        image: barangBekas,
        caption: "Leave your used goods, let us sell them!",
    },
    {
        image: deal,
        caption: "Profit when you sell, save when you buy!",
    },
    {
        image: Gudang,
        caption: "We check every item before selling!",
    },
    {
        image: kurir,
        caption: "Our courier is ready to deliver goods to your location!",
    }
]


const Home = () => {
    const [count, setCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();
    return (
        <>
            
            {/* Carousel */}
            <CarouselHome className="w-full" gambar={gambar} />



            <div className="text-center mb-3" style={{ backgroundColor: "#347928", borderRadius: "50px", transform: "translateY(-6vh)", paddingTop: "20vh" }}>

                <div className="kotak-kuning">
                    <img src={logo} alt="" style={{ width: "18%" }} />


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
                    spaceBetween={0}
                    slidesPerView={2}
                    loop={true}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                    style={{display: "flex", justifyContent: "center"}}
                >
                    <SwiperSlide className="swiper-slide"><img src={benefit1} className="img-swiper" /></SwiperSlide>
                    <SwiperSlide className="swiper-slide"><img src={benefit2} className="img-swiper" /></SwiperSlide>
                    <SwiperSlide className="swiper-slide"><img src={ambilbarang} className="img-swiper" /></SwiperSlide>
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