import useAxios from ".";

const getToken = () => {
    return sessionStorage.getItem("token");
};


export const CreateBarang = async (formData) => {
    try {
        const response = await useAxios.post("/barang/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
                Authorization: `Bearer ${getToken()}`
            },
        });
        console.log("Create Barang response:", response);
        return response.data;
    } catch (error) {
        console.error("Error creating Barangssss:", error.response.data);
        throw error?.response?.data || error;
    }
}

export const EditBarang = async (formData) => {
    try {
        const response = await useAxios.post("/barang/update", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
                Authorization: `Bearer ${getToken()}`
            },
        });
        console.log("Edit Barang response:", response);
        return response.data;
    } catch (error) {
        console.error("Error editing Barang:", error.response.data);
        throw error?.response?.data || error;
    }
}


export const GetAllBarang = async () => {
    try {
        const response = await useAxios.get("/shop-page", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`
            },
        });
        console.log("Barang response:", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching Barang:", error);
        throw error?.response?.data || error;
    }
}

export const GetAllBarangRequest = async () => {
    
    try {
        const response = await useAxios.get("/show-request-barang", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`
            },
        });
        console.log("Barang request response:", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching Barang request:", error);
        throw error?.response?.data || error;
    }
}

export const GetAllBarangByCategory = async (kategori) => {
    try {
        const response = await useAxios.get(`/shop-page/${kategori}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`
            },
        });
        console.log("Barang by kategori response:", response);
        return response.data;
    } catch (response) {
        console.error("Error fetching Barang by kategori:", response.message);
        throw error?.response?.data || error;
    }
}

export const GetDetailBarang = async (id_barang) => {
    try {
        const response = await useAxios.get(`/detail-barang/${id_barang}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`
            },
        });
        console.log("Detail Barang response:", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching Detail Barang:", error);
        throw error?.response?.data || error;
    }
}

// Cari barang
export const SearchBarang = async (search_barang) => {
    try {
      const response = await useAxios.get(`/shop-page/search-barang/${search_barang}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching Barang:", error);
      throw error?.response?.data || error;
    }
  };

