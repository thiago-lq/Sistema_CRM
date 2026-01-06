import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    } else {
        console.log('Nenhum token encontrado');
    }
    return config;
})

export default api;