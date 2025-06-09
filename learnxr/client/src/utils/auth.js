export const getToken = () => {
    return localStorage.getItem("token");
};

export const setToken = (token) => {
    localStorage.setItem("token", token);
};

export const setTokenExpiration = (expiresIn) => {
    const expirationTime = new Date().getTime() + expiresIn * 1000;
    localStorage.setItem("tokenExpiration", expirationTime.toString());
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("user");
};

export const isAuthenticated = () => {
    const token = getToken();
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

export const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
};

export const getAuthHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}; 