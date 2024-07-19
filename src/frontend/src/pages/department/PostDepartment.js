import { useState} from "react";
import Form from "react-bootstrap/Form";
import {Button, Col, Container, Row} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import "./style.css";

const PostDepartment = () => {
    const [formData, setFormData] = useState({
        name: "",
        isActive: false,
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch("http://localhost:8080/api/departments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Department created: ", data);
                navigate("/");
            } else {
                const errorData = await response.json();
                console.log("Error creating department: ", errorData.message || response.statusText);
            }
        } catch (error) {
            console.log("Error creating department:", error.message);
        }
    };

    const handleBack = () => {
        navigate("/");
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <div className="form-container">
                        <h2>Add Department</h2>
                        <Form onSubmit={handleSubmit}>
                            <br />
                            <Form.Group controlId="formName">
                                <Form.Label>
                                    Name
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Enter name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <br />
                            <Form.Group controlId="formIsActive" className="is-active-checkbox">
                                <Form.Label>Is Active</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                />
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

export default PostDepartment;