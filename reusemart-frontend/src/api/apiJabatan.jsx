import useAxios from ".";

const getToken = () => {
    return sessionStorage.getItem("token");
};

export const ShowAllJabatan = async () => {
    try {
        const response = await useAxios.get(`/jabatan/show`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching jabatan data:", error);
        throw error?.response?.data || error;
    }
}