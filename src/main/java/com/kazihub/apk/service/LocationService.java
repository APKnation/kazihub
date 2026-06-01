package com.kazihub.apk.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LocationService {

    @Value("${map.api-key:}")
    private String apiKey;

    private static final int EARTH_RADIUS_KM = 6371;

    /**
     * Calculates the distance between two points in kilometers using the Haversine formula.
     *
     * @param lat1 Latitude of point 1
     * @param lon1 Longitude of point 1
     * @param lat2 Latitude of point 2
     * @param lon2 Longitude of point 2
     * @return Distance in kilometers
     */
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }

    /**
     * Stub for Geocoding API call.
     * Would use RestTemplate to call e.g. Google Maps Geocoding API:
     * https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={apiKey}
     */
    public double[] geocodeAddress(String address) {
        // Here you would implement the HTTP call to the map provider using this.apiKey
        // For now, we return dummy coordinates or throw an exception if unsupported
        return new double[]{0.0, 0.0};
    }
}
