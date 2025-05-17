import useAxios from ".";

const getToken = () => {
    return sessionStorage.getItem("token");
};

export const CreateKomisi = async (id_barang, payload) => {
  try {
    const response = await useAxios.post(`/pembeli/create-komisi/${id_barang}`, payload, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });

    return response.data;
  } catch (error) {
    console.error('Gagal membuat komisi:', error);
    throw error;
  }
};

// export const GetKomponenKomisi = async (id_barang) => {
//   try {
//     const response = await useAxios.get(`/pembeli/get-komponen-komisi/${id_barang}`, {
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${getToken()}`,
//         },
//     });

//     return response.data; // objek { komisi_hunter, komisi_reusemart, bonus_penitip }
//   } catch (error) {
//     console.error('Gagal mengambil komponen komisi:', error);
//     throw error;
//   }
// };