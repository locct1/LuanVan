// import { configureStore,getDefaultMiddleware } from '@reduxjs/toolkit';
// import hostAuthSlice from './Slices/HostAuthSlice';
// import adminAuthSlice from './Slices/AdminAuthSlice';
// import clientAuthSlice from './Slices/ClientAuthSlice';
// import bookingNowSlice from './Slices/BookingNowSlice';

// const store = configureStore({
//     reducer: {
//         hostAuth: hostAuthSlice.reducer,
//         adminAuth: adminAuthSlice.reducer,
//         clientAuth: clientAuthSlice.reducer,
//         bookingNow: bookingNowSlice.reducer,
//     },
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: false,
//         }),
// });

// export default store;

import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import rootReducer from './reducer';
const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['hostReservation'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
