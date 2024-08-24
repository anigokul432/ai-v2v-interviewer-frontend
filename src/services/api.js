import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

const registerUser = (data) => api.post('/users/register', data);
const registerEnterprise = (data) => api.post('/enterprises/register', data);
const login = (data) => api.post('/token', data);

export default {
    registerUser,
    registerEnterprise,
    login,
};
