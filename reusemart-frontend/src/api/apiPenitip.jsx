import useAxios from ".";

export const ShowProfilePenitip = async () => {
    try {
        const token = sessionStorage.getItem("token");
        
        const response = await useAxios.get("/penitip/profile", {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
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
            message: error.response?.data?.message || "Terjadi kesalahan saat mengambil data profil.",
        };
    }
};
