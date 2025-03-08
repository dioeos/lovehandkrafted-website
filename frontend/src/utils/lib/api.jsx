/**
 * Source for authenticated api calls. Requires JWT access token + CSRF token 
 */

import axios from 'axios';

const apiUrl = "/choreo-apis/awbo/backend/rest-api-be2/v1.0";

function getCookie(name) {
    const match = document.cookie.match(`(^|; )${name}=([^;]*)`);
    return match ? decodeURIComponent(match[2]) : null;
}


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
    withCredentials: true, //ensures JWT & CSRF cookies are sent
    headers: { "Content-Type": "application/json"},
});

api.interceptors.request.use(
    (config) => {
        const csrfToken = getCookie("csrftoken");
        if (csrfToken) {
            config.headers["X-CSRFToken"] = csrfToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default api;