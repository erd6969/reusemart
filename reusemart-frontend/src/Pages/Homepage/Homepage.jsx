import { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
    const [count, setCount] = useState(0);

    const navigate = useNavigate();
    return (
        <Container className="mt-5">
            <p>Count: {count}</p>
            <div className="text-center mb-3">
                <button onClick={() => navigate("/home")}>Umum Web</button>
                <p>Sumpah ini isi nya umum Homepage cok</p>

                <button onClick={() => navigate("/pembeli/shop")}>Pembeli</button>
                <p>Pembeli ni langsung masuk ke profil</p>

                <button onClick={() => navigate("/organisasi/request-donasi")}>Organisasi</button>
                <p>Langsung masuk halaman daftar barang yang didonasikan</p>

                <button onClick={() => navigate("/customerservice")}>Counter Strike</button>
                <p>Liat di figma</p>

                <button onClick={() => navigate("/auth/login")}>Login Register</button>
                <p>Login register figma</p>

                <button onClick={() => navigate("/penitip/profile")}>Penitip</button>
                <p>langsung profil bang</p>

                <button onClick={() => navigate("/owner/req-donasi")}>Owner</button>
                <p>owner itam</p>

                <button onClick={() => navigate("/admin")}>Admin</button>
                <p>Halaman admin</p>

                <button onClick={() => navigate("/pegawai-gudang")}>Pegawai Gudang</button>
                <p>Halaman pegawai gudang</p>

                <button onClick={() => navigate("/auth/login")}>Login Register</button>
                <p>Auth</p>
            </div>
        </Container>
    );
};

export default Homepage;
