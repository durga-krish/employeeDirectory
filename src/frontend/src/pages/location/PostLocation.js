import { useState } from "react";
import Form from "react-bootstrap/Form";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./style.css";

const PostLocation = () => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        zipCode: "",
        latitude: "",
        longitude: "",
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.address) newErrors.address = "Address is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch("http://localhost:8080/api/locations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Location created: ", data);
                navigate("/");
            } else {
                const errorData = await response.json();
                console.log("Error creating location: ", errorData.message || response.statusText);
            }
        } catch (error) {
            console.log("Error creating location:", error.message);
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
                        <h2>Add Location</h2>
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
                            <Form.Group controlId="formAddress">
                                <Form.Label>
                                    Address
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    placeholder="Enter address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.address}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.address}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <br />
                            <Form.Group controlId="formZipCode">
                                <Form.Label>Zip Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="zipCode"
                                    placeholder="Enter zip code"
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <br />
                            <Form.Group controlId="formLatitude">
                                <Form.Label>Latitude</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.000001"
                                    name="latitude"
                                    placeholder="Enter latitude"
                                    value={formData.latitude}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <br />
                            <Form.Group controlId="formLongitude">
                                <Form.Label>Longitude</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.000001"
                                    name="longitude"
                                    placeholder="Enter longitude"
                                    value={formData.longitude}
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

export default PostLocation;
