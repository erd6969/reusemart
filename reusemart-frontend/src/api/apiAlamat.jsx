import useAxios from ".";

const getToken = () => {
    return sessionStorage.getItem("token");
};

// Ambil semua alamat
export const GetAllAlamat = async () => {
  try {
    const response = await useAxios.get("/pembeli/show-alamat", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching address:", error);
    throw error?.response?.data || error;
  }
};

// Ubah alamat utama
export const ChangeMainAlamat = async (id) => {
  try {
    const response = await useAxios.put(`/pembeli/change-alamat-utama/${id}`, {}, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error changing main address:", error);
    throw error?.response?.data || error;
  }
};

// Tambah alamat
export const AddAlamat = async (data) => {
  try {
    const response = await useAxios.post("/pembeli/create-alamat", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding address:", error);
    throw error?.response?.data || error;
  }
};

// Edit alamat
export const EditAlamat = async (id, data) => {
  try {
    const response = await useAxios.put(`/pembeli/update-alamat/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error editing address:", error);
    throw error?.response?.data || error;
  }
};

// Cari alamat
export const SearchAlamat = async (search_alamat) => {
  try {
    const response = await useAxios.get(`/pembeli/search-alamat/${search_alamat}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching address:", error);
    throw error?.response?.data || error;
  }
};

// Hapus alamat
export const DeleteAlamat = async (id) => {
  try {
    const response = await useAxios.delete(`/pembeli/delete-alamat/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error?.response?.data || error;
  }
};

export const GetAlamatUtama = async () => {
  try {
    const response = await useAxios.get("/pembeli/get-alamat-utama", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching main address:", error);
    throw error?.response?.data || error;
  }
}

export const GetAlamatById = async (id) => {
  try {
    const response = await useAxios.get(`/pembeli/get-alamat-by-id/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching address by ID:", error);
    throw error?.response?.data || error;
  }
}

export const GetKabupaten = async () => {
  try {
    const response = await useAxios.get("/get-kabupaten", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching kabupaten:", error);
    throw error?.response?.data || error;
  }
}

export const GetKecamatan = async (kabupatenId) => {
  try {
    const response = await useAxios.get(`/get-kecamatan/${kabupatenId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching kecamatan:", error);
    throw error?.response?.data || error;
  }
}

export const GetKelurahan = async (kecamatanId) => {
  try {
    const response = await useAxios.get(`/get-kelurahan/${kecamatanId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching kelurahan:", error);
    throw error?.response?.data || error;
  }
}
