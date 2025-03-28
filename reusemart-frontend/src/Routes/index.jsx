import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "../Homepage/Homepage";
import AdminPage from "../Pages/Admin/AdminPage";
import CSPage from "../Pages/Customer Service/CSPage";
import LoginPage from "../Pages/Login Register/LoginPage";
import DaftarDonasiPage from "../Pages/Organisasi/DaftarDonasi";
import OwnerPage from "../Pages/Owner/OwnerPage";
import PegawaiGudangPage from "../Pages/Pegawai Gudang/PegawaiGudangPage";
import ProfilePembeliPage from "../Pages/Pembeli/ProfilePembeliPage";
import ProfilePenitipPage from "../Pages/Penitip/ProfilePenitipPage";

const router = createBrowserRouter([
    {
        path: "*",
        element: <div>Routes Not Found!</div>,
    },
    {
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
            // {
            //     path: "/register",
            //     element: <RegisterPage />,
            // },
        ],
    },
    // {
    //     path: "/admin",
    //     element: (
    //         <div>
    //             test
    //         </div>
    //     ),
    //     children: [
    //         {
    //             path: "/admin",
    //             element: <AdminPage />,
    //         },
    //         // {
    //         //     path: "/admin/content",
    //         //     element: <ContentPage />,
    //         // },
    //         // {
    //         //     path: "/user/komentar/:id",
    //         //     element: <KomentarPage />,
    //         // }
    //     ],
    // },
    // {
    //     path: "/customerservice",
    //     element: (
    //         <div>
    //             test
    //         </div>
    //     ),
    //     children: [
    //         {
    //             path: "/customerservice",
    //             element: <CSPage />,
    //         },
            
    //     ],
    // },
    // {
    //     path: "/auth",
    //     element: (
    //         <div>
    //             test
    //         </div>
    //     ),
    //     children: [
    //         {
    //             path: "/auth/login",
    //             element: <LoginPage />,
    //         },
            
    //     ],
    // },
    // {
    //     path: "/organisasi",
    //     element: (
    //         <div>
    //             test
    //         </div>
    //     ),
    //     children: [
    //         {
    //             path: "/organisasi/daftar-donasi",
    //             element: <DaftarDonasiPage />,
    //         },
            
    //     ],
    // },
    // {
    //     path: "/owner",
    //     element: (
    //         <div>
    //             test
    //         </div>
    //     ),
    //     children: [
    //         {
    //             path: "/owner",
    //             element: <OwnerPage />,
    //         },
            
    //     ],
    // },
    // {
    //     path: "/pegawaigudang",
    //     element: (
    //         <div>
    //             test
    //         </div>
    //     ),
    //     children: [
    //         {
    //             path: "/pegawai-gudang",
    //             element: <PegawaiGudangPage />,
    //         },
            
    //     ],
    // },
    // {
    //     path: "/pembeli",
    //     element: (
    //         <div>
    //             test
    //         </div>
    //     ),
    //     children: [
    //         {
    //             path: "/pembeli/profile",
    //             element: <ProfilePembeliPage />,
    //         },
            
    //     ],
    // },
    // {
    //     path: "/penitip",
    //     element: (
    //         <div>
    //             test
    //         </div>
    //     ),
    //     children: [
    //         {
    //             path: "/penitip/profile",
    //             element: <ProfilePenitipPage />,
    //         },
            
    //     ],
    // },
    
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
