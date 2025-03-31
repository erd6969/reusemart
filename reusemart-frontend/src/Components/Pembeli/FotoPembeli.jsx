import { Container } from "react-bootstrap";
import "./FotoPembeli.css";

const FotoPembeli = ({Foto, SubProp}) => {
    return(
      <>
        <Container>
          <br />
          <div className="foto-container">
              <div className="foto-pembeli">
                  <img src={Foto} alt="Foto Pembeli" />
                  {SubProp}
              </div>
          </div>
        </Container>
       </>
    );
};

export default FotoPembeli;