import useAxios from ".";

export const ShowDTPByIdTransaksiPenitipan = async (id) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await useAxios.get(`/detail_transaksi_penitipan/showByIdTP/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Show Detail Transaksi Penitipan By Id response:", response.data.data);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching By ID transaksi penitipan :", error);
        throw error;
    }
}

export const DeleteWithBarang = async (id) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await useAxios.delete(`/detail_transaksi_penitipan/deleteWithBarang/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Delete Detail Transaksi Penitipan response:", response.data);
        return response.data;
    }
    catch (error) {
        console.error("Error deleting Detail Transaksi Penitipan:", error);
        throw error;
    }
}