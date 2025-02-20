const API_BASE = "/api/authentication";

export const getCSRF = async () => {
    try {
        const response = await fetch(`${API_BASE}/csrf/`, { credentials: "same-origin" });
        return response.headers.get("X-CSRFToken");
    } catch (error) {
        console.error("Error fetching CSRF token:", error);
        return null;
    }
};

export const getSession = async () => {
    try {
        const response = await fetch(`${API_BASE}/session/`, { credentials: "same-origin" });
        return response.json();
    } catch (error) {
        console.error("Error fetching session:", error);
        return { isAuthenticated: false };
    }
};

export const whoami = async () => {
    try {
        const response = await fetch(`${API_BASE}/whoami/`, {
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
        });
        return response.json();
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
};

export const login = async (username, password, csrfToken) => {
    try {
        const response = await fetch(`${API_BASE}/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            credentials: "same-origin",
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error("Invalid credentials");
        }

        return response.json();
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await fetch(`${API_BASE}/logout`, { credentials: "same-origin" });

        if (!response.ok) {
            throw new Error("Logout failed");
        }

        return response.json();
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
};
