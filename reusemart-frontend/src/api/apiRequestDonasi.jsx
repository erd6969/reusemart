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

export const ShowRequestDonasiByIdBarang = async (id_barang) => {
    try {
        const token = getToken();

        const response = await useAxios.get(`/request_donasi/show-by-id/${id_barang}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Show Request Donasi by ID Barang response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching request donasi by ID barang:", error);
        throw error;
    }
}

export const ShowWaitingRequestDonasi = async () => {
    try {
        const token = getToken();

        const response = await useAxios.get(`/request_donasi/show-waiting-request`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Show Waiting Request Donasi response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching waiting request donasi:", error);
        throw error;
    }
}

export const AcceptRequestDonasi = async (data) => {
    try {
        const token = getToken();

        const response = await useAxios.post(`/request_donasi/acceptRequest`, data, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Accept Request Donasi response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error accepting request donasi:", error);
        throw error;
    }
}