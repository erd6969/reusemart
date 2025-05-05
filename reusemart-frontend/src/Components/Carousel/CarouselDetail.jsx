import Carousel from 'react-bootstrap/Carousel';
import yuki from "../../assets/images/Pembeli/Yuki.jpeg";
import test from "../../assets/images/testcarousel.jpg";
import dhiaz from "../../assets/images/Orang Palu.png";
import "./CarouselDetail.css";

function CarouselDetail({ gambar }) {
  return (
    <div className="carousel-detail">

      <Carousel>
        {gambar.map((item) => (
          <Carousel.Item >
            <img src={item} alt="" className='carousel-image' />

          </Carousel.Item>
        ))}

      </Carousel>
    </div >
  );
}

export default CarouselDetail;