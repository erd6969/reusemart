import useAxios from ".";

const getToken = () => {
    return sessionStorage.getItem("token");
};

export const ShowAllRequestDonasi = async (page = 1) => {
    try {
        const token = getToken();

        const response = await useAxios.get(`/request_donasi/show-all?page=${page}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        
        console.log("Show All Request Donasi response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching all request donasi:", error);
        throw error;
    }
}

export const SearchRequestDonasi = async (search_request_donasi) => {
    try {
        const token = getToken();

        const response = await useAxios.get(`/request_donasi/search/${search_request_donasi}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Search Request Donasi response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error searching request donasi:", error);
        throw error;
    }
}