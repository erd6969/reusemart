import Carousel from 'react-bootstrap/Carousel';
import yuki from "../../assets/images/Pembeli/Yuki.jpeg";
import test from "../../assets/images/testcarousel.jpg";
import dhiaz from "../../assets/images/Orang Palu.png";
import "./CarouselHome.css";

function CarouselHome({gambar}) {
  return (
    <Carousel style={{ width: "100%"}} className="carousel-home">
      {gambar.map((item) => (
        <Carousel.Item >
          <img src={item} alt="" className='carousel-image'/>
          
        </Carousel.Item>
      ))}
      
    </Carousel>
  );
}

export default CarouselHome;