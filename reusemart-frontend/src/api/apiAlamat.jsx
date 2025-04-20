import useAxios from ".";

export const GetAllAlamat = async () => {
    try {
        const response = await useAxios.get("/pembeli/show-alamat", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer 6|BNr8C7LePAA4aPzDEyc15MPFcuSBNMicT3k8JWHra16c5ea6`
            },
        });
        console.log("Alamat response:", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching address:", error);
        throw error?.response?.data || error;
    }
}

export const ChangeMainAlamat = async (id) => {
    try {
        const response = await useAxios.put(`/pembeli/change-alamat-utama/${id}`, {}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer 6|BNr8C7LePAA4aPzDEyc15MPFcuSBNMicT3k8JWHra16c5ea6`
            },
        });
        console.log("Change main address response:", response);
        return response.data;
    } catch (error) {
        console.error("Error changing main address:", error);
        throw error?.response?.data || error;
    }
}

export const AddAlamat = async (data) => {
    try {
        const response = await useAxios.post("/pembeli/create-alamat", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer 6|BNr8C7LePAA4aPzDEyc15MPFcuSBNMicT3k8JWHra16c5ea6`
            },
        });
        console.log("Add address response:", response);
        return response.data;
    } catch (error) {
        console.error("Error adding address:", error);
        throw error?.response?.data || error;
    }
}

export const EditAlamat = async (id, data) => {
    try {
        const response = await useAxios.put(`/pembeli/update-alamat/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer 6|BNr8C7LePAA4aPzDEyc15MPFcuSBNMicT3k8JWHra16c5ea6`
            },
        });
        console.log("Edit address response:", response);
        return response.data;
    } catch (error) {
        console.error("Error editing address:", error);
        throw error?.response?.data || error;
    }
}

export const SearchAlamat = async (search_alamat) => {
    try {
        const response = await useAxios.get(`/pembeli/search-alamat/${search_alamat}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer 6|BNr8C7LePAA4aPzDEyc15MPFcuSBNMicT3k8JWHra16c5ea6`
            },
        });
        console.log("Search address response:", response);
        return response.data;
    } catch (error) {
        console.error("Error searching address:", error);
        throw error?.response?.data || error;
    }
};

export const DeleteAlamat = async (id) => {
    try {
        const response = await useAxios.delete(`/pembeli/delete-alamat/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer 6|BNr8C7LePAA4aPzDEyc15MPFcuSBNMicT3k8JWHra16c5ea6`
            },
        });
        console.log("Delete address response:", response);
        return response.data;
    } catch (error) {
        console.error("Error deleting address:", error);
        throw error?.response?.data || error;
    }
}

