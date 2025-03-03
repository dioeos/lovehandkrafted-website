export async function LoginUtil(email, password) {
    const response = await fetch("/api/authentication/dj-rest-auth/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"), // CSRF only
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Ensures cookies are sent
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    return response.json();
}

function getCookie(name) {
    const match = document.cookie.match(`(^|; )${name}=([^;]*)`);
    return match ? decodeURIComponent(match[2]) : null;
}
