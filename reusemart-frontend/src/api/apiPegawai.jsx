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
};

export const ShowAllPegawai = async (page=1) => {
    try {
        const response = await useAxios.get(`/pegawai/show-all?page=${page}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching pegawai data:", error);
        throw error?.response?.data || error;
    }
};

export const DeletePegawai = async (id) => {
    try {
        const response = await useAxios.delete(`/pegawai/delete/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting pegawai:", error);
        throw error?.response?.data || error;
    }
};

export const EditPegawai = async (id, data) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.post(`/pegawai/update/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Edit Pegawai response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error editing pegawai:", error);
        throw error;
    }
};

export const CreatePegawai = async (data) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.post("/pegawai/register", data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Create Pegawai response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating pegawai:", error);
        throw error;
    }
}

export const GetProfile = async () => {
    try {
        const response = await useAxios.get("/pegawai/show-profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching profile", error);
        throw error?.response?.data || error;
      }
};

export const SearchPegawaiByNama = async (search_pegawai) => {
    try {
        const response = await useAxios.get(`/pegawai-gudang/searchPegawai/${search_pegawai}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error searching pegawai:", error);
        throw error?.response?.data || error;
    }
}
