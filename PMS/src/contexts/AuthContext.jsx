import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            setLoading(false);
        };
        
        checkAuth();
    }, []);

    const signIn = async (email, password) => {
        const authUser = await loginUser(email, password);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        return currentUser;
    };

    const signUp = async (name, email, password, role) => {
        const newUser = await registerUser(name, email, password, role);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        return currentUser;
    };

    const signOut = async () => {
        await logoutUser();
        setUser(null);
    };

    const value = {
        user,
        loading,
        signIn,
        signUp,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}