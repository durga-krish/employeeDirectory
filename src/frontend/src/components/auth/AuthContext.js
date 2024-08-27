import {createContext, useState, useEffect} from "react";
import UserService from "../service/UserService";

const AuthContext = createContext();

export const AuthProvider = ({ children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());
    const [isAdmin, setIsAdmin] = useState(UserService.isAdmin());
    const [isUser, setIsUser] = useState(UserService.isUser());
    const [user, setUser] = useState(null);

    useEffect(() => {
        // setIsAuthenticated(UserService.isAuthenticated());
        // setIsAdmin(UserService.isAdmin());
        // setIsUser(UserService.isUser());
        if (isAuthenticated) {
            const fetchUserDetails = async () => {
                try{
                    const token = localStorage.getItem('token');
                    const userData = await UserService.getYourProfile(token);
                    setUser({
                        name: userData.name,
                        email: userData.email,
                    });
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            };
            fetchUserDetails();
        }

        const userRole = UserService.getRole();
        setIsAdmin(userRole === 'ADMIN');
        setIsUser(userRole === 'USER');
    }, [isAuthenticated]);

    const login = async (email, password) => {
        try {
            const userData = await UserService.login(email, password);
            if (userData.token) {
                localStorage.setItem('token', userData.token);
                localStorage.setItem('role', userData.role);
                setIsAuthenticated(true);
                setIsAdmin(UserService.isAdmin());
                setIsUser(UserService.isUser());

                setUser({
                    name: userData.name,
                    email: userData.email,
                });
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
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, isUser, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
 export default AuthContext;

