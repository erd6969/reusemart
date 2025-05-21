import useAxios from ".";

const getToken = () => {
    return sessionStorage.getItem("token");
};

export const CreateTransaksiPembelian = async (data) => {
    try{
        const response = await useAxios.post("/pembeli/create-transaksi-pembelian", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    }catch (error) {
        console.error("Error creating transaksi pembelian:", error);
        throw error?.response?.data || error;
    }
}


export const getTransaksiPembelian = async () => {
    try{
        const response = await useAxios.get
        (`/pembeli/show-transaksi-pembelian`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching transaksi pembelian:", error);
        throw error?.response?.data || error;
    }
}

export const CancelTransaksi = async (data) => {
    try {
        const response = await useAxios.post("/pembeli/cancel-transaksi-pembelian", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error cancelling transaksi pembelian:", error);
        throw error?.response?.data || error;
    }
};

export const FinalizeTransaksi = async (data) => {
    try {
        const response = await useAxios.post("/pembeli/finalize-transaksi-pembelian", data, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error finalizing transaksi pembelian:", error);
        throw error?.response?.data || error;
    }
};

export const PreviewPdfTransaksiPembelian= async (id_transaksi_pembelian) => {
  try {
    const response = await useAxios.get(`/transaksi-pembelian-pdf/${id_transaksi_pembelian}`, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/pdf',
        'Accept': 'application/pdf',
        'Authorization': `Bearer ${getToken()}`,
      },
    });

    const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    window.open(fileURL, '_blank'); 
  } catch (error) {
    console.error('Gagal menampilkan PDF:', error);
  }
};




