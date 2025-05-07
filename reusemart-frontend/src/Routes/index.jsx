import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoutes from "../Routes/ProtectedRoutes";
import GuestOnlyRoute  from "../Routes/GuestOnlyRoutes";

// Pages & Layouts
import HomePage from "../Homepage/Homepage";
import Home from "../Homepage/Home";
import LoginPage from "../Pages/LoginRegister/LoginPage";
import RegisterBuyerPage from "../Pages/LoginRegister/RegisterBuyerPage";
import RegisterOption from "../Pages/LoginRegister/RegisterOption";
import ReqDonasi from "../Pages/Owner/ReqDonasi"; 
import HistoryDonasiPage from "../Pages/Owner/HistoryDonasi"; 
import LaporanPage from "../Pages/Owner/Laporan"; 
import PegawaiGudangPage from "../Pages/PegawaiGudang/PegawaiGudangPage";

//Pembeli
import PembeliLayout from "../Layouts/PembeliLayouts";
import ProfilePembeliPage from "../Pages/Pembeli/ProfilePembeliPage";
import PembeliProductLayout from "../Layouts/PembeliContentLayouts";
import AlamatPembeliPage from "../Pages/Pembeli/AlamatPembeliProfilePage";
import PurchasePembeliPage from "../Pages/Pembeli/PurchasePembeliPage";
import ShopPage from "../Homepage/ShopPage";
import DetailBarangPage from "../Pages/Pembeli/DetailBarangPage";
import ListBarangPenitipPage from "../Pages/Pembeli/ListBarangPenitipPage";
import CartPage from "../Pages/Pembeli/CartPage";
import CheckoutPage from "../Pages/Pembeli/CheckoutPage";
import PaymentPage from "../Pages/Pembeli/PaymentPage";
import ListTransaksi from "../Pages/Pembeli/PurchasePembeliPage";

//Forgot Password
import ForgotPassword from "../Pages/LoginRegister/VerifyEmailPage";
import ResetPassword from "../Pages/LoginRegister/ResetPasswordPage";

//Organisasi
import OrganisasiLayout from "../Layouts/OrganisasiLayouts";
import RegisterOrganisasi from "../Pages/LoginRegister/RegisterOrganisasiPage";
import DaftarDonasiPage from "../Pages/Organisasi/DaftarDonasiPage";
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
import ExpiredProductPage from "../Pages/Penitip/ExpiredProductPage";
import DonatedProductPage from "../Pages/Penitip/DonatedProductPage";

//CS
import CSLayout from "../Layouts/CSLayouts";
import CSDiscussionPage from "../Pages/CustomerService/CSDiscussionPage";
import CSPenitipManagementPage from "../Pages/CustomerService/CSPenitipManagementPage";

// Owner
import OwnerLayouts from "../Layouts/OwnerLayouts";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/home",
        element: <PembeliLayout />,
        children: [
            {
                path: "/home",
                element: <Home />,
            },
        ],
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
            {
                path: "register-organisasi",
                element: (
                    <GuestOnlyRoute>
                        <RegisterOrganisasi />
                    </GuestOnlyRoute>
                ),
            },
            {
                path: "forgot-password",
                element: (
                    <GuestOnlyRoute>
                        <ForgotPassword />
                    </GuestOnlyRoute>
                ),
            },
            {
                path: "reset-password",
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
                    <OrganisasiLayout />
                </ProtectedRoutes>
        ),
        children: [
            {
                path: "daftar-donasi",
                element: (
                    <DaftarDonasiPage />
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
            {
                path: "",
                element: <PembeliProductLayout />,
                children: [
                  { path: "purchase", element: <PurchasePembeliPage />},    
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
              { path: "history", element: <SoldProductPage /> },
              { path: "on-sale", element: <OnSaleProductPage /> },
              { path: "expired", element: <ExpiredProductPage /> },
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
