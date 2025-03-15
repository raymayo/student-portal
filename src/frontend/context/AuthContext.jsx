import { createContext, useState, useEffect } from "react";
import React from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    // Load user data when token changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
            setUser(null);
        }
    }, [token]);

    // Login function
    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("token");
    };

    return (
   <AuthContext.Provider value={{ user, token, login, logout }}>
        {console.log("AuthContext Updated:", { user, token })} {/* ✅ Debugging */}
        {children}
    </AuthContext.Provider>
    );
};

export default AuthContext;
