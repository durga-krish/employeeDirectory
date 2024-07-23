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

    const login = () => {
        setIsAuthenticated(true);
        setIsAdmin(UserService.isAdmin());
        setIsUser(UserService.isUser());
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

