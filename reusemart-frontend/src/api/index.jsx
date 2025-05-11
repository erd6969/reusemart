import axios from "axios";

export const BASE_URL = "http://127.0.0.1:8000";

export const getThumbnail = (thumbnail) => {
    return `${BASE_URL}/storage/img/${thumbnail}`;
}

export const getThumbnailPembeli = (thumbnail) => {
    return `${BASE_URL}/storage/img/Pembeli/${thumbnail}`;
}

export const getThumbnailPenitip = (thumbnail) => {
    return `${BASE_URL}/storage/img/Penitip/${thumbnail}`;
}

export const getThumbnailOwner = (thumbnail) => {
    return `${BASE_URL}/storage/img/Owner/${thumbnail}`;
}

export const getThumbnailAdmin = (thumbnail) => {
    return `${BASE_URL}/storage/img/Admin/${thumbnail}`;
}

export const getThumbnailGudang = (thumbnail) => {
    return `${BASE_URL}/storage/img/Gudang/${thumbnail}`;
}

export const getThumbnailCS = (thumbnail) => {
    return `${BASE_URL}/storage/img/CS/${thumbnail}`;
}

export const getThumbnailOrganisasi = (thumbnail) => {
    return `${BASE_URL}/storage/img/Organisasi/${thumbnail}`;
}

export const getThumbnailBarang = (thumbnail) => {
    return `${BASE_URL}/storage/img/Barang/${thumbnail}`;
}

export const getThumbnailMerchandise = (thumbnail) => {
    return `${BASE_URL}/storage/img/Merchandise/${thumbnail}`;
}

export const getThumbnailComponents = (thumbnail) => {
    return `${BASE_URL}/storage/img/Components/${thumbnail}`;
}





export const GetProfilePembeli = (thumbnail) => {
    return `${BASE_URL}/storage/img/${thumbnail}`;
}

export const GetProfilePenitip = (thumbnail) => {
    return `${BASE_URL}/storage/${thumbnail}`;
}

const useAxios = axios.create({
    baseURL : `${BASE_URL}/api`,
});

export default useAxios;