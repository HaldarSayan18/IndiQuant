export function saveToken(token) {
    localStorage.setItem('token', token);

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleString();
    document.cookie = `token=${token}; expires=${expires}; path=/;`
};

export function getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
};

export function removeToken() {
    localStorage.removeItem('token');

    // remove cookie by setting expiry in past
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
};

export function getUser() {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.expires * 1000 < Date.now()) {
            removeToken();
            return null;
        }
        return payload;
    } catch (error) {
        return null;
    }
};