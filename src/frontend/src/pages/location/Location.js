import React, { useEffect, useState } from "react";
import {
    Button,
    Col,
    Container,
    Pagination,
    Row,
    Table,
    InputGroup,
    FormControl
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const LocationDashboard = () => {
    const [locations, setLocations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(9);
    const [sortBy, setSortBy] = useState('');
    const [order, setOrder] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchLocations();
    }, [currentPage, searchTerm, sortBy, order]);

    const fetchLocations = async () => {
        const params = new URLSearchParams({
            page: currentPage - 1,
            size: pageSize,
            searchTerm: searchTerm,
            sortBy: sortBy || 'name',
            order: order || 'asc'
        }).toString();

        try {
            const response = await fetch(`http://localhost:8080/api/locations/search?${params}`);
            const data = await response.json();

            if (response.ok) {
                setLocations(data.content);
                setTotalItems(data.totalElements);
                setTotalPages(data.totalPages);
            } else {
                throw new Error(data.message || "Failed to fetch data");
            }
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    };

    const handleDelete = async (locationId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/locations/${locationId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setLocations((prevLocations) =>
                    prevLocations.filter((location) => location.id !== locationId)
                );
                console.log(`Location with ID ${locationId} deleted successfully`);
            } else {
                console.log("Error deleting location:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting location:", error.message);
        }
    };

    const handleUpdate = (locationId) => {
        navigate(`/locations/${locationId}`);
    };

    const handlePostLocation = () => {
        navigate("/locations/new");
    };

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

    return (
        <>
            <Container className="mt-5">
                <Row>
                    <Col>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h1 className="text-center">Location List</h1>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <div className="d-flex align-items-center" style={{ width: "30%" }}>
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
                                <Button variant="danger" onClick={handlePostLocation} className="me-2">
                                    <i className="fi fi-rr-square-plus"></i>
                                </Button>
                            </div>
                        </div>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th onClick={() => handleSort('id')}>ID {handleArrow('id')}</th>
                                <th onClick={() => handleSort('name')}>Name {handleArrow('name')}</th>
                                <th onClick={() => handleSort('address')}>Address {handleArrow('address')}</th>
                                <th onClick={() => handleSort('zipCode')}>Zip Code {handleArrow('zipCode')}</th>
                                <th onClick={() => handleSort('latitude')}>Latitude {handleArrow('latitude')}</th>
                                <th onClick={() => handleSort('longitude')}>Longitude {handleArrow('longitude')}</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {locations.map((location) => (
                                <tr key={location.id}>
                                    <td>{location.id}</td>
                                    <td>{location.name}</td>
                                    <td>{location.address}</td>
                                    <td>{location.zipCode}</td>
                                    <td>{location.latitude}</td>
                                    <td>{location.longitude}</td>
                                    <td>
                                        <Button variant="info" onClick={() => handleUpdate(location.id)} className="me-2">
                                            Edit
                                        </Button>
                                        <Button variant="danger" onClick={() => handleDelete(location.id)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        <Pagination>
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default LocationDashboard;
