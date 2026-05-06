import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Configure axios defaults
    axios.defaults.baseURL = 'http://localhost:3001';

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({ id: payload.sub, email: payload.email, role: payload.role });
            } catch (err) {
                logout();
            }
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        const res = await axios.post('/auth/login', { email, password });
        setToken(res.data.access_token);
        localStorage.setItem('token', res.data.access_token);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    const register = async (userData) => {
        await axios.post('/auth/register', userData);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
