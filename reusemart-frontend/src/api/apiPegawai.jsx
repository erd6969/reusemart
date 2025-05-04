import useAxios from ".";

const getToken = () => {
    return sessionStorage.getItem("token");
};

export const ResetPassword = async (id) => {
    try {
        const response = await useAxios.post(`/pegawai/reset-password/${id}`, {}, {
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

export const SearchPegawai = async (search_pegawai = "") => {
    try {
        const response = await useAxios.get(`/pegawai/search/${search_pegawai}`, {
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
}

