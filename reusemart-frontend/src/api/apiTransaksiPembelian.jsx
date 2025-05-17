import useAxios from ".";

const getToken = () => {
    return sessionStorage.getItem("token");
};

export const CreateTransaksiPembelian = async (data) => {
    try{
        const response = await useAxios.post("/pembeli/create-transaksi-pembelian", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    }catch (error) {
        console.error("Error creating transaksi pembelian:", error);
        throw error?.response?.data || error;
    }
}


export const getTransaksiPembelian = async () => {
    try{
        const response = await useAxios.get
        (`/pembeli/show-transaksi-pembelian`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching transaksi pembelian:", error);
        throw error?.response?.data || error;
    }
}
