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
