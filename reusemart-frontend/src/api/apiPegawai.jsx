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

export const GetListKurir = async () => {
    try {
        const response = await useAxios.get("/pegawai-gudang/get-kurir", {
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

// -------------------------- Laporan Owner  -------------------------- //

export const GetLaporanDonasi = async (bulanTahun) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await useAxios.get(`/laporan-donasi/${bulanTahun}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/pdf",
                "Authorization": `Bearer ${token}`,
            },
            responseType: 'blob',
        });

        const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        return fileURL;
    } catch (error) {
        console.error("Error fetching laporan donasi", error);
        return null;
    }
};

export const GetLaporanRequestDonasi = async () => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await useAxios.get(`/laporan-request-donasi`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/pdf",
                "Authorization": `Bearer ${token}`,
            },
            responseType: 'blob',
        });

        const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        return fileURL;
    } catch (error) {
        console.error("Error fetching laporan request donasi", error);
        return null;
    }
};
export const GetLaporanBarangHabis = async () => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await useAxios.get(`/laporan-barang-habis`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/pdf",
                "Authorization": `Bearer ${token}`,
            },
            responseType: 'blob',
        });

        const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        return fileURL;
    } catch (error) {
        console.error("Error fetching laporan barang penitipan habis", error);
        return null;
    }
};

export const GetLaporanTransaksiPenitip = async (id_penitip, bulanTahun) => {
    try {
        const token = sessionStorage.getItem("token");
         const response = await useAxios.get(`/laporan-transaksi-penitip/${id_penitip}/${bulanTahun}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/pdf",
                "Authorization": `Bearer ${token}`,
            },
            responseType: 'blob',
        });

        const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        return fileURL;
    } catch (error) {
        console.error("Error fetching laporan transaksi penitip", error);
        return null;
    }
};

export const GetLaporanPenjualanKeseluruhan = async (tahun) => {
    try {
        const token = sessionStorage.getItem("token");
         const response = await useAxios.get(`/laporan-penjualan-keseluruhan/${tahun}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/pdf",
                "Authorization": `Bearer ${token}`,
            },
            responseType: 'blob',
        });

        const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        return fileURL;
    } catch (error) {
        console.error("Error fetching laporan penjualan keseluruhan", error);
        return null;
    }
};

export const GetLaporanKomisiBulanan = async (bulanTahun) => {
    try {
        const token = sessionStorage.getItem("token");
         const response = await useAxios.get(`/laporan-komisi-bulanan/${bulanTahun}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/pdf",
                "Authorization": `Bearer ${token}`,
            },
            responseType: 'blob',
        });

        const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        return fileURL;
    } catch (error) {
        console.error("Error fetching laporan Komisi", error);
        return null;
    }
};

export const GetLaporanStokGudang = async () => {
    try {
        const token = sessionStorage.getItem("token");
         const response = await useAxios.get(`/laporan-stok-gudang`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/pdf",
                "Authorization": `Bearer ${token}`,
            },
            responseType: 'blob',
        });

        const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        return fileURL;
    } catch (error) {
        console.error("Error fetching laporan Stok Gudang", error);
        return null;
    }
};

export const GetLaporanKategori = async (tahun) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await useAxios.get(`/laporan-kategori/${tahun}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/pdf",
                "Authorization": `Bearer ${token}`,
            },
            responseType: 'blob',
        });

        const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        return fileURL;
    } catch (error) {
        console.error("Error fetching laporan kategori penjualan", error);
        return null;
    }
};

