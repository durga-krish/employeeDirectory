import {createContext, useState, useEffect} from "react";
import UserService from "../service/UserService";

const AuthContext = createContext();

export const AuthProvider = ({ children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());
    const [isAdmin, setIsAdmin] = useState(UserService.isAdmin());
    const [isUser, setIsUser] = useState(UserService.isUser());

    useEffect(() => {
        setIsAuthenticated(UserService.isAuthenticated());
        setIsAdmin(UserService.isAdmin());
        setIsUser(UserService.isUser());
    }, []);

    const login = async (email, password) => {
        try {
            const userData = await UserService.login(email, password);
            if (userData.token) {
                localStorage.setItem('token', userData.token);
                localStorage.setItem('role', userData.role);
                setIsAuthenticated(true);
                setIsAdmin(UserService.isAdmin());
                setIsUser(UserService.isUser());
            } else {
                throw new Error(userData.message);
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        UserService.logout();
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsUser(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, isUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
 export default AuthContext;

