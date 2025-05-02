import Carousel from 'react-bootstrap/Carousel';
import yuki from "../assets/images/Pembeli/Yuki.jpeg";
import test from "../assets/images/testcarousel.jpg";
import dhiaz from "../assets/images/Orang Palu.png";
import "./CarouselHome.css";

function CarouselHome() {
  return (
    <Carousel style={{ width: "100%"}}>
      <Carousel.Item >
        <img src={test} alt="" className='carousel-image'/>
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item >
      <img src={yuki} alt="" className='carousel-image'/>
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item >
      <img src={dhiaz} alt="" className='carousel-image'/>
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselHome;