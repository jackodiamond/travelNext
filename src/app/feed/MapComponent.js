import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';

const containerStyle = {
  width: '300px', // Adjust the size as needed
  height: '300px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

const libraries = ["places"];

const MapComponent = ({ mapLocation }) => {
  const [marker, setMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState(center);
  const searchBoxRef = useRef(null);

  const onMapClick = useCallback((event) => {
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      time: new Date()
    });

    mapLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  }, [mapLocation]);

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length > 0) {
      const place = places[0];
      const newCenter = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      setMapCenter(newCenter);
      setMarker({
        lat: newCenter.lat,
        lng: newCenter.lng,
        time: new Date()
      });
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <div style={{ position: 'relative', width: '400px', height: '400px' }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={10}
          onClick={onMapClick}
        >
          {marker && (
            <Marker position={{ lat: marker.lat, lng: marker.lng }} />
          )}
        </GoogleMap>
        <div style={{ position: 'absolute', top: '10px', left: '40%', transform: 'translateX(-50%)' }}>
          <StandaloneSearchBox
            onLoad={ref => (searchBoxRef.current = ref)}
            onPlacesChanged={onPlacesChanged}
          >
            <input
              type="text"
              placeholder="Search for places"
              style={{
                boxSizing: 'border-box',
                border: '1px solid transparent',
                width: '240px',
                height: '32px',
                padding: '0 12px',
                borderRadius: '3px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                fontSize: '14px',
                outline: 'none',
                textOverflow: 'ellipsis'
              }}
            />
          </StandaloneSearchBox>
        </div>
      </div>
    </LoadScript>
  );
};

export default MapComponent;
