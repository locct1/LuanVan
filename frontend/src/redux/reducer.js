import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import { combineReducers } from 'redux';
const rootReducer = combineReducers({
    // hostAuth: hostAuthSlice.reducer,
    // adminAuth: adminAuthSlice.reducer,
    // clientAuth: clientAuthSlice.reducer,
    // bookingNow: bookingNowSlice.reducer,
    // hostReservation: hostReservationSlice.reducer,
    // hostUpdateReservation: HostUpdateReservationSlice.reducer,
});

export default rootReducer;
