import {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import "@flaticon/flaticon-uicons/css/all/all.css";
import "./Navbar.css";

function Navbar(){
    const { isAuthenticated, isAdmin, isUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);


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

    const toggleDropdown = () => {
        console.log("Profile icon clicked");
        console.log(dropdownOpen);
        setDropdownOpen(!dropdownOpen);
    }

    return (
        isAuthenticated && (
            <nav className="navbar">
                <ul className="navbar-list">
                    {isAdmin && <li><Link to="/admin/user-management">User Management</Link></li>}
                    {isAdmin && <li><Link to="/dashboard">Dashboard</Link></li>}
                    {isUser && <li><Link to="/dashboard">Dashboard</Link></li>}
                    {isAuthenticated && (
                        <li className="navbar-profile">
                            <i className="fi fi-ss-user profile-icon" onClick={toggleDropdown}></i>
                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-header">
                                        <div className="dropdown-user-info">
                                            <p className="dropdown-name">Username</p>
                                            <p className="dropdown-email">Email</p>
                                        </div>

                                    </div>

                                    <ul className="dropdown-options">
                                        <li><Link to="/profile" onClick={() => setDropdownOpen(false)}>Manage
                                            Profile</Link></li>
                                        <li><Link to="/" onClick={handleLogout}>Sign Out</Link></li>
                                    </ul>
                                </div>
                                )}
                        </li>
                    )}
                </ul>
            </nav>
        )
    );
}

export default Navbar;