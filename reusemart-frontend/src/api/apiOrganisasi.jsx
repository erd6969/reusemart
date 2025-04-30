import useAxios from ".";

export const RegisterOrganisasi = async (data) => {
    try {
        const response = await useAxios.post("/organisasi/register", data, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });
        console.log("Register Organisasi response:", response);
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
            message: error.response?.data?.message || "Terjadi kesalahan saat registrasi.",
        };
    }
}

export const ShowAllOrganisasi = async () => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.get("/organisasi/show-all", {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Show All Organisasi response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching all organisasi:", error);
        throw error;
    }
};

export const SearchOrganisasi = async (search_organisasi) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.get(`/organisasi/search/${search_organisasi}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Search Organisasi response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error searching organisasi:", error);
        throw error;
    }
}

