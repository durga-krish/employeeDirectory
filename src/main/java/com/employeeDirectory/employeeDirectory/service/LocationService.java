package com.employeeDirectory.employeeDirectory.service;

import com.employeeDirectory.employeeDirectory.dto.LocationDTO;
import com.employeeDirectory.employeeDirectory.entity.Location;
import com.employeeDirectory.employeeDirectory.repository.LocationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    public List<LocationDTO> getAllLocations() {
        List<Location> locations = locationRepository.findAll();
        return locations.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Location getLocationById(Long id) {
        return locationRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Location not found with id " + id));
    }

    public LocationDTO createLocation(LocationDTO locationDTO) {
        Location location = new Location();
        location.setName(locationDTO.getName());
        location.setAddress(locationDTO.getAddress());
        location.setZipCode(locationDTO.getZipCode());
        location.setLatitude(locationDTO.getLatitude());
        location.setLongitude(locationDTO.getLongitude());
        Location savedLocation = locationRepository.save(location);
        return convertToDTO(savedLocation);
    }

    public LocationDTO updateLocation(Long id, LocationDTO locationDTO) {
        Location existingLocation = getLocationById(id);
        existingLocation.setName(locationDTO.getName());
        existingLocation.setAddress(locationDTO.getAddress());
        existingLocation.setZipCode(locationDTO.getZipCode());
        existingLocation.setLatitude(locationDTO.getLatitude());
        existingLocation.setLongitude(locationDTO.getLongitude());
        Location updatedLocation = locationRepository.save(existingLocation);
        return convertToDTO(updatedLocation);
    }

    public void deleteLocation(Long id) {
        Location location = getLocationById(id);
        locationRepository.delete(location);
    }

    public LocationDTO convertToDTO(Location location) {
        LocationDTO locationDTO = new LocationDTO();
        locationDTO.setId(location.getId());
        locationDTO.setName(location.getName());
        locationDTO.setAddress(location.getAddress());
        locationDTO.setZipCode(location.getZipCode());
        locationDTO.setLatitude(location.getLatitude());
        locationDTO.setLongitude(location.getLongitude());
        locationDTO.setCreatedAt(location.getCreatedAt());
        locationDTO.setUpdatedAt(location.getUpdatedAt());
        return locationDTO;
}
}
