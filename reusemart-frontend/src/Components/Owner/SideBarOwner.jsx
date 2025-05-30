import "./SideBarOwner.css";
import { useNavigate } from "react-router-dom";
import { FaUserCog, FaUsersCog, FaBoxOpen, FaAngleRight } from "react-icons/fa";
import { useState } from "react";

const SideBarOwner = () => {
    const navigate = useNavigate();
    const [showLaporanSubmenu, setShowLaporanSubmenu] = useState(false);

    return (
        <div className="sidebarOwner">
            <div className="sidebarContentOwner">
                <div className="sidebarTitleOwner">Halaman Owner</div>
                <ul className="sidebarMenuOwner">
                    <li className="sidebarItemOwner" onClick={() => navigate("/owner/req-donasi")}>
                        <FaUsersCog className="sidebarIcon" />
                        Daftar Request Donasi
                    </li>
                    <li className="sidebarItemOwner" onClick={() => navigate("/owner/history-donasi")}>
                        <FaUserCog className="sidebarIcon" />
                        History Donasi
                    </li>

                    <li className="sidebarItemOwner" onClick={() => setShowLaporanSubmenu(!showLaporanSubmenu)}>
                        <div className="sidebarItemRow">
                            <div>
                                <FaBoxOpen className="sidebarIcon" />
                                Laporan
                            </div>
                            <FaAngleRight
                                className={`sidebarArrow ${showLaporanSubmenu ? "rotate" : ""}`}
                            />
                        </div>
                    </li>

                    {showLaporanSubmenu && (
                        <ul className="sidebarSubMenuOwner">
                            <li className="sidebarSubItemOwner" onClick={() => navigate("/owner/laporan-penjualan")}>
                                Laporan Penjualan Bulanan
                            </li>
                            <li className="sidebarSubItemOwner" onClick={() => navigate("/owner/laporan-komisi-bulanan")}>
                                Laporan Komisi Bulanan
                            </li>
                            <li className="sidebarSubItemOwner" onClick={() => navigate("/owner/laporan-stok-gudang")}>
                                Laporan Stok Gudang
                            </li>
                            <li className="sidebarSubItemOwner" onClick={() => navigate("/owner/laporan-penjualan-kategori")}>
                                Laporan Penjualan per Kategori
                            </li>
                            <li className="sidebarSubItemOwner" onClick={() => navigate("/owner/laporan-barang-habis")}>
                                Laporan Barang yang Masa Penitipan Habis
                            </li>
                            <li className="sidebarSubItemOwner" onClick={() => navigate("/owner/laporan-donasi")}>
                                Laporan Donasi Barang
                            </li>
                            <li className="sidebarSubItemOwner" onClick={() => navigate("/owner/laporan-request-donasi")}>
                                Laporan Request Donasi
                            </li>
                            <li className="sidebarSubItemOwner" onClick={() => navigate("/owner/laporan-transaksi-penitip")}>
                                Laporan Transaksi Penitip
                            </li>
                        </ul>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default SideBarOwner;
