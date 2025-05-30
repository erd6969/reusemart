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

export const GetDetailDonasi = async (id_barang) => {
    try {
        const response = await useAxios.get(`/detail-donasi/${id_barang}`, {
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

export const ShowUnverifiedBarang = async () => {
    try {
        const response = await useAxios.get("/barang/show-unverified-barang", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`
            },
        });
        console.log("Unverified Barang response:", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching Unverified Barang:", error);
        throw error?.response?.data || error;
    }
}

export const ShowAmbilBarang = async (page = 1) => {
    try {
        const response = await useAxios.get(`/pegawai-gudang/show-ambil?page=${page}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`
            },
        });
        console.log("Unverified Barang response:", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching Unverified Barang:", error);
        throw error?.response?.data || error;
    }
}
export const ShowPengirimanBarang = async (page = 1) => {
    try {
        const response = await useAxios.get(`/pegawai-gudang/show-pengiriman?page=${page}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`
            },
        });
        console.log("Unverified Barang response:", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching Unverified Barang:", error);
        throw error?.response?.data || error;
    }
}

export const VerifAmbil = async (id_detail_transaksi_penitipan) => {
    try {
        const token = sessionStorage.getItem("token");
        
        const response = await useAxios.post(`/pegawai-gudang/verif-ambil`, {id_detail_transaksi_penitipan}, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
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
            message: error.response?.data?.message || "Terjadi kesalahan saat mengambil data.",
        };
    }
}

export const VerifKirimPembeli = async (formData) => {
    try {
        const token = sessionStorage.getItem("token");
        
        const response = await useAxios.post(`/pegawai-gudang/verif-kirim-pembeli`, formData, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
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
            message: error.response?.data?.message || "Terjadi kesalahan saat mengambil data.",
        };
    }
}

export const VerifAmbilPembeli = async (formData,id_komisi) => {
    try {
        const token = sessionStorage.getItem("token");
        
        const response = await useAxios.post(`/pegawai-gudang/verif-ambil-pembeli/${id_komisi}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
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
            message: error.response?.data?.message || "Terjadi kesalahan saat mengambil data.",
        };
    }
}

export const VerifyPengambilanPembeli = async (id_transaksi_pembelian) => {
    try {
        const token = sessionStorage.getItem("token");
        
        const response = await useAxios.post(`/pegawai-gudang/verif-pengambilan-pembeli`, {id_transaksi_pembelian}, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
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
            message: error.response?.data?.message || "Terjadi kesalahan saat mengambil data.",
        };
    }
}




export const SearchBarangVerif = async (search_barang) => {
    try {
      const response = await useAxios.get(`/pegawai-gudang/search-verif/${search_barang}`, {
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
export const SearchBarangPengiriman = async (search_barang) => {
    try {
      const response = await useAxios.get(`/pegawai-gudang/search-pengiriman/${search_barang}`, {
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


export const TambahRating = async (formData) => {
    try {
        const response = await useAxios.post("/pembeli/tambah-rating", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
                Authorization: `Bearer ${getToken()}`
            },
        });
        console.log("Tambah Rating response:", response);
        return response.data;
    } catch (error) {
        console.error("Error adding rating:", error);
        throw error?.response?.data || error;
    }
}
