import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "../Homepage/Homepage";
import AdminPage from "../Pages/Admin/AdminPage";
import CSPage from "../Pages/CustomerService/CSPage";
import LoginPage from "../Pages/LoginRegister/LoginPage";
import DaftarDonasiPage from "../Pages/Organisasi/DaftarDonasi";
import OwnerPage from "../Pages/Owner/OwnerPage";
import ReqDonasi from "../Pages/Owner/ReqDonasi"; 
import HistoryDonasiPage from "../Pages/Owner/HistoryDonasi"; 
import LaporanPage from "../Pages/Owner/Laporan"; 
import PegawaiGudangPage from "../Pages/PegawaiGudang/PegawaiGudangPage";

import ProfilePenitipPage from "../Pages/Penitip/ProfilePenitipPage";

import PembeliLayout from "../Layouts/PembeliLayouts";
import ProfilePembeliPage from "../Pages/Pembeli/ProfilePembeliPage";
import AlamatPembeliPage from "../Pages/Pembeli/AlamatPembeliProfilePage";
import PurchasePembeliPage from "../Pages/Pembeli/PurchasePembeliPage";
import ShopPage from "../Homepage/ShopPage";
import DetailBarangPage from "../Pages/Pembeli/DetailBarangPage";
import ListBarangPenitipPage from "../Pages/Pembeli/ListBarangPenitipPage"
import CartPage from "../Pages/Pembeli/CartPage";
import CheckoutPage from "../Pages/Pembeli/CheckoutPage";
import PaymentPage from "../Pages/Pembeli/PaymentPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/admin",
        element: <AdminPage />,
        children: [
            {
                path: "dashboard",
                element: <div>Admin Dashboard</div>,
            },
        ],
    },
    {
        path: "/customerservice",
        element: <CSPage />,
        children: [
            {
                path: "payment",
                element: <div>Payment Management</div>,
            },
        ],
    },
    {
        path: "/auth",
        element: <div>Auth Page</div>,
        children: [
            {
                path: "login",
                element: <LoginPage />,
            },
        ],
    },
    {
        path: "/organisasi",
        element: <div>Organisasi Page</div>,
        children: [
            {
                path: "daftar-donasi",
                element: <DaftarDonasiPage />,
            },
        ],
    },
    {
        path: "/owner",
        element: <OwnerPage />,
        children: [
            {
                path: "req-donasi", 
                element: <ReqDonasi/>,
            },
            {
                path: "history-donasi", 
                element: <HistoryDonasiPage/>,
            },
            {
                path: "laporan", 
                element: <LaporanPage/>,
            },

        ],
    },
    {
        path: "/pegawai-gudang",
        element: <PegawaiGudangPage />,
    },
    {
        path: "/pembeli",
        element: <PembeliLayout />,
        children: [
            {
                path: "profile",
                element: <ProfilePembeliPage />,
            },
            {
                path: "alamat",
                element: <AlamatPembeliPage />,
            },
            {
                path: "purchase",
                element: <PurchasePembeliPage />,
            },
            {
                path: "shop",
                element: <ShopPage />,
            },
            {
                path: "detailBarang",
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
            }
        ],
    },
    {
        path: "/penitip",
        element: <div>Penitip Page</div>,
        children: [
            {
                path: "profile",
                element: <ProfilePenitipPage />,
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
