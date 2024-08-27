import React, {useContext, useEffect, useState} from "react";
import {
    Button,
    Col,
    Container,
    Pagination,
    Row,
    Table,
    OverlayTrigger,
    Popover,
    Card,
    InputGroup, FormControl
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./EmployeeList.css";
import "@flaticon/flaticon-uicons/css/all/all.css";
import AuthContext from "../../components/auth/AuthContext";

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(9);
    const [sortBy, setSortBy] = useState('');
    const [order, setOrder] = useState('');
    const [showPopover, setShowPopover] = useState(false);
    const allFields = ['id', 'name', 'birthDate', 'bio', 'phone', 'email', 'hiringDate', 'jobPosition', 'isActive', 'department', 'location'];
    const [selectedFields, setSelectedFields] = useState(() => {
        const savedFields = localStorage.getItem('selectedFields');
        return savedFields ? JSON.parse(savedFields) : ['name', 'birthDate', 'email', 'phone'];
    });
    const [tempSelectedFields, setTempSelectedFields] = useState([...selectedFields]);
    const [viewType, setViewType] = useState('list');
    const {isAdmin, isUser} = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
    }, [currentPage, searchTerm, sortBy, order]);

    const fetchEmployees = async () => {
        const params = new URLSearchParams({
            page: currentPage - 1,
            size: pageSize,
            searchTerm: searchTerm,
            sortBy: sortBy || 'name',
            order: order || 'asc'
        }).toString();

        try {
            const response = await fetch(`http://localhost:8080/api/employees/search?${params}`);
            const data = await response.json();

            if (response.ok) {
                setEmployees(data.content);
                setTotalItems(data.totalElements);
                setTotalPages(data.totalPages);
            } else {
                throw new Error(data.message || "Failed to fetch data");
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const handleDelete = async (employeeId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/employees/${employeeId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setEmployees((prevEmployees) =>
                    prevEmployees.filter((employee) => employee.id !== employeeId)
                );
                console.log(`Employee with ID ${employeeId} deleted successfully`);
            } else {
                console.log("Error deleting employee:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting employee:", error.message);
        }
    };

    const handleUpdate = (employeeId) => {
        navigate(`/employees/${employeeId}`);
    };

    const handlePostEmployee = () => {
        navigate("/employees/new");
    };

    const handlePostDepartment = () =>{
        navigate("/departments/new");
    }

    const handlePostLocation = () => {
        navigate("/locations/new");
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSort = (column) => {
        const newOrder = (sortBy === column && order === 'asc') ? 'desc' : 'asc';
        setSortBy(column);
        setOrder(newOrder);
    };

    const handleArrow = (column) => {
        if (sortBy === column) {
            return order === 'asc' ? "↑" : "↓";
        }
        return '↑↓';
    };

    const handleFieldSelectionChange = (field, type) => {
        if (type === 'add') {
            setTempSelectedFields(prevSelectedFields => [...new Set([...prevSelectedFields, field])]);
        } else {
            setTempSelectedFields(prevSelectedFields => prevSelectedFields.filter(item => item !== field));
        }
    };

    const handleSaveFields = () => {
        setSelectedFields(tempSelectedFields);
        localStorage.setItem('selectedFields', JSON.stringify(tempSelectedFields));
        setShowPopover(false);
    };

    const handleCancelFields = () => {
        setTempSelectedFields([...selectedFields]);
        setShowPopover(false);
    };


    const popoverContent = (
        <Popover id="popover-basic" style={{ backgroundColor: "#f5f5f5", border: "1px solid #ddd", maxWidth: "600px" }}>
            <Popover.Header as="h2" className="text-center">Select Fields to Display</Popover.Header>
            <Popover.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
                <Row>
                    <Col style={{ maxHeight: "100%", overflowY: "auto" }}>
                        <h6>Available Fields</h6>
                        <ul className="list-unstyled" style={{ maxHeight: "calc(50vh - 150px)", overflowY: "auto" }}>
                            {allFields.filter(field => !tempSelectedFields.includes(field)).map((field) => (
                                <li key={field} className="d-flex justify-content-between align-items-center mb-2">
                                    {field}
                                    <Button variant="outline-primary" size="sm" onClick={() => handleFieldSelectionChange(field, 'add')}>
                                        Add
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </Col>
                    <Col style={{ maxHeight: "100%", overflowY: "auto" }}>
                        <h6>Selected Fields</h6>
                        <ul className="list-unstyled" style={{ maxHeight: "calc(50vh - 150px)", overflowY: "auto" }}>
                            {tempSelectedFields.map((field) => (
                                <li key={field} className="d-flex justify-content-between align-items-center mb-2">
                                    {field}
                                    <Button variant="outline-danger" size="sm" onClick={() => handleFieldSelectionChange(field, 'remove')}>
                                        Remove
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </Col>
                </Row>
                <div className="d-flex justify-content-end mt-3">
                    <Button variant="secondary" className="me-2" onClick={handleCancelFields}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveFields}>
                        Save
                    </Button>
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <>
            <Container className="mt-5">
                <Row>
                    <Col>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h1 className="text-center">Employee List</h1>
                        </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <div className="d-flex align-items-center" style={{ width: "30%"}}>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <i className="fi fi-rs-search"></i>
                                            </InputGroup.Text>
                                    <FormControl
                                        type="text"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        />
                                        </InputGroup>
                                    </div>
                                    <div>
                                        {isAdmin && (
                                        <Button variant="danger" onClick={handlePostEmployee} className="me-2">
                                            <i className="fi fi-rr-square-plus"></i>
                                        </Button>
                                            )}

                                        <OverlayTrigger
                                            trigger="click"
                                            placement="bottom"
                                            show={showPopover}
                                            overlay={popoverContent}
                                            onToggle={() => setShowPopover(!showPopover)}
                                        >
                                            <Button variant="secondary" className="me-2"><i
                                                className="fi fi-br-filter"></i></Button>
                                        </OverlayTrigger>

                                        <Button
                                            className={`view-button ${viewType === 'list' ? 'active' : ''}`}
                                            onClick={() => setViewType('list')}
                                        >
                                            <i className="fi fi-rs-list"></i>
                                        </Button>

                                        <Button
                                            className={`view-button ${viewType === 'card' ? 'active' : ''}`}
                                            onClick={() => setViewType('card')}
                                        >
                                            <i className="fi fi-rs-apps"></i>
                                        </Button>
                                    </div>
                                </div>

                        {viewType === 'list' ? (
                            <div>
                            <Table striped bordered hover responsive>
                                <thead>
                                <tr>
                                    {selectedFields.map(field => (
                                        <th key={field} onClick={() => handleSort(field)} style={{cursor: 'pointer'}}>
                                            {field.charAt(0).toUpperCase() + field.slice(1)} {handleArrow(field)}
                                        </th>
                                    ))}
                                    {isAdmin && <th>Actions</th>}
                                </tr>
                                </thead>
                                <tbody>
                                {employees.map(employee => (
                                    <tr key={employee.id}>
                                        {selectedFields.map(field => (
                                            <td key={field}>
                                                {field === 'department' ? employee.department.name :
                                                    field === 'location' ? employee.location.name :
                                                        employee[field] != null ? String(employee[field]) : ""}
                                            </td>
                                        ))}
                                        {isAdmin && (
                                        <td>
                                            <div className="d-flex justify-content-around">
                                            <Button
                                                    variant="outline-secondary"
                                                    className="me-2"
                                                    size="sm"
                                                    onClick={() => handleUpdate(employee.id)}>
                                                Edit</Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                    onClick={() => handleDelete(employee.id)}>
                                                Delete
                                            </Button>
                                            </div>
                                        </td>
                                        )}
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                            </div>
                        ) : (
                            <Row xs={1} md={2} lg={3} className="g-4">
                                {employees.map(employee => (
                                    <Col md={4} key={employee.id}>
                                        <Card className="h-100 mb-4">
                                            <Card.Body className="d-flex align-items-center">
                                                <div>
                                                    <Card.Img
                                                        variant="top"
                                                        src={`http://localhost:8080/api/employees/${employee.id}/pictureFile`}
                                                        alt="Employee"
                                                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}

                                                    />
                                                </div>
                                                <div className="ms-3">
                                                    <Card.Title>{employee.name}</Card.Title>
                                                    <Card.Text>
                                                        <strong>Email:</strong> {employee.email}<br />
                                                        <strong>Birthdate:</strong> {employee.birthDate}<br />
                                                        <strong>Phone:</strong> {employee.phone}<br />
                                                    </Card.Text>
                                                    {isAdmin && (
                                                        <>
                                                    <Button variant="outline-secondary" className="me-2"
                                                            onClick={() => handleUpdate(employee.id)}>Edit</Button>
                                                    <Button variant="outline-danger"
                                                            onClick={() => handleDelete(employee.id)}>Delete
                                                    </Button>
                                            </>
                                                )}
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}

                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                {`${Math.min((currentPage - 1) * pageSize + 1, totalItems)} to ${Math.min(
                                    currentPage * pageSize,
                                    totalItems
                                )} of ${totalItems} items`}
                            </div>
                            <Pagination>
                                {Array.from({length: totalPages}, (_, index) => (
                                    <Pagination.Item
                                        key={index + 1}
                                        active={index + 1 === currentPage}
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                            </Pagination>
                        </div>
                </Col>
                </Row>
            </Container>
        </>
    );
};

export default EmployeeList;