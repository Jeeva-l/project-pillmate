package com.pillmate.controller;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/pharmacies")
public class PharmacyController {

    // Sample pharmacy data with coordinates
    private final Object[][] data = {
            {"MedPlus Pharmacy", 12.9716, 77.5946, "9am - 10pm", "+91-80-1234-5678", 4.5},
            {"Apollo Pharmacy", 12.9750, 77.6010, "8am - 11pm", "+91-80-2345-6789", 4.3},
            {"Fortis Pharmacy", 12.9680, 77.5900, "9am - 9pm", "+91-80-3456-7890", 4.2},
            {"HealthMart", 12.9800, 77.5950, "Open 24/7", "+91-80-4567-8901", 4.7},
            {"Care Pharmacy", 12.9730, 77.6050, "8am - 10pm", "+91-80-5678-9012", 4.1}
    };

    /**
     * Returns pharmacies within 5km radius of given location
     * Example:
     * /api/pharmacies?lat=12.97&lng=77.59
     */
    @GetMapping
    public List<Map<String, Object>> getNearbyPharmacies(
            @RequestParam double lat,
            @RequestParam double lng
    ) {

        List<Map<String, Object>> pharmacies = new ArrayList<>();

        for (Object[] row : data) {

            String name = (String) row[0];
            double pharmacyLat = (double) row[1];
            double pharmacyLng = (double) row[2];
            String hours = (String) row[3];
            String phone = (String) row[4];
            double rating = (double) row[5];

            double distance = calculateDistance(lat, lng, pharmacyLat, pharmacyLng);

            // Filter within 5 KM
            if (distance <= 5) {
                Map<String, Object> p = new HashMap<>();
                p.put("name", name);
                p.put("address", pharmacyLat + ", " + pharmacyLng);
                p.put("hours", hours);
                p.put("phone", phone);
                p.put("rating", rating);
                p.put("distance_km", Math.round(distance * 100.0) / 100.0);
                pharmacies.add(p);
            }
        }

        // Sort by nearest first
        pharmacies.sort(Comparator.comparingDouble(p -> (double) p.get("distance_km")));

        return pharmacies;
    }

    /**
     * Haversine formula to calculate distance between two coordinates
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {

        final int R = 6371; // Earth radius in KM

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}