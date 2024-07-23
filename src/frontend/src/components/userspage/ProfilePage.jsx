import {useEffect, useState} from "react";
import UserService from "../service/UserService";
import {Link} from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import {useContext} from "react";

function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({ roles: [] });
    const { login } = useContext(AuthContext);
    const [error, setError] = useState();

    useEffect(() => {
        fetchProfileInfo();
        login();
    }, []);

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

    if (error) {
        return <div>>Error loading profile information</div>;
    }

    if (!profileInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-page-container">
            <h2>Profile Information</h2>
            <p>Name: {profileInfo.name}</p>
            <p>Email: {profileInfo.email}</p>
            <p>City: {profileInfo.city}</p>
            <p>Role: {profileInfo.roles.join(', ')}</p>

            <button>
                <Link to={`/update-user/${profileInfo.id}`}>
                    Update this profile
                </Link>
            </button>
        </div>
    );
}

export default ProfilePage;