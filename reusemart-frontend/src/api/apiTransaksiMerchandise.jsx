import useAxios from ".";

const getToken = () => {
    return sessionStorage.getItem("token");
};

export const ShowAllTransaksiMerchandise = async (page = 1) => {
    try {
        const token = getToken();

        const response = await useAxios.get(`/transaksi-merchandise/show-all?page=${page}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Show All Transaksi Merchandise response:", response);
        return response;
    } catch (error) {
        console.error("Error fetching all transaksi merchandise:", error);
        throw error;
    }
}

export const SetTransaksiMerchandise = async (formData) => {
    try {
        const token = getToken();

        const response = await useAxios.post(`/transaksi-merchandise/set-transaksi-merchandise`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Create Transaksi Merchandise response:", response);
        return response;
    } catch (error) {
        console.error("Error creating transaksi merchandise:", error);
        throw error;
    }
}