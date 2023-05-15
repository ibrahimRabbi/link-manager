import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deleteAPI from '../apiRequests/deleteAPI';
import getAPI from '../apiRequests/getAPI';
import postAPI from '../apiRequests/postAPI';
import putAPI from '../apiRequests/putAPI';

// Fetch get all Events
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async ({ url, token }) => {
    return getAPI({ url, token });
  },
);

// Create New Event
export const fetchCreateEvent = createAsyncThunk(
  'events/fetchCreateEvent',
  async ({ url, token, bodyData, message }) => {
    return postAPI({ url, token, bodyData, message });
  },
);

// Update Event
export const fetchUpdateEvent = createAsyncThunk(
  'events/fetchUpdateEvent',
  async ({ url, token, bodyData }) => {
    return putAPI({ url, token, bodyData });
  },
);

// Delete Event
export const fetchDeleteEvent = createAsyncThunk(
  'events/fetchDeleteEvent',
  async ({ url, token }) => {
    const response = deleteAPI({ url, token });
    return { ...response, message: 'deleted Response' };
  },
);

/// All Events states
const initialState = {
  allEvents: {},
  isEventCreated: false,
  isEventUpdated: false,
  isEventDeleted: false,
  isEventLoading: false,
};

export const EventSlice = createSlice({
  name: 'event',
  initialState,

  reducers: {
    //
  },
  //----------------------\\
  extraReducers: (builder) => {
    // Get all Events pending
    builder.addCase(fetchEvents.pending, (state) => {
      state.isEventCreated = false;
      state.isEventDeleted = false;
      state.isEventUpdated = false;
      state.isEventLoading = true;
    });
    // Get all Events fulfilled
    builder.addCase(fetchEvents.fulfilled, (state, { payload }) => {
      state.isEventLoading = false;
      if (payload?.items) {
        state.allEvents = payload;
      }
    });

    builder.addCase(fetchEvents.rejected, (state) => {
      state.isEventLoading = false;
    });

    // Create new Events
    builder.addCase(fetchCreateEvent.pending, (state) => {
      state.isEventLoading = true;
    });

    builder.addCase(fetchCreateEvent.fulfilled, (state, { payload }) => {
      state.isEventLoading = false;
      console.log('Events Creating: ', payload);
      state.isEventCreated = true;
    });

    builder.addCase(fetchCreateEvent.rejected, (state) => {
      state.isEventLoading = false;
    });

    // update Events
    builder.addCase(fetchUpdateEvent.pending, (state) => {
      state.isEventLoading = true;
    });

    builder.addCase(fetchUpdateEvent.fulfilled, (state, { payload }) => {
      state.isEventLoading = false;
      console.log('Events Updating: ', payload);
      state.isEventUpdated = true;
    });

    builder.addCase(fetchUpdateEvent.rejected, (state) => {
      state.isEventLoading = false;
    });

    // Delete Events
    builder.addCase(fetchDeleteEvent.pending, (state) => {
      state.isEventLoading = true;
    });

    builder.addCase(fetchDeleteEvent.fulfilled, (state, { payload }) => {
      state.isEventLoading = false;
      state.isEventDeleted = true;
      console.log('Events Deleting: ', payload);
    });

    builder.addCase(fetchDeleteEvent.rejected, (state) => {
      state.isEventLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {  } = applicationSlice.actions;

export default EventSlice.reducer;
