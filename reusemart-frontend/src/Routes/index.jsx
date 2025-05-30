import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoutes from "../Routes/ProtectedRoutes";
import GuestOnlyRoute from "../Routes/GuestOnlyRoutes";

//Guess
import GuestLayouts from "../Layouts/GuestLayouts";

// Pages & Layouts
import HomePage from "../Pages/Homepage/Homepage";
import Home from "../Pages/Homepage/Home";
import LoginPage from "../Pages/LoginRegister/LoginPage";
import RegisterBuyerPage from "../Pages/LoginRegister/RegisterBuyerPage";
import RegisterOption from "../Pages/LoginRegister/RegisterOption";
import HistoryDonasiPage from "../Pages/Owner/HistoryDonasi";
import LaporanPage from "../Pages/Owner/Laporan";
import PenitipanBarangPage from "../Pages/PegawaiGudang/PenitipanBarangPage";
import ReqDonasi from "../Pages/Owner/ReqDonasi";

//Pembeli
import PembeliLayout from "../Layouts/PembeliLayouts";
import ProfilePembeliPage from "../Pages/Pembeli/ProfilePembeliPage";
import PembeliProductLayout from "../Layouts/PembeliContentLayouts";
import AlamatPembeliPage from "../Pages/Pembeli/AlamatPembeliProfilePage";
import PurchasePembeliPage from "../Pages/Pembeli/PurchasePembeliPage";
import ShopPage from "../Pages/Homepage/ShopPage";
import DetailBarangPage from "../Pages/Homepage/DetailBarangPage";
import ListBarangPenitipPage from "../Pages/Pembeli/ListBarangPenitipPage";
import CartPage from "../Pages/Pembeli/CartPage";
import CheckoutPage from "../Pages/Pembeli/CheckoutPage";
import PaymentPage from "../Pages/Pembeli/PaymentPage";
import ListTransaksi from "../Pages/Pembeli/PurchasePembeliPage";
import PurchaseVerificationPage from "../Pages/Pembeli/PurchaseVerificationPage";
import UnpaidPurchasePage from "../Pages/Pembeli/UnpaidPurchasePage";

//Forgot Password
import ForgotPassword from "../Pages/LoginRegister/VerifyEmailPage";
import ResetPassword from "../Pages/LoginRegister/ResetPasswordPage";

//Organisasi
import OrganisasiRequestLayout from "../Layouts/OrganisasiRequestLayouts";
import RequestDonasiPage from "../Pages/Organisasi/RequestDonasiPage";
import HistoryRequestDonasiPage from "../Pages/Organisasi/HistoryRequestDonasiPage";
import RegisterOrganisasi from "../Pages/LoginRegister/RegisterOrganisasiPage";
import ProfileOrganisasiiPage from "../Pages/Organisasi/ProfileOrganisasiPage";

//Admin
import AdminLayout from "../Layouts/AdminLayouts";
import AdminMasterOrganisasiPage from "../Pages/Admin/AdminMasterOrganisasiPage";
import AdminResetPasswordPage from "../Pages/Admin/AdminResetPasswordPage";
import AdminMasterPegawaiPage from "../Pages/Admin/AdminMasterPegawaiPage";

//Penitip
import PenitipLayout from "../Layouts/PenitipLayouts";
import PenitipProductLayout from "../Layouts/PenitipContentLayouts";
import ProfilPenitip from "../Pages/Penitip/ProfilePenitipPage";
import SoldProductPage from "../Pages/Penitip/SoldProductPage";
import OnSaleProductPage from "../Pages/Penitip/OnSaleProductPage";
import ExtendProductPage from "../Pages/Penitip/ExtendProductPage";
import DonatedProductPage from "../Pages/Penitip/DonatedProductPage";

//CS
import CSLayout from "../Layouts/CSLayouts";
import CSDiscussionPage from "../Pages/CustomerService/CSDiscussionPage";
import CSPenitipManagementPage from "../Pages/CustomerService/CSPenitipManagementPage";
import CSVerifikasiBuktiPage from "../Pages/CustomerService/CSVerifikasiBuktiPage";
import KlaimMerchandisePage from "../Pages/CustomerService/KlaimMerchandisePage";

// Owner
import OwnerLayouts from "../Layouts/OwnerLayouts";
import ReqDonasiShowBarang from "../Pages/Owner/ReqDonasiShowBarang";
import LaporanRequestDonasi from "../Pages/Owner/Laporan/LaporanRequestDonasi";
import LaporanDonasi from "../Pages/Owner/Laporan/LaporanDonasi";
import LaporanKategori from "../Pages/Owner/Laporan/LaporanKategori";
import LaporanTransaksiPenitip from "../Pages/Owner/Laporan/LaporanTransaksiPenitip";

//Pegawai Gudang
import PegawaiGudangLayout from "../Layouts/PegawaiGudangLayouts";
import DetailTransaksiPenitipanPage from "../Pages/PegawaiGudang/DetailTransaksiPenitipanPage";
import VerifikasiSelesaiPage from "../Pages/PegawaiGudang/VerifikasiSelesaiPage";
import TransaksiPengirimanPage from "../Pages/PegawaiGudang/TransaksiPengirimanPage";
import LaporanPenjualanKeseluruhan from "../Pages/Owner/Laporan/LaporanPenjualanKeseluruhan";
import LaporanKomisiBulanan from "../Pages/Owner/Laporan/LaporanKomisiBulanan";
import LaporanStokGudang from "../Pages/Owner/Laporan/LaporanStokGudang";
import LaporanBarangHabis from "../Pages/Owner/Laporan/LaporanBarangHabis";
const router = createBrowserRouter([
    {
        path: "/",
        element: <GuestLayouts />,
        children: [
            {
                path: "",
                element: (
                    <GuestOnlyRoute>
                        <Home />,
                    </GuestOnlyRoute>
                ),
            },
            {
                path: "shop",

                element: (
                    <GuestOnlyRoute>
                        <ShopPage />,
                    </GuestOnlyRoute>
                ),
            },
            {
                path: "detailBarang/:id_barang",
                element: (
                    <GuestOnlyRoute>
                        <DetailBarangPage />,
                    </GuestOnlyRoute>
                ),
            },
            {
                path: "list-barang-penitip",
                element: (
                    <GuestOnlyRoute>
                        <ListBarangPenitipPage />,
                    </GuestOnlyRoute>
                ),
            },
            {
                path: "auth/login",
                element: (
                    <GuestOnlyRoute>
                        <LoginPage />
                    </GuestOnlyRoute>
                ),
            },
            {
                path: "auth/register-buyer",
                element: (
                    <GuestOnlyRoute>
                        <RegisterBuyerPage />
                    </GuestOnlyRoute>
                ),
            },
            {
                path: "auth/register-option",
                element: (
                    <GuestOnlyRoute>
                        <RegisterOption />
                    </GuestOnlyRoute>
                ),
            },
            {
                path: "auth/register-organisasi",
                element: (
                    <GuestOnlyRoute>
                        <RegisterOrganisasi />
                    </GuestOnlyRoute>
                ),
            },
            {
                path: "auth/forgot-password",
                element: (
                    <GuestOnlyRoute>
                        <ForgotPassword />
                    </GuestOnlyRoute>
                ),
            },
            {
                path: "auth/reset-password",
                element: (
                    <GuestOnlyRoute>
                        <ResetPassword />
                    </GuestOnlyRoute>
                ),
            },
        ],
    },
    {
        path: "/organisasi",
        element: (
            <ProtectedRoutes allowedRoles={["organisasi"]}>
                <OrganisasiRequestLayout />
            </ProtectedRoutes>
        ),
        children: [
            {
                path: "profile",
                element: <ProfileOrganisasiiPage />,
            },
            {
                path: "request-donasi",
                element: (
                    <RequestDonasiPage />
                )
            },
            {
                path: "history-donasi",
                element: (
                    <HistoryRequestDonasiPage />
                )
            },
        ],
    },
    {
        path: "/owner",
        element: (
            <ProtectedRoutes allowedRoles={["owner"]}>
                <OwnerLayouts />
            </ProtectedRoutes>
        ),
        children: [
            {
                path: "req-donasi",
                element: <ReqDonasi />,
            },
            {
                path: "history-donasi",
                element: <HistoryDonasiPage />,
            },
            {
                path: "laporan",
                element: <LaporanPage />,
            },
            {
                path: "req-donasi-show-barang/:nama_organisasi/:id_request_donasi",
                element: <ReqDonasiShowBarang />,
            },
            {
                path: "laporan-penjualan",
                element: <LaporanPenjualanKeseluruhan />,
            },
            {
                path: "laporan-komisi-bulanan",
                element: <LaporanKomisiBulanan/>,
            },
            {
                path: "laporan-stok-gudang",
                element: <LaporanStokGudang/>,
            },
            {
                path: "laporan-transaksi-penitip",
                element: <LaporanTransaksiPenitip />,
            },
            {
                path: "laporan-request-donasi",
                element: <LaporanRequestDonasi />,
            },
            {
                path: "laporan-barang-habis",
                element: <LaporanBarangHabis />,
            },
            {
                path: "laporan-donasi",
                element: <LaporanDonasi />,
            },
            {
                path: "laporan-penjualan-kategori",
                element: <LaporanKategori />,
            },
        ],
    },
    {
        path: "/pegawai-gudang",
        element: (
            <ProtectedRoutes allowedRoles={["gudang"]}>
                <PegawaiGudangLayout />
            </ProtectedRoutes>
        ),
        children: [
            {
                path: "penitipan-barang",
                element: <PenitipanBarangPage />,
            },
            {
                path: "detail-transaksi-penitipan/:id_transaksi_penitipan",
                element: <DetailTransaksiPenitipanPage />,
            },
            {
                path: "ambil-barang",
                element: <VerifikasiSelesaiPage />,
            },
            {
                path: "transaksi-pengiriman",
                element: <TransaksiPengirimanPage />,
            }
        ],
    },

    {
        path: "/admin",
        element: (
            <ProtectedRoutes allowedRoles={["admin"]}>
                <AdminLayout />
            </ProtectedRoutes>
        ),
        children: [
            {
                path: "admin-organisasi-master",
                element: <AdminMasterOrganisasiPage />,
            },
            {
                path: "admin-reset-password",
                element: <AdminResetPasswordPage />,
            },
            {
                path: "admin-pegawai-master",
                element: <AdminMasterPegawaiPage />,
            },
        ],
    },

    {
        path: "/customerservice",
        element: (
            <ProtectedRoutes allowedRoles={["cs"]}>
                <CSLayout />
            </ProtectedRoutes>
        ),
        children: [
            {
                path: "penitip-management",
                element: <CSPenitipManagementPage />,
            },
            {
                path: "discussion",
                element: <CSDiscussionPage />,
            },
            {
                path: "verifikasi-bukti",
                element: <CSVerifikasiBuktiPage />,
            },
            {
                path: "klaim-merchandise",
                element: <KlaimMerchandisePage />,
            }
        ],
    },
    {
        path: "/pembeli",
        element: (
            <ProtectedRoutes allowedRoles={["pembeli"]}>
                <PembeliLayout />
            </ProtectedRoutes>
        ),
        children: [
            {
                path: "home",
                element: <Home />,
            },
            {
                path: "profile",
                element: <ProfilePembeliPage />,
            },
            {
                path: "alamat",
                element: <AlamatPembeliPage />,
            },
            {
                path: "shop",
                element: <ShopPage />,
            },
            {
                path: "detailBarang/:id_barang",
                element: <DetailBarangPage />,
            },
            {
                path: "list-barang-penitip",
                element: <ListBarangPenitipPage />,
            },
            {
                path: "cart",
                element: <CartPage />,
            },
            {
                path: "checkout",
                element: <CheckoutPage />,
            },
            {
                path: "pembayaran",
                element: <PaymentPage />,
            },
            {
                path: "",
                element: <PembeliProductLayout />,
                children: [
                    {
                        path: "purchase",
                        element: <PurchasePembeliPage />,
                    },
                    {
                        path: "list-transaksi",
                        element: <ListTransaksi />,
                    },
                    {
                        path: "unpaid-purchase",
                        element: <UnpaidPurchasePage />,
                    },
                    {
                        path: "purchase-verification",
                        element: <PurchaseVerificationPage />,
                    }
                ],
            },
        ],
    },
    {
        path: "/penitip",
        element: (
            <ProtectedRoutes allowedRoles={["penitip"]}>
                <PenitipLayout />
            </ProtectedRoutes>
        ),
        children: [
            {
                path: "profile",
                element: <ProfilPenitip />,
            },
            {
                path: "",
                element: <PenitipProductLayout />,
                children: [
                    { path: "on-sale", element: <OnSaleProductPage /> },
                    { path: "sold-product", element: <SoldProductPage /> },
                    { path: "extend", element: <ExtendProductPage /> },
                    { path: "donated", element: <DonatedProductPage /> },
                ],
            },
        ],
    },
    {
        path: "*",
        element: <div>Routes Not Found!</div>,
    },
]);

const AppRouter = () => {
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <RouterProvider router={router} />
        </>
    );
};

export default AppRouter;
