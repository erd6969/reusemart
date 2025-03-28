import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "../Homepage/Homepage";
import AdminPage from "../Pages/Admin/AdminPage";
import CSPage from "../Pages/CustomerService/CSPage";
import LoginPage from "../Pages/LoginRegister/LoginPage";
import DaftarDonasiPage from "../Pages/Organisasi/DaftarDonasi";
import OwnerPage from "../Pages/Owner/OwnerPage";
import PegawaiGudangPage from "../Pages/PegawaiGudang/PegawaiGudangPage";
import ProfilePembeliPage from "../Pages/Pembeli/ProfilePembeliPage";
import ProfilePenitipPage from "../Pages/Penitip/ProfilePenitipPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
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
    },
    {
        path: "/pegawai-gudang",
        element: <PegawaiGudangPage />,
    },
    {
        path: "/pembeli",
        element: <div>Pembeli Page</div>,
        children: [
            {
                path: "profile",
                element: <ProfilePembeliPage />,
            },
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
