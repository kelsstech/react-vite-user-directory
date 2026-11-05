
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        () => localStorage.getItem('token')
    );

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!token) {
            setUser(null);
            return;
        }

        try {
            const payload = JSON.parse(
                atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
            );

            setUser({
                userId: payload.userId || payload.id || payload._id || null,
                role: payload.role || null
            });
        } catch {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
    }, [token]);

    const login = async (email, password) => {
        const response = await fetch(
            'http://localhost:3000/api/auth/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Login failed');
        }

        if (!data.token) {
            throw new Error('Backend did not return a JWT token.');
        }

        localStorage.setItem('token', data.token);
        setToken(data.token);

        setUser({
            email,
            userId: data.user?.id || data.user?.userId || null,
            role: data.user?.role || null
        });

        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: Boolean(token)
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
