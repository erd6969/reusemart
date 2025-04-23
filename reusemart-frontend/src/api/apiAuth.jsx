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
    