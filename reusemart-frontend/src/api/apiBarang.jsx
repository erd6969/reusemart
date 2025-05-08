import useAxios from ".";

const getToken = () => {
    return sessionStorage.getItem("token");
};


export const GetAllBarang = async () => {
    try {
        const response = await useAxios.get("/shop-page", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer 6|BNr8C7LePAA4aPzDEyc15MPFcuSBNMicT3k8JWHra16c5ea6`
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
                Authorization: `Bearer 6|BNr8C7LePAA4aPzDEyc15MPFcuSBNMicT3k8JWHra16c5ea6`
            },
        });
        console.log("Barang by kategori response:", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching Barang by kategori:", error);
        throw error?.response?.data || error;
    }
}

export const GetDetailBarang = async (id_barang) => {
    try {
        const response = await useAxios.get(`/detail-barang/${id_barang}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer 6|BNr8C7LePAA4aPzDEyc15MPFcuSBNMicT3k8JWHra16c5ea6`
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
          Authorization: `Bearer 6|BNr8C7LePAA4aPzDEyc15MPFcuSBNMicT3k8JWHra16c5ea6`
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching Barang:", error);
      throw error?.response?.data || error;
    }
  };

