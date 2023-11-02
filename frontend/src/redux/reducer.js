import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import adminAuthSlice from './Slices/AdminAuthSlice';
import clientAuthSlice from './Slices/ClientAuthSlice';
import { combineReducers } from 'redux';
import CartSlice from './Slices/CartSlice';
import clientChatMessageSlice from './Slices/ClientChatMessageSlice';
const rootReducer = combineReducers({
    // hostAuth: hostAuthSlice.reducer,
    adminAuth: adminAuthSlice.reducer,
    clientAuth: clientAuthSlice.reducer,
    cart: CartSlice.reducer,
    clientChatMessage: clientChatMessageSlice.reducer,
    // clientAuth: clientAuthSlice.reducer,
    // bookingNow: bookingNowSlice.reducer,
    // hostReservation: hostReservationSlice.reducer,
    // hostUpdateReservation: HostUpdateReservationSlice.reducer,
});

export default rootReducer;
