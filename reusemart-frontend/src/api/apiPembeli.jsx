import useAxios from ".";

const getToken = () => {
    return sessionStorage.getItem("token");
};

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

export const GetProfile = async () => {
    try {
        const response = await useAxios.get("/pembeli/show-profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching profile", error);
        throw error?.response?.data || error;
      }
};

export const ShowHistoryPurchase = async (page = 1) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.get(`/pembeli/show-history-purchase?page=${page}`, {
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
            message: error.response?.data?.message || "Terjadi kesalahan saat mengambil data produk terjual.",
        };
    }
}


export const AddPoint = async (data) => {
    try {
        const token = sessionStorage.getItem("token");
        
        const response = await useAxios.post(
            `/pembeli/add-point/${data}`,
            {},
            {
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
            message: error.response?.data?.message || "Terjadi kesalahan saat mengupdate point.",
        };
    }
}

export const ReducePoint = async (data) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.post(
            `/pembeli/reduce-point/${data}`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }
        );
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
            message: error.response?.data?.message || "Terjadi kesalahan saat mengupdate point.",
        };
    }
};

export const ShowUnpaidPurchase = async (page = 1) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.get(`/pembeli/show-unpaid-purchase?page=${page}`, {
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
            message: error.response?.data?.message || "Terjadi kesalahan saat mengambil data produk terjual.",
        };
    }
}

export const ShowVerificationPurchase = async (page = 1) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.get(`/pembeli/show-verification-purchase?page=${page}`, {
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
            message: error.response?.data?.message || "Terjadi kesalahan saat mengambil data produk terjual.",
        };
    }
}
