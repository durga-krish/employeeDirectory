import React, {useEffect, useState} from "react";
import UserService from "../service/UserService";
import {Link, useNavigate} from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import {useContext} from "react";
import {Button} from "react-bootstrap";

function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({ roles: [] });
    //const { login } = useContext(AuthContext);
    const {isAuthenticated, logout} = useContext(AuthContext);
    const [error, setError] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated){
            fetchProfileInfo();
        }
    }, [isAuthenticated]);

    const  fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await UserService.getYourProfile(token);
            //console.log(response);
            setProfileInfo(response.ourUsers || {roles: [] });
        }catch (error) {
            console.error('Error fetching profile information:', error);
            setError(error);
        }
    };

    const handleDeleteUser = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this profile?");
        if (confirmDelete) {
            try {
                const token = localStorage.getItem('token');
                await UserService.deleteUser(profileInfo.id, token);
                alert("Your profile has been deleted.");
                logout();
                navigate("/login");
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("There was an error deleting your profile. Please try again.");
            }
        }
    };

    if (error) {
        return <div>>Error loading profile information</div>;
    }

    if (!profileInfo) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="user-management-container" style={{position: "relative", height: "50px"}}>
                <button className="reg-button"
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "0",
                            height: "50px",
                            width: "200px",
                            backgroundColor: "green",
                            border: "none",
                            borderRadius: "4px"
                        }}>
                    <Link to="/register" style={{color: "white", textDecoration: "none"}}>
                        Add new user
                    </Link>
                </button>
            </div>


            <div className="profile-page-container">
                <h2>Profile Information</h2>
                <p>Name: {profileInfo.name}</p>
                <p>Email: {profileInfo.email}</p>
                <p>City: {profileInfo.city}</p>

                <div style={{display: "flex", gap: "10px"}}>
                    <button style={{backgroundColor: "blue"}}>
                        <Link to={`/update-user/${profileInfo.id}`} style={{color: "white"}}>
                            Update this profile
                        </Link>
                    </button>

                    <button onClick={handleDeleteUser} style={{backgroundColor: "darkred", color: "white"}}>
                        Delete this profile
                    </button>
                </div>

            </div>
        </>
    );
}

export default ProfilePage;