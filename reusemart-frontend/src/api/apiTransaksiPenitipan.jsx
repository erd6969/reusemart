import useAxios from ".";

export const ShowTransaksiPenitipan = async (page = 1) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await useAxios.get(`/transaksi_penitipan/show-all?page=${page}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Show Transaksi Penitipan response:", response.data);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching all transaksi penitipan:", error);
        throw error;
    }
}

export const ShowTransaksiPenitipanById = async (id) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await useAxios.get(`/transaksi_penitipan/show-by-id/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Show Transaksi Penitipan By Id response:", response.data);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching By ID transaksi penitipan :", error);
        throw error;
    }
}

export const SearchByPenitip = async (search_penitip) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await useAxios.get(`/transaksi_penitipan/search/${search_penitip}`, {
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

export const CreateTransaksiPenitipan = async (formData) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await useAxios.post("/transaksi_penitipan/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Create Transaksi Penitipan response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating transaksi penitipan:", error);
        throw error;
    }
}

export const UpdateTransaksiPenitipan = async (formData, id) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await useAxios.post(`/transaksi_penitipan/update/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Update Transaksi Penitipan response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating transaksi penitipan:", error);
        throw error;
    }
}

export const ShowDataModal = async (id) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await useAxios.get(`/barang/show-detail-modal/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        console.log("Show Data Modal response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching data for modal:", error);
        throw error;
    }
}

export const VerifikasiTransaksiPenitipan = async (id) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await useAxios.post(`/transaksi-pembelian/verify-transaksi-pembelian`, {
            id_transaksi_pembelian: id
        }, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const TolakTransaksiPenitipan = async (id) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await useAxios.post(`/transaksi-pembelian/reject-transaksi-pembelian`, {
            id_transaksi_pembelian: id
        }, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const PreviewPdf = async (id_transaksi_penitipan) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await useAxios.get(`/transaksi-penitipan-pdf/${id_transaksi_penitipan}`, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/pdf',
        'Accept': 'application/pdf',
        'Authorization': `Bearer ${token}`,
      },
    });

    const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    window.open(fileURL, '_blank'); // open PDF preview in new tab

  } catch (error) {
    console.error('Gagal menampilkan PDF:', error.response.data.message || error.message);
    throw error?.response?.data || error;
  }
};



