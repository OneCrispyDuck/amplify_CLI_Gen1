import { API } from '@aws-amplify/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Defines and creates an async thunk to fetch markers from the API. This function will make an API call and handle the response or any errors
export const fetchMarkers = createAsyncThunk(
  'map/fetchMarkers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('markerApi', '/markers', {});
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Define a type for the slice state
interface MapState {
  markers: { id: string; lat: number; lng: number }[];
}

// Define the initial state using that type
const initialState: MapState = {
  markers: [],
};

// Updated slice configuration
export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    addMarker: (state, action: PayloadAction<{ id: string; lat: number; lng: number }>) => {
      state.markers.push(action.payload);
    },
    removeMarker: (state, action: PayloadAction<string>) => {
      state.markers = state.markers.filter(marker => marker.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarkers.fulfilled, (state, action) => {
        state.markers = action.payload;
      })
      .addCase(fetchMarkers.rejected, (state, action) => {
        console.error('Failed to fetch markers:', action.payload);
      });
  },
});
export const { addMarker, removeMarker } = mapSlice.actions;

export default mapSlice.reducer;
