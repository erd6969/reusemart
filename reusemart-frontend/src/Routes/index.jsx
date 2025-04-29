import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoutes from "../Routes/ProtectedRoutes";
import GuestOnlyRoute  from "../Routes/GuestOnlyRoutes";

// Pages & Layouts
import HomePage from "../Homepage/Homepage";
import AdminPage from "../Pages/Admin/AdminPage";
import CSPage from "../Pages/CustomerService/CSPage";
import LoginPage from "../Pages/LoginRegister/LoginPage";
import RegisterBuyerPage from "../Pages/LoginRegister/RegisterBuyerPage";
import RegisterOption from "../Pages/LoginRegister/RegisterOption";
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
import ListBarangPenitipPage from "../Pages/Pembeli/ListBarangPenitipPage";
import CartPage from "../Pages/Pembeli/CartPage";
import CheckoutPage from "../Pages/Pembeli/CheckoutPage";
import PaymentPage from "../Pages/Pembeli/PaymentPage";
import ListTransaksi from "../Pages/Pembeli/PurchasePembeliPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/HomePage",
        element: <HomePage />,
    },
    
    
    {
        path: "/auth",
        children: [
            {
                path: "login",
                element: (
                    <GuestOnlyRoute>
                        <LoginPage />
                    </GuestOnlyRoute>
                ),
            },
            {
                path: "register-buyer",
                element:(
                    <GuestOnlyRoute>
                        <RegisterBuyerPage />
                    </GuestOnlyRoute>
                ),
            },
            {
                path: "register-option",
                element: (
                    <GuestOnlyRoute>
                        <RegisterOption />
                    </GuestOnlyRoute>
                ),
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
        element: (
            <ProtectedRoutes allowedRoles={["owner"]}>
                <OwnerPage />
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
        ],
    },
    {
        path: "/pegawai-gudang",
        element: (
            <ProtectedRoutes allowedRoles={["gudang"]}>
                <PegawaiGudangPage />
            </ProtectedRoutes>
        ),
    },

    {
        path: "/admin",
        element: (
            <ProtectedRoutes allowedRoles={["admin"]}>
                <AdminPage />
            </ProtectedRoutes>
        ),
        children: [
            {
                path: "dashboard",
                element: <div>Admin Dashboard</div>,
            },
        ],
    },

    {
        path: "/customerservice",
        element: (
            <ProtectedRoutes allowedRoles={["cs"]}>
                <CSPage />
            </ProtectedRoutes>
        ),
        children: [
            {
                path: "payment",
                element: <div>Payment Management</div>,
            },
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
                path: "list-transaksi",
                element: <ListTransaksi />,
            },
        ],
    },
    {
        path: "/penitip",
        element: (
            <ProtectedRoutes allowedRoles={["penitip"]}>
                <div>Penitip Page</div>
            </ProtectedRoutes>
        ),
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
