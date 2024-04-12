import axios from 'axios';
const ClienteAxios = axios.create({
    baseURL: 'http://localhost:8888'
});

ClienteAxios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        localStorage.removeItem('token')
        return Promise.reject(error);
    }
);

export default ClienteAxios;
