import Carousel from 'react-bootstrap/Carousel';
import "./CarouselDetail.css";
import { getThumbnailBarang } from "../../api";

function CarouselDetail({ gambar }) {
  if (!Array.isArray(gambar)) return <p>Tidak ada gambar tersedia.</p>;

  return (
    <div className="carousel-detail">
      <Carousel>
        {gambar.map((item, index) => (
          console.log(getThumbnailBarang(item)),
          <Carousel.Item key={index}>
            <img src={getThumbnailBarang(item)} alt={`gambar-${index}`} className='carousel-image' />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}


export default CarouselDetail;