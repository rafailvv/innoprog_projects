import axios from "axios";

export const API_URL = 'https://projects.innoprog.ru/api/lite';

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
    headers: {
        "accept": "application/json",
    }
})

$api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(!token) return config
    config.headers.Authorization = `Bearer ${token}`
    return config
})

export default $api;