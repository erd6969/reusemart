import { Card, ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import OwnHead from "../../Components/TabelHeadAdmin.jsx";
import OwnBody from "../../Components/TabelBodyAdmin.jsx";

function HistoryDonasi() {
    const navigate = useNavigate();

    return (
        <div>

            <Card style={{ marginTop: '5vh', marginRight: '7vw' }}>
                <Card.Body>
                    <SearchBook />
                </Card.Body>
            </Card>
            <Card style={{ marginTop: '5vh', marginRight: '7vw' }}>
                <Card.Body >
                    <HistoDon />
                </Card.Body>
            </Card>
        </div>
    );
}

function HistoDon() {
    return (
        <div style={{ margin: "20px" }}>
            <ListGroup >
                <OwnHead columns={["ID", "Organisasi", "Email", "Nomor Telepon", "Aksi"]} />
                <OwnBody />
                <OwnBody />
                <OwnBody />
            </ListGroup>
        </div>
    );
}


function SearchBook() {
    const navigate = useNavigate();

    return (
        <div className="search-container" style={{ marginBottom: "1vw", display: "flex"}}>
            <input
                type="text"
                placeholder="Cari Organisasi"
                style={{ width: "57vw", height: "6vh", borderRadius: "5px" }}
            />
            <button
                style={{ width: "150px", height: "6vh", marginLeft: "15px", borderRadius: "5px", backgroundColor: "#3E5879", color: "white", fontWeight: "bold" }}
                onClick={() => navigate("/search")}
            >
                Search
            </button>
        </div>
    )
}

export default HistoryDonasi;