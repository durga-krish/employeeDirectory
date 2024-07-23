import {useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import AuthContext from "../auth/AuthContext";

function Navbar(){
    const { isAuthenticated, isAdmin, isUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();


    const handleLogout = () => {
        const confirmLogout = window.confirm('Are you sure you want to logout this user?');
        if (confirmLogout) {
            logout();
            navigate("/login");
        }
    };

    // console.log("isAuthenticated:", isAuthenticated);
    // console.log("isAdmin:", isAdmin);
    // console.log("isUser:", isUser);

    return (
        <nav>
            <ul>
                {isAuthenticated && <li><Link to="/profile">Profile</Link></li>}
                {isAdmin && <li><Link to="/admin/user-management">User Management</Link></li>}
                {isAdmin && <li><Link to="/dashboard">Dashboard</Link></li>}
                {isUser && <li><Link to="/dashboard">Dashboard</Link></li>}
                {isAuthenticated && <li><Link to="/" onClick={handleLogout}>Logout</Link></li>}
            </ul>
        </nav>
    );
}

export default Navbar;