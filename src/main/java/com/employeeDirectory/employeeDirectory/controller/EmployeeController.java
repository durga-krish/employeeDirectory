package com.employeeDirectory.employeeDirectory.controller;
import com.employeeDirectory.employeeDirectory.dto.EmployeeDTO;
import com.employeeDirectory.employeeDirectory.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api/employees")
@CrossOrigin("*")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<Page<EmployeeDTO>> getAllEmployees(@RequestParam int page, @RequestParam int size, @RequestParam String sortBy, @RequestParam String order) {
        Page<EmployeeDTO> employees = employeeService.getAllEmployees(page, size, sortBy, order);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable Long id) {
        EmployeeDTO employeeDTO = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employeeDTO);
    }

    @PostMapping
    public ResponseEntity<EmployeeDTO> createEmployee(@RequestBody EmployeeDTO employeeDTO) {
        EmployeeDTO createdEmployee = employeeService.createEmployee(employeeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEmployee);
    }

    @PutMapping("{id}")
    public ResponseEntity<EmployeeDTO> updateEmployee(@PathVariable Long id, @RequestBody EmployeeDTO employeeDTO) {
        EmployeeDTO updatedEmployee = employeeService.updateEmployee(id, employeeDTO);
        return ResponseEntity.ok(updatedEmployee);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<EmployeeDTO>> searchEmployees(@RequestParam String searchTerm,
                                                             @RequestParam int page,
                                                             @RequestParam int size,
                                                             @RequestParam String sortBy,
                                                             @RequestParam String order) {
        Page<EmployeeDTO> employees = employeeService.searchEmployees(searchTerm, page, size, sortBy, order);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<Page<EmployeeDTO>> getEmployeesByDepartment(@PathVariable Long departmentId,
                                                                      @RequestParam int page,
                                                                      @RequestParam int size,
                                                                      @RequestParam String sortBy,
                                                                      @RequestParam String order) {
        Page<EmployeeDTO> employees = employeeService.findByDepartment(departmentId, page, size, sortBy, order);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/location/{locationId}")
    public ResponseEntity<Page<EmployeeDTO>> getEmployeesByLocation(@PathVariable Long locationId,
                                                                    @RequestParam int page,
                                                                    @RequestParam int size,
                                                                    @RequestParam String sortBy,
                                                                    @RequestParam String order) {
        Page<EmployeeDTO> employees = employeeService.findByLocation(locationId, page, size, sortBy, order);
        return ResponseEntity.ok(employees);
    }
}
