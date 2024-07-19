import "./style.css";
import {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import {Button, Col, Container, Row} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";

const EditEmployee =()=>{
    const {id} = useParams();
    const [formData, setFormData] = useState({
        name:"",
        birthDate: "",
        email: "",
        phone: "",
        jobPosition: "",
        bio: "",
        hiringDate: "",
        isActive: false,
        department:{
            id:""
        },
        location:{
            id:""
        },
        pictureFile: null,
        picture: "",
        pictureFileName: ""
    });

    const [departments, setDepartments] = useState([]);
    const [locations, setLocations] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {

        const fetchEmployee = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/employees/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        name: data.name,
                        birthDate: data.birthDate,
                        email: data.email,
                        phone: data.phone,
                        jobPosition: data.jobPosition,
                        bio: data.bio,
                        hiringDate: data.hiringDate,
                        isActive: data.isActive,
                        department: {
                            id: data.department.id
                        },
                        location: {
                            id: data.location.id
                        },
                        pictureFile: null,
                        picture: `http://localhost:8080/api/employees/${id}/pictureFile`,
                        pictureFileName: data.pictureFileName
                    });
                } else {
                    console.error("Failed to fetch employee data:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        };

        const fetchOptions = async () => {
            try {
                const [deptResponse, locResponse] = await Promise.all([
                    fetch("http://localhost:8080/api/departments"),
                    fetch("http://localhost:8080/api/locations")
                ]);
                if (deptResponse.ok && locResponse.ok) {
                    const [depts, locs] = await Promise.all([deptResponse.json(), locResponse.json()]);
                    setDepartments(depts);
                    setLocations(locs);
                } else {
                    console.error("Failed to fetch departments or locations:", deptResponse.statusText, locResponse.statusText);
                }
            } catch (error) {
                console.error("Error fetching departments or locations:", error);
            }
        };

        fetchEmployee();
        fetchOptions();
    }, [id]);

    const handleInputChange = (event) => {
        const { name, value, type, checked, files } = event.target;
        if (name === "departmentId") {
            setFormData({
                ...formData,
                department: { id: value }
            });
        } else if (name === "locationId") {
            setFormData({
                ...formData,
                location: { id: value }
            });
        } else if (name === "pictureFile") {
            if (files.length > 0) {
                setFormData({
                    ...formData,
                    pictureFile: files[0],
                    picture: URL.createObjectURL(files[0]),
                    pictureFileName: files[0].name
                });
            } else {
                setFormData({
                    ...formData,
                    pictureFile: null,
                    pictureFileName: ""
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("birthDate", formData.birthDate);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("jobPosition", formData.jobPosition);
        formDataToSend.append("bio", formData.bio);
        formDataToSend.append("hiringDate", formData.hiringDate);
        formDataToSend.append("isActive", formData.isActive);

        if (formData.department.id) {
            formDataToSend.append("department.id", formData.department.id);
        }
        if (formData.location.id) {
            formDataToSend.append("location.id", formData.location.id);
        }
        if (formData.pictureFile) {
            formDataToSend.append("pictureFile", formData.pictureFile);
        }

        try {
            const response = await fetch(`http://localhost:8080/api/employees/${id}`, {
                method: "PUT",
                body: formDataToSend,
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Employee updated:", data);
                navigate("/");
            } else {
                console.error("Error updating employee:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating employee:", error);
        }
    };


    const handleBack = () =>{
        navigate("/");
    };

    return(
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <div className="form-container">
                        <h2>Edit Employee</h2>
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
                                    value={formData.department.id}
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
                                    value={formData.location.id}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Location</option>
                                    {locations.map(loc => (
                                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <br/>

                            <Form.Group controlId="formPictureFile">
                                <Form.Label>Picture</Form.Label>
                                <div className="custom-file">
                                    <Form.Control
                                        type="file"
                                        name="pictureFile"
                                        onChange={handleInputChange}
                                        className="custom-file-input"
                                    />
                                    <Form.Label className="custom-file-label">
                                        { formData.pictureFileName }
                                    </Form.Label>
                                </div>

                                {formData.picture && (
                                    <div className="mt-3">
                                        <img
                                            src={formData.picture}
                                            alt="Employee"
                                            className="img-thumbnail"
                                            style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                        />
                                    </div>
                                )}
                            </Form.Group>
                            <br />

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

export default EditEmployee;
