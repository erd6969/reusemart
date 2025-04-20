import useAxios from ".";

export const RegisterPembeli = async (data) => {
    try {
        const response = await useAxios.post("/pembeli/register", data, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });
        console.log("Register Pembeli response:", response);
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
};

