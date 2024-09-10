import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import UserService from "../service/UserService";
import {Button} from "react-bootstrap";

function RegistrationPage(){
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        roles: [],
        city: ''
    });

    const [error, setError] = useState('');
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        } else {
            setError("No authentication token found. Please log in.");
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'roles') {
            setFormData({ ...formData, roles: value.split(',').map(role => role.trim()) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, roles } = formData;

        if (!name || !email || !password || roles.length === 0) {
            setError('Please fill in all mandatory fields (name, email, password, roles).');
            return;
        }

        if (!token) {
            setError('No authentication token found. Please log in.');
            return;
        }

        try {
            //const token = localStorage.getItem('token');
            console.log('Form Data:', formData); // Logging form data
            console.log('Token:', token); // Logging token

            const response = await UserService.register(formData, token);
            console.log('Response:', response); // Logging response

            setFormData({
                name: '',
                email: '',
                password: '',
                role: '',
                city: ''
            });
            setError('');
            alert('User registered successfully');
            navigate('/dashboard');
        }catch (error) {
            console.error('Error registering user:', error);
            setError('An error occurred while registering the user');
        }
    };

    return (
        <div className="auth-container">
            <h2>Registration</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text"
                           name="name"
                           value={formData.name}
                           onChange={handleInputChange}
                            required/>
                </div>
                <br/>

                <div className="form-group">
                    <label>Email:</label>
                    <input type="email"
                           name="email"
                           value={formData.email}
                           onChange={handleInputChange}
                            required />
                </div>
                <br/>

                <div className="form-group">
                    <label>Password:</label>
                    <input type="password"
                           name="password"
                           value={formData.password}
                           onChange={handleInputChange}
                            required />
                </div>
                <br/>

                <div className="form-group">
                    <label>Roles:</label>
                    <input type="text"
                           name="roles"
                           value={formData.roles.join(', ')}
                           onChange={handleInputChange}
                           placeholder="Enter roles seperated by comma"
                            required />
                </div>
                <br/>

                <div className="form-group">
                    <label>City:</label>
                    <input type="text"
                           name="city"
                           value={formData.city}
                           onChange={handleInputChange}
                           placeholder="Enter city" />
                </div>
                <br/>

                <Button type="submit">Register</Button>

            </form>
        </div>
    );
}

export default RegistrationPage;