import useAxios from ".";

const getToken = () => {
    return sessionStorage.getItem("token");
};

export const AddPenitip = async (data) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await useAxios.post("/penitip/register", data, {
        headers: {
            "Content-Type": "multipart/form-data",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding penitip:", error);
      throw error?.response?.data || error;
    }
  };

export const ShowProfilePenitip = async () => {
    try {
        const token = sessionStorage.getItem("token");
        
        const response = await useAxios.get("/penitip/profile", {
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
            message: error.response?.data?.message || "Terjadi kesalahan saat mengambil data profil.",
        };
    }
};


export const ShowAllPenitip = async (page = 1) => {
    try {

        const response = await useAxios.get(`/penitip/show-all?page=${page}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
        });
        
        console.log("Show All Penitip response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching all Penitip:", error);
        throw error;
    }
};


export const SearchPenitip = async (search_penitip) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.get(`/penitip/search/${search_penitip}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Search Penitip response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error searching penitip:", error);
        throw error;
    }
};


export const DeletePenitip = async (id) => {
    try {

        const response = await useAxios.delete(`/penitip/delete/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting penitip:", error);
        throw error;
    }
};

export const UpdatePenitip = async (id, data) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.post(`/penitip/update/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Update Penitip response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating penitip:", error);
        throw error;
    }
};

export const ShowSoldProducts = async (page = 1) => {
    try {
        const token = sessionStorage.getItem("token");
        
        const response = await useAxios.get(`/penitip/show-sold-product?page=${page}`, {
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
            message: error.response?.data?.message || "Terjadi kesalahan saat mengambil data produk terjual.",
        };
    }
}
export const ShowOnSaleProducts = async (page = 1) => {
    try {
        const token = sessionStorage.getItem("token");
        
        const response = await useAxios.get(`/penitip/show-on-sale?page=${page}`, {
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
            message: error.response?.data?.message || "Terjadi kesalahan saat mengambil data produk terjual.",
        };
    }
}

export const extendBarang = async (id_detail_transaksi_penitipan) => {
    try {
        const token = sessionStorage.getItem("token");
        
        const response = await useAxios.post(`/penitip/extend-barang/`, {id_detail_transaksi_penitipan}, {
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

export const ambilBarang = async (id_barang) => {
    try {
        const token = sessionStorage.getItem("token");
        
        const response = await useAxios.post(`/penitip/ambil-barang/`, {id_barang}, {
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

export const ShowExtendProducts = async (page = 1) => {
    try {
        const token = sessionStorage.getItem("token");
        
        const response = await useAxios.get(`/penitip/show-extend-product?page=${page}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("data response:", response.data);
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
export const SearchBarangTerjual = async (search_barang) => {
    try {
      const response = await useAxios.get(`/penitip/search-terjual/${search_barang}`, {
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
export const SearchBarangJual = async (search_barang) => {
    try {
      const response = await useAxios.get(`/penitip/search-jual/${search_barang}`, {
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

export const SearchBarangExtend = async (search_barang) => {
    try {
      const response = await useAxios.get(`/penitip/search-extend/${search_barang}`, {
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

export const SearchBarangDonasi = async (search_barang) => {
    try {
      const response = await useAxios.get(`/penitip/search-donasi/${search_barang}`, {
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

export const ShowDonatedProduct = async (page = 1) => {
    try {
        const token = sessionStorage.getItem("token");
        
        const response = await useAxios.get(`/penitip/show-donated-product?page=${page}`, {
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




export const ShowDetailPendapatan = async (id) => {
    try {
        const token = sessionStorage.getItem("token");
        
        const response = await useAxios.get(`/penitip/show-detail-pendapatan/${id}`, {
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

export const SearchByEmail = async (search_penitip) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await useAxios.get(`/penitip/searchByEmail/${search_penitip}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Search Penitip response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error searching penitip:", error);
        throw error;
    }
}


export const GetDetailDonasiBarang = async (id_barang) => {
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