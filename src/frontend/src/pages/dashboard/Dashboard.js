import {useEffect, useState} from "react";
import {Button, Col, Container, Pagination, Row, Table, Form, OverlayTrigger, Popover} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Dashboard = () =>{
    const [employees, setEmployees ] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [locations, setLocations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(9);
    const [sortBy, setSortBy] = useState('');
    const [order, setOrder] = useState('');
    const [showPopover, setShowPopover] = useState(false);
    const [availableFields, setAvailableFields] = useState(['id', 'name','birthDate', 'bio', 'phone', 'email', 'hiringDate', 'jobPosition', 'isActive', 'department', 'location']);
    const [selectedFields, setSelectedFields] = useState(['name', 'birthDate', 'email', 'phone']);

    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
        fetchLocations();

    }, [currentPage,searchTerm, sortBy, order]);

    const fetchEmployees = async () => {
        const params = new URLSearchParams({
            page: currentPage - 1,
            size: pageSize,
            searchTerm: searchTerm,
            sortBy : sortBy || 'name',
            order : order || 'asc'
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

    const fetchDepartments = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/departments`);
            const data = await response.json();
            console.log("Departments:", data);
            setDepartments(data);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    const fetchLocations = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/locations`);
            const data = await response.json();
            console.log("Locations:", data);
            setLocations(data);
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    };



    const handleDelete = async (employeeId) =>{
        try{
            const response = await fetch(`http://localhost:8080/api/employees/${employeeId}`,{
            method: "DELETE",
        });

        if(response.ok) {
            setEmployees((prevEmployees) =>
                prevEmployees.filter((employee) => employee.id !== employeeId)
            );
            console.log("Employee with ID ${employeeId} deleted successfully");
        } else {
            console.log("Error deleting employee:", response.statusText);
        }
    } catch (error){
        console.error("Error deleting employee:", error.message);
    }
};

const handleUpdate = (employeeId) =>{
    navigate(`/employees/${employeeId}`);
};

const handlePostEmployee = () => {
    navigate("/employees/new");
};

const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
};

const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
};

const handleSort = (column) => {
    const newOrder = (sortBy === column && order === 'asc') ? 'desc': 'asc';
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
            setSelectedFields(prevSelectedFields => [...new Set([...prevSelectedFields, field])]);
            setAvailableFields(prevAvailableFields => prevAvailableFields.filter(item => item !== field));
        } else {
            setAvailableFields(prevAvailableFields => [...new Set([...prevAvailableFields, field])]);
            setSelectedFields(prevSelectedFields => prevSelectedFields.filter(item => item !== field));
        }
    };


    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h2"><center>Select Fields to Display</center></Popover.Header>
            <Popover.Body>
                <Row>
                    <Col>
                        <h6>Available Fields</h6>
                        <ul>
                            {availableFields.map(field => (
                                <li key={field}>
                                    {field} <Button size="sm" onClick={() => handleFieldSelectionChange(field, 'add')}>→</Button>
                                </li>
                            ))}
                        </ul>
                    </Col>
                    <Col>
                        <h6>Selected Fields</h6>
                        <ul>
                            {selectedFields.map(field => (
                                <li key={field}>
                                    <Button size="sm" onClick={() => handleFieldSelectionChange(field, 'remove')}>←</Button> {field}
                                </li>
                            ))}
                        </ul>
                    </Col>
                </Row>
                <div className="d-flex justify-content-end">
                    <Button variant="secondary" className="me-2" onClick={() => setShowPopover(false)}>Cancel</Button>
                    <Button variant="primary" onClick={() => setShowPopover(false)}>Save</Button>
                </div>
            </Popover.Body>
        </Popover>
    );

    const getDepartmentNameById = (departmentId) => {
        const department = departments.find(dep => dep.id === departmentId);
        return department ? department.name : '';
    };

    const getLocationNameById = (locationId) => {
        const location = locations.find(loc => loc.id === locationId);
        return location ? location.name : '';
    };

    return (
    <>
        <Container className="mt-5">
            <Row>
                <Col>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h1 className="text-center">Employee List</h1>
                        <div>
                            <input
                                type="text"
                                placeholder="Search"
                                className="me-2"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <Button variant="danger" onClick={handlePostEmployee} className="me-2">
                                Add Employee +
                            </Button>

                            <OverlayTrigger
                                show={showPopover}
                                trigger="click"
                                placement="bottom"
                                overlay={popover}
                                onToggle={() => setShowPopover(!showPopover)}
                            >
                                <Button variant="primary">Select Fields</Button>
                            </OverlayTrigger>
                        </div>
                    </div>

                    <Table striped bordered hover responsive>
                        <thead>
                        <tr>
                            {selectedFields.map(field => (
                                <th key={field} onClick={() => handleSort(field)} style={{cursor: 'pointer'}}>
                                    {field.charAt(0).toUpperCase() + field.slice(1)} {handleArrow(field)}
                                </th>
                            ))}
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.id}>
                                {selectedFields.map(field => (
                                    <td key={field}>
                                        {field === 'department' ? getDepartmentNameById(employee.department) :
                                            field === 'location' ? getLocationNameById(employee.location) :
                                                typeof employee[field] === 'object' ? JSON.stringify(employee[field]) : employee[field]}
                                    </td>
                                ))}
                                <td>
                                    <Button variant="outline-secondary" className="me-2"
                                            onClick={() => handleUpdate(employee.id)}>Edit</Button>
                                    <Button variant="outline-danger"
                                            onClick={() => handleDelete(employee.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>


                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            {`${Math.min((currentPage - 1) * pageSize + 1, totalItems)} to ${Math.min(
                                currentPage * pageSize,
                                totalItems
                            )} of ${totalItems} items`}
                        </div>
                        <Pagination>
                            {Array.from({ length: totalPages }, (_, index) => (
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

export default Dashboard;