import useAxios from ".";

const getToken = () => {
    return sessionStorage.getItem("token");
};


export const AddRequestDonasi = async (data) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await useAxios.post("/organisasi/create-req", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding request donasi:", error);
      throw error?.response?.data || error;
    }
}

export const UpdateRequestDonasi = async (id_request_donasi, data) => {
    const token = sessionStorage.getItem("token");

    try {
        const response = await useAxios.post(`/organisasi/update-req/${id_request_donasi}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Edit Request response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error editing request:", error);
        throw error;
    }
}
export const SearchRequestHistory = async (search_request_donasi) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.get(`/organisasi/search-histo-req/${search_request_donasi}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Search request response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error searching request:", error);
        throw error;
    }
}


export const SearchRequest = async (search_request_donasi) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.get(`/organisasi/search-req/${search_request_donasi}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Search request response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error searching request:", error);
        throw error;
    }
}

export const DeleteRequest= async (id) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.delete(`/organisasi/delete-req/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Delete request response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting request:", error);
        throw error;
    }
}

export const GetProfile = async () => {
    try {
        const response = await useAxios.get("/organisasi/show-profile", {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching profile", error);
        throw error?.response?.data || error;
      }
};
export const RegisterOrganisasi = async (data) => {
    try {
        const response = await useAxios.post("/organisasi/register", data, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });
        console.log("Register Organisasi response:", response);
        return response.data;
    } catch (error) {
        const status = error.response?.status;

        if (status === 422 && error.response?.data?.errors) {
            throw {
                type: "validation",
                errors: error.response.data.errors,
            };
        }

        throw {
            type: "general",
            message: error.response?.data?.message || "Terjadi kesalahan saat registrasi.",
        };
    }
}

export const ShowWaitingRequestById = async () => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.get("/organisasi/show-waiting", {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Show Waiting Request by ID response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching waiting request by ID:", error);
        throw error;
    }
}

export const ShowHistoryRequestById = async () => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.get("/organisasi/show-history", {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        
        console.log("Show History Request by ID response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching history request by ID:", error);
        throw error;
    }
}

export const ShowAllOrganisasi = async (page = 1) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.get(`/organisasi/show-all?page=${page}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        
        console.log("Show All Organisasi response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching all organisasi:", error);
        throw error;
    }
};

export const SearchOrganisasi = async (search_organisasi) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.get(`/organisasi/search/${search_organisasi}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Search Organisasi response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error searching organisasi:", error);
        throw error;
    }
}

export const DeleteOrganisasi = async (id) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.delete(`/organisasi/delete/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Delete Organisasi response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting organisasi:", error);
        throw error;
    }
}

export const EditOrganisasi = async (id, data) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.post(`/organisasi/update/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Edit Organisasi response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error editing organisasi:", error);
        throw error;
    }
}

