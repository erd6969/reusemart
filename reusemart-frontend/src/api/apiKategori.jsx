import useAxios from ".";

const getToken = () => {
    return sessionStorage.getItem("token");
};


export const SearchKategori = async (search) => {
    try {
        const response = await useAxios.get(`/kategori/search/${search}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                Authorization: `Bearer ${getToken()}`
            },
        });
        console.log("Kategori request response:", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching Kategori request:", error);
        throw error?.response?.data || error;
    }
}