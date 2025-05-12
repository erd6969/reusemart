import Carousel from 'react-bootstrap/Carousel';
import yuki from "../../assets/images/Pembeli/Yuki.jpeg";
import test from "../../assets/images/testcarousel.jpg";
import dhiaz from "../../assets/images/Orang Palu.png";
import "./CarouselHome.css";
import { Car } from 'lucide-react';

function CarouselHome({gambar}) {
  return (
    <Carousel style={{ width: "100%"}} className="carousel-home" indicators={false}>
      {gambar.map((item) => (
        <Carousel.Item >
          <img src={item.image} alt="" className='carousel-image'/>
          <Carousel.Caption className='carousel-caption'>
            <h1 className='carousel-title'>{item.caption}</h1>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
      
    </Carousel>
  );
}

export default CarouselHome;