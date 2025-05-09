import useAxios from ".";

const getToken = () => {
    return sessionStorage.getItem("token");
};


const getRole = () => {
    return sessionStorage.getItem("role");
};

export const ShowAcceptRejectRequestDonasi = async (page = 1) => {
    try {
        const token = getToken();

        const response = await useAxios.get(`/request_donasi/show-accept-reject?page=${page}`, {
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

export const SearchRequestDonasiWaiting = async (search_request_donasi) => {
    try {
        const token = getToken();

        const response = await useAxios.get(`/request_donasi/searchWaiting/${search_request_donasi}`, {
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

export const SearchRequestDonasiDiterimaDitolak = async (search_request_donasi) => {
    try {
        const token = getToken();

        const response = await useAxios.get(`/request_donasi/searchDiterimaDitolak/${search_request_donasi}`, {
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

        const response = await useAxios.post(`/request_donasi/acceptRequest_donasi`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Accept Request Donasi response:", response.data);
        return response.data;
    } catch (error) {
        console("ERORRR ", error.response.data);
        console.error("Error accepting request donasi:", error);
        throw error;
    }
}

export const RejectRequestDonasi = async (data) => {
    try {
        const token = getToken();

        const response = await useAxios.post(`/request_donasi/rejectRequest`, data, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Reject Request Donasi response:", response.data);
        return response.data;
    } catch (error) {
        console.log("Role dan token:", getRole());
        console.error("Error Rejecting request donasi:", error);
        throw error;
    }
}

export const ShowBarangByOpenDonasi = async (page = 1) => {
    try {
        const token = getToken();

        const response = await useAxios.get(`/request_donasi/show-barang-open-donasi?page=${page}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Show Barang By Open Donasi response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching barang by open donasi:", error);
        throw error;
    }
}

export const SearchBarangByOpenDonasi = async (search_barang) => {
    try {
        const token = getToken();

        const response = await useAxios.get(`/request_donasi/searchBarangOpenDonasi/${search_barang}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Search Barang By Open Donasi response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error searching barang by open donasi:", error);
        throw error;
    }
}

export const UpdateRequestDanTransaksiDonasi = async (data) => {
    try {
        const token = getToken();

        const response = await useAxios.post(`/request_donasi/updateRequest-Transaksi-Donasi`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Update Request Dan Transaksi Donasi response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating request dan transaksi donasi:", error);
        throw error;
    }
}