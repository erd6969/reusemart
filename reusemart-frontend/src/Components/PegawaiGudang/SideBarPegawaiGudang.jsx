import "./SideBarPegawaiGudang.css";
import { useNavigate } from "react-router-dom";
import { FaUserCog, FaUsersCog, FaBoxOpen, FaKey, FaBoxes } from "react-icons/fa";

const SideBarPegawaiGudang = () => {
    const navigate = useNavigate();
    return (
        <div className="sidebarPegawaiGudang">
            <div className="sidebarContentPegawaiGudang">
                <div className="sidebarTitlePegawaiGudang">Halaman Pegawai Gudang</div>
                <ul className="sidebarMenuPegawaiGudang">
                    <li className="sidebarItemPegawaiGudang" onClick={() => navigate("/pegawai-gudang/penitipan-barang")}>
                        <FaBoxes className="sidebarIcon" /> Penitipan Barang
                    </li>
                    <li className="sidebarItemPegawaiGudang" onClick={() => navigate("/pegawai-gudang/ambil-barang")}>
                        <FaUserCog className="sidebarIcon" /> Verifikasi Barang
                    </li>
                    <li className="sidebarItemPegawaiGudang" onClick={() => navigate("/pegawai-gudang/transaksi-pengiriman")}>
                        <FaUserCog className="sidebarIcon" /> Transaksi Pengiriman
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideBarPegawaiGudang;
