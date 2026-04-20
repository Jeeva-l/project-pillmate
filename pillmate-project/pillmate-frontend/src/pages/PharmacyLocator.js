import React, { useState, useEffect } from 'react';
import { getPharmacies } from '../services/api';

function PharmacyLocator() {
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(true);
    const MAPS_KEY = 'AIzaSyDCFeR77OHG0qa0qout86ZG1PYwehd-PdQ';
    const mapSrc = `https://www.google.com/maps/embed/v1/search?key=${MAPS_KEY}&q=pharmacy+near+me&zoom=14`;

    useEffect(() => {
        getPharmacies('')
            .then(res => setPharmacies(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title"><i className="bi bi-map-fill text-primary"></i> Pharmacy Locator</h1>
            </div>

            {/* Google Map */}
            <div className="map-container" style={{ marginBottom: 24 }}>
                {MAPS_KEY === 'YOUR_GOOGLE_MAPS_API_KEY' ? (
                    <div style={{
                        height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', background: 'var(--bg)', color: 'var(--text-muted)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: 12 }}><i className="bi bi-map"></i></div>
                        <strong style={{ color: 'var(--text)' }}>Google Maps Placeholder</strong>
                        <p style={{ fontSize: '0.875rem', marginTop: 6 }}>
                            Replace <code>YOUR_GOOGLE_MAPS_API_KEY</code> in PharmacyLocator.js with your API key
                        </p>
                    </div>
                ) : (
                    <iframe
                        title="Pharmacy Map"
                        src={mapSrc}
                        width="100%" height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                    />
                )}
            </div>

            {/* Pharmacy List */}
            
        </div>
    );
}

export default PharmacyLocator;
