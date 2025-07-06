import { get } from '@aws-amplify/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// ---------- Types ----------
interface Marker {
  id: string;
  lat: number;
  lng: number;
}

interface MapState {
  markers: Marker[];
}

// ---------- Thunks ----------

// Fetch all markers from the API
export const fetchMarkers = createAsyncThunk<Marker[], void, { rejectValue: string }>(
  'map/fetchMarkers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await get({
        apiName: 'markerAPI',
        path: '/markers',
      });

      // Option 1: Trust (if you know your API returns an array)
      // return response as unknown as Marker[];

      // Option 2: Robust check
      if (Array.isArray(response)) {
        return response as Marker[];
      } else if (response && Array.isArray((response as any).markers)) {
        // In case your API returns { markers: [...] }
        return (response as any).markers as Marker[];
      } else {
        return rejectWithValue('API did not return an array of markers');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Unknown error');
    }
  }
);

// ---------- Slice ----------

const initialState: MapState = {
  markers: [],
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    addMarker: (state, action: PayloadAction<Marker>) => {
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