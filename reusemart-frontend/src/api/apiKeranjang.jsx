import useAxios from ".";

const getToken = () => {
    return sessionStorage.getItem("token");
};

export const AddToCart = async (id_barang) => {
    try {
        const response = await useAxios.post(
        `/pembeli/add-to-cart/${id_barang}`,
        {}, // Data body kosong (jika tidak ada data dikirim)
        {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
            },
        }
        );
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error?.response?.data || error;
    }
};
  

export const ShowCart = async () => {
    try {
        const response = await useAxios.get(`/pembeli/show-cart`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        });

        // Validasi jika response.data.data adalah array
        const groupedCart = response.data?.data || [];

        return groupedCart;

    } catch (error) {
        console.error("Error fetching cart data:", error);
        throw error?.response?.data || error;
    }
};
  
export const DeleteCartItem = async (id_keranjang) => {
    try {
        const response = await useAxios.delete(`/pembeli/delete-cart/${id_keranjang}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting cart item:", error);
        throw error?.response?.data || error;
    }
}
