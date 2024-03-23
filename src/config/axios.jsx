import axios from 'axios';

const ClienteAxios =  axios.create({
    baseURL : 'http://localhost:8888'
});
export default ClienteAxios;