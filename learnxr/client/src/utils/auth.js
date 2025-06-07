export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const expirationTime = localStorage.getItem("tokenExpiration");
    
    if (!token || !expirationTime) {
        return false;
    }

    // Check if token has expired
    const currentTime = new Date().getTime();
    if (currentTime > parseInt(expirationTime)) {
        // Token has expired, clear storage
        logout();
        return false;
    }

    return true;
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiration");
};

export const getAuthHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}; 