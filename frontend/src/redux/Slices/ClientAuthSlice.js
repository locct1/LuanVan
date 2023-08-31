import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GetInfo } from '~/services/admin/adminauth.service';
import { ToastContainer, toast } from 'react-toastify';
import { LOCAL_STORAGE_TOKEN_CLIENT } from '~/helpers/constants';
import setAuthToken from '~/helpers/setAuthToken';
import { useDispatch } from 'react-redux';
import { GetInfoClient } from '~/services/client/clientAuth.service';

const clientAuthSlice = createSlice({
    name: 'clientAuth',
    initialState: { isLoadng: true, isAuthenticatedClient: false, infoClient: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(ClientLoadUser.pending, (state, action) => {
                state.isLoadng = true;
            })
            .addCase(ClientLoadUser.fulfilled, (state, action) => {
                state.infoClient = action.payload.infoClient;
                state.isLoadng = action.payload.isLoading;
                state.isAuthenticatedClient = action.payload.isAuthenticatedClient;
            })
            .addCase(ClientLogout.pending, (state, action) => {
                state.isLoadng = true;
            })
            .addCase(ClientLogout.fulfilled, (state, action) => {
                state.infoClient = action.payload.infoClient;
                state.isLoadng = action.payload.isLoading;
                state.isAuthenticatedClient = action.payload.isAuthenticatedClient;
            });
    },
});

export const ClientLoadUser = createAsyncThunk('client/loadUser', async () => {
    try {
        const response = await GetInfoClient();
        if (response.success) {
            return {
                isLoading: false,
                isAuthenticatedClient: true,
                infoClient: response.data,
            };
        }
        return {
            isLoading: false,
            isAuthenticatedClient: false,
            infoClient: null,
        };
    } catch (error) {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_CLIENT);
        return {
            isLoading: false,
            isAuthenticatedClient: false,
            infoClient: null,
        };
    }
});
export const ClientLogout = createAsyncThunk('client/logout', async () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_CLIENT);
    return {
        isLoading: false,
        isAuthenticatedClient: false,
        infoClient: null,
    };
});
/*
  => Admin/fetchTodos/pending
  => Admin/fetchTodos/fullfilled
  => Admin/fetchTodos/rejected
*/

export default clientAuthSlice;
