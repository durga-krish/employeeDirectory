import {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import {Button, Col, Container, Row} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import "./style.css";

const PostEmployee =() =>{
    const [formData, setFormData] = useState({
        name:"",
        birthDate:"",
        email:"",
        phone:"",
        jobPosition:"",
        bio:"",
        hiringDate:"",
        isActive:false,
        department:{
            id:""
        },
        location:{
            id:""
        }
    });

     const [departments, setDepartments] = useState([]);
     const [locations, setLocations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchOptions = async () => {
            try {
                const deptResponse = await fetch("http://localhost:8080/api/departments");
                const depts = await deptResponse.json();
                setDepartments(depts);

                const locResponse = await fetch("http://localhost:8080/api/locations");
                const locs = await locResponse.json();
                setLocations(locs);
            } catch (error) {
                console.error("Error fetching departments or locations:", error.message);
            }
        };
        fetchOptions();
    }, []);

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            department: { id: formData.departmentId },
            location: { id: formData.locationId }
        };
        try {
            const response = await fetch("http://localhost:8080/api/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Employee created: ", data);
                navigate("/");
            } else {
                const errorData = await response.json();
                console.log("Error creating employee: ", errorData.message || response.statusText);
            }
        } catch (error) {
            console.log("Error creating employee:", error.message);
        }
    };

    const handleBack = () => {
        navigate("/");
    };

    return(
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
            <div className="form-container">
                <h2>Add Employee</h2>
                <Form onSubmit={handleSubmit}>
                <br/>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Enter name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <br/>

                    <Form.Group controlId="formBirthDate">
                        <Form.Label>Birth Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="birthDate"
                            placeholder="Enter Birth Date"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <br/>

                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <br/>

                    <Form.Group controlId="formPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            placeholder="Enter phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <br/>

                    <Form.Group controlId="formJobPosition">
                        <Form.Label>Job Position</Form.Label>
                        <Form.Control
                            type="text"
                            name="jobPosition"
                            placeholder="Enter job position"
                            value={formData.jobPosition}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <br/>

                    <Form.Group controlId="formBio">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control
                            type="text"
                            name="bio"
                            placeholder="Enter bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <br/>

                    <Form.Group controlId="formHiringDate">
                        <Form.Label>Hiring Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="hiringDate"
                            placeholder="Enter hiring date"
                            value={formData.hiringDate}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <br/>

                    <Form.Group controlId="formIsActive" className="is-active-checkbox">
                        <Form.Label>Is Active</Form.Label>
                        <Form.Check
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                   <Form.Group controlId="formDepartmentId">
                        <Form.Label>Department</Form.Label>
                        <Form.Control
                            as="select"
                            name="departmentId"
                            value={formData.departmentId}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </Form.Control>
                   </Form.Group>
                    <br/>

                    <Form.Group controlId="formLocationId">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            as="select"
                            name="locationId"
                            value={formData.locationId}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Location</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <br/>

                    <div className="button-group">
                        <Button variant="secondary" onClick={handleBack} className="back-button mr-2">
                            Back
                        </Button>

                        <Button variant="primary" type="submit" className="save-button">
                            Save
                        </Button>
                    </div>
                </Form>
            </div>
                </Col>
            </Row>
        </Container>
    );
};

export default PostEmployee;

