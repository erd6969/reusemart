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

// Owner
import OwnerLayouts from "../Layouts/OwnerLayouts";
import ReqDonasiShowBarang from "../Pages/Owner/ReqDonasiShowBarang";
import PegawaiGudangLayout from "../Layouts/PegawaiGudangLayouts";
import DetailTransaksiPenitipanPage from "../Pages/PegawaiGudang/DetailTransaksiPenitipanPage";

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
            }
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
        ],
    },
    {
        path: "/pembeli",
        element: (
            <ProtectedRoutes allowedRoles={["pembeli"]}>
            <PembeliLayout /> {/* Navbar + Footer */}
            </ProtectedRoutes>
        ),
        children: [
            // Halaman umum pembeli (tanpa sidebar)
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

            // Halaman pembeli yang pakai sidebar (produk, histori, transaksi, dll)
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
                // Tambahkan halaman lain di sini kalau perlu pakai sidebar
                // { path: "riwayat", element: <RiwayatPage /> },
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
