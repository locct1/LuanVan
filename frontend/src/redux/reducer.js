import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import adminAuthSlice from './Slices/AdminAuthSlice';
import { combineReducers } from 'redux';
import CartSlice from './Slices/CartSlice';
const rootReducer = combineReducers({
    // hostAuth: hostAuthSlice.reducer,
    adminAuth: adminAuthSlice.reducer,
    cart: CartSlice.reducer,
    // clientAuth: clientAuthSlice.reducer,
    // bookingNow: bookingNowSlice.reducer,
    // hostReservation: hostReservationSlice.reducer,
    // hostUpdateReservation: HostUpdateReservationSlice.reducer,
});

export default rootReducer;
