import {useNavigate} from "react-router-dom";
import {useState} from "react";
import UserService from "../service/UserService";
import {Button} from "react-bootstrap";

function RegistrationPage(){
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        city: ''
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await UserService.register(formData, token);

            setFormData({
                name: '',
                email: '',
                password: '',
                role: '',
                city: ''
            });
            alert('User registered successfully');
            navigate('/admin/user-management');
        }catch (error) {
            console.error('Error registering user:', error);
            alert('An error occurred while registering user');
        }
    };

    return (
        <div className="auth-container">
            <h2>Registration</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text"
                           name="name"
                           value={formData.name}
                           onChange={handleInputChange} required/>
                </div>
                <br/>

                <div className="form-group">
                    <label>Email:</label>
                    <input type="email"
                           name="email"
                           value={formData.email}
                           onChange={handleInputChange} required/>
                </div>
                <br/>

                <div className="form-group">
                    <label>Password:</label>
                    <input type="password"
                           name="password"
                           value={formData.password}
                           onChange={handleInputChange} required/>
                </div>
                <br/>

                <div className="form-group">
                    <label>Role:</label>
                    <input type="text"
                           name="role"
                           value={formData.role}
                           onChange={handleInputChange}
                           placeholder="Enter role" required/>
                </div>
                <br/>

                <div className="form-group">
                    <label>City:</label>
                    <input type="text"
                           name="city"
                           value={formData.city}
                           onChange={handleInputChange}
                           placeholder="Enter city" required/>
                </div>
                <br/>

                <Button type="submit">Register</Button>

            </form>
        </div>
    );
}

export default RegistrationPage;