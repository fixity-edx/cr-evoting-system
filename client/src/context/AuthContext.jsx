import { createContext, useState, useEffect } from 'react';
import { getToken, setToken, removeToken, isTokenValid, getUserRole } from '../utils/token';
import { getMe } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = getToken();
            if (isTokenValid(token)) {
                try {
                    const { data } = await getMe();
                    setUser({ ...data.data, role: getUserRole() });
                } catch (error) {
                    console.error("Failed to load user", error);
                    removeToken();
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = (token, userData) => {
        setToken(token);
        setUser({ ...userData, role: getUserRole() });
    };

    const logout = () => {
        removeToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
