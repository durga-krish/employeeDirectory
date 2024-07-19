import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <Container className="dashboard-container mt-5">
            <Row className="justify-content-center">
                <Col md={8} className="text-center">
                    <h2 className="dashboard-title">Employee Directory</h2>
                    <div className="mt-3">
                    <Button
                            variant="primary"
                            onClick={() => handleNavigation("/employees")}
                            className="dashboard-button">
                            Employee
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => handleNavigation("/departments")}
                            className="dashboard-button">
                            Department
                        </Button>
                        <Button
                            variant="success"
                            onClick={() => handleNavigation("/locations")}
                            className="dashboard-button">
                            Location
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
