import {useEffect, useState} from "react";
import {Button, Col, Container, Pagination, Row, Table} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const Dashboard = () =>{
    const [employees, setEmployees ] = useState([]);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchEmployees = async () =>{
            try{
                const response = await fetch("http://localhost:8080/api/employees");
                const data = await response.json();

                if (Array.isArray(data)) {
                    setEmployees(data);
                } else {
                    console.error("Invalid data format:", data);
                }

            } catch (error){
                console.error("Error fetching employees:", error.message);
            }
        }

        fetchEmployees();
    }, []);

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/employees/search?searchTerm=${searchTerm}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                setEmployees(data);
            } else {
                console.error("Invalid data format:", data);
            }

        } catch (error) {
            console.error("Error searching employees:", error.message);
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
                console.log(`Employee with ID ${employeeId} deleted successfully`);
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
    }

    return (
        <>
            <Container className="mt-5">
                <Row>
                    <Col>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                        <h1 className="text-center">Employee List</h1>
                            <div>
                                <input type="text" placeholder="Search" className="me-2"
                                       value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                                <Button variant="primary" onClick={handleSearch}>Search</Button>
                                <Button variant="danger" onClick={handlePostEmployee}>Add Employee +</Button>
                            </div>
                        </div>

                        <Table striped bordered hover responsive>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Birth Date</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.name}</td>
                                    <td>{employee.birthDate}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.phone}</td>
                                    <td>
                                        <Button variant="outline-secondary" className="me-2" onClick={()=>handleUpdate(employee.id)}>Edit</Button>
                                        <Button variant="outline-danger" onClick={()=> handleDelete(employee.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        <Pagination>

                        </Pagination>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Dashboard;