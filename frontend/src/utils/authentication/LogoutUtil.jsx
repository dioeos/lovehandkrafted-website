import api from "../lib/api";

export async function LogoutUtil() {
    try {
        await api.post("/authentication/dj-rest-auth/logout")
    } catch (error) {
        console.error("Logout failed:", error);
    }
}