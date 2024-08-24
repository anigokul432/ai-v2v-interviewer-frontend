import axios, { AxiosInstance, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
});

// Define interfaces for the data being sent to the API
interface UserData {
    username: string;
    password: string;
    [key: string]: any; // This allows for additional fields
}

interface EnterpriseData {
    username: string;
    password: string;
    [key: string]: any; // This allows for additional fields
}

interface LoginData {
    username: string;
    password: string;
}

// Define types for the API response (adjust based on your API's actual response structure)
type ApiResponse<T> = Promise<AxiosResponse<T>>;

const registerUser = (data: LoginData): Promise<AxiosResponse<any>> => api.post('/users/register', data);
const registerEnterprise = (data: LoginData): Promise<AxiosResponse<any>> => api.post('/enterprises/register', data);
const login = (data: FormData): Promise<AxiosResponse<any>> => {
    // Check the data structure before sending it
    console.log('Login data being sent:', data);
    return api.post('/token', data);
};

export default {
    registerUser,
    registerEnterprise,
    login,
};
