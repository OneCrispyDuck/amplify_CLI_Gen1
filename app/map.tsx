import { API } from '@aws-amplify/api'; // Add this import
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { addMarker, fetchMarkers, removeMarker } from '../slices/mapSlice';
import { AppDispatch, RootState } from '../store';

export default function MapScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const markers = useSelector((state: RootState) => state.map?.markers || []);

  useEffect(() => {
    dispatch(fetchMarkers());
  }, [dispatch]);

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const newMarker = {
      id: Date.now().toString(),
      lat: latitude,
      lng: longitude,
    };
    try {
      await API.post('markerApi', '/markers', { body: newMarker });
      dispatch(addMarker(newMarker));
    } catch (error) {
      console.error('Error adding marker:', error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 22.3193,
          longitude: 114.1694,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.lat, longitude: marker.lng }}
            onCalloutPress={async () => {
              try {
                await API.del('markerApi', `/markers/${marker.id}`, {});
                dispatch(removeMarker(marker.id));
              } catch (error) {
                console.error('Error removing marker:', error);
              }
            }}
          >
            <Text>📍</Text>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});