import useAxios from ".";

export const Login = async (data) => {
    try {
        const response = await useAxios.post("/login", data, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        const { message, token, role } = response.data;

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);

        console.log("Login response:", message);

        return response.data;

    } catch (error) {
        const status = error.response?.status;

        if (status === 422 && error.response?.data?.errors) {
            throw {
                type: "validation",
                errors: error.response.data.errors,
            };
        }

        throw {
            type: "general",
            message: error.response?.data?.message || "Terjadi kesalahan saat login.",
        };
    }
};

export const Logout = async () => {
    try {
        const response = await useAxios.post("/logout", {}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");

        return response.data;
    } catch (error) {
        console.error("Error during logout:", error);
        throw error?.response?.data || error;
    }
};

// Fungsi untuk mengirimkan email konfirmasi
export const sendKonfirmasiEmail = async (email, isPenitip = false, isOrganisasi = false) => {
    try {
        const response = await useAxios.post("/send-konfirmasi-email", {
            email: email,  // Kirimkan email
            isPenitip: isPenitip,  // Penentuan apakah penitip atau pembeli
            isOrganisasi: isOrganisasi  // Penentuan apakah organisasi atau bukan
        }, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        // Menambahkan pengecekan status respons
        if (response.status === 200 && response.data.success) {
            console.log("Email konfirmasi berhasil dikirim:", response.data.message);
            return response.data;
        } else {
            throw new Error(response.data.message || 'Gagal mengirim email konfirmasi.');
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat mengirimkan email konfirmasi.');
    }
};

export const ResetPassword = async ({ token, password, password_confirmation }) => {
    try {
        const response = await useAxios.post("/reset-password", {
            token,
            password,
            password_confirmation,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};
