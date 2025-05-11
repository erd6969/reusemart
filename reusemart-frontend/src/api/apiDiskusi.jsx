import useAxios from ".";

export const ShowDiskusi = async (id) => {
    try {
        const response = await useAxios.get(`/diskusi/${id}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching diskusi:", error);

        throw error?.response?.data || { message: "An error occurred while fetching the diskusi." };
    }
};

export const CreateDiskusi = async (data) => {
    try {
        const token = sessionStorage.getItem("token");
        if (!token) {
            throw new Error("Authorization token is missing.");
        }

        const response = await useAxios.post("/create-diskusi", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error creating diskusi:", error);

        throw error?.response?.data || { message: "An error occurred while creating the diskusi." };
    }
}

export const ShowDiskusiByDate = async () => {
    try{
        const token = sessionStorage.getItem("token");
        if (!token) {
            throw new Error("Authorization token is missing.");
        }

        const response = await useAxios.get("/penitip/show-diskusi-by-date", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching diskusi by date:", error);

        throw error?.response?.data || { message: "An error occurred while fetching the diskusi by date." };
    }
};

