import useAxios from ".";

const getToken = () => {
    return sessionStorage.getItem("token");
};

export const SearchHunter = async (search_hunter = "") => {
    try {
        const response = await useAxios.get(`/hunter/search/${search_hunter}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error searching pegawai:", error);
        throw error?.response?.data || error;
    }
};

export const ResetPasswordHunter = async (id) => {
    try {
        const response = await useAxios.post(`/hunter/reset-password/${id}`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error resetting password:", error);
        throw error?.response?.data || error;
    }
};