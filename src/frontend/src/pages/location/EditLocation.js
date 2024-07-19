import "./style.css";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const EditLocation = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        zipCode: "",
        latitude: "",
        longitude: ""
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/locations/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        name: data.name,
                        address: data.address,
                        zipCode: data.zipCode,
                        latitude: data.latitude,
                        longitude: data.longitude
                    });
                } else {
                    console.error("Failed to fetch location data:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching location data:", error);
            }
        };

        fetchLocation();
    }, [id]);

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
            const response = await fetch(`http://localhost:8080/api/locations/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Location updated:", data);
                navigate("/");
            } else {
                const errorData = await response.json();
                console.log("Error updating location:", errorData.message || response.statusText);
            }
        } catch (error) {
            console.log("Error updating location:", error.message);
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
                        <h2>Edit Location</h2>
                        <Form onSubmit={handleSubmit}>
                            <br />
                            <Form.Group controlId="formName">
                                <Form.Label>Name <span className="required">*</span></Form.Label>
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
                                <Form.Label>Address <span className="required">*</span></Form.Label>
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
                                    type="text"
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
                                    type="text"
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
export default EditLocation;

