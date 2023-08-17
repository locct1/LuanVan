import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GetInfo } from '~/services/admin/adminauth.service';
import { ToastContainer, toast } from 'react-toastify';
import { LOCAL_STORAGE_TOKEN_ADMIN } from '~/helpers/constants';
import setAuthToken from '~/helpers/setAuthToken';
import { useDispatch } from 'react-redux';

const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState: { isLoadng: true, isAuthenticated: false, infoAdmin: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(AdminLoadUser.pending, (state, action) => {
                state.isLoadng = true;
            })
            .addCase(AdminLoadUser.fulfilled, (state, action) => {
                state.infoAdmin = action.payload.infoAdmin;
                state.isLoadng = action.payload.isLoading;
                state.isAuthenticated = action.payload.isAuthenticated;
            })
            .addCase(AdminLogout.pending, (state, action) => {
                state.isLoadng = true;
            })
            .addCase(AdminLogout.fulfilled, (state, action) => {
                state.infoAdmin = action.payload.infoAdmin;
                state.isLoadng = action.payload.isLoading;
                state.isAuthenticated = action.payload.isAuthenticated;
            });
    },
});

export const AdminLoadUser = createAsyncThunk('admin/loadUser', async () => {
    try {
        const response = await GetInfo();
        if (response.success) {
            return {
                isLoading: false,
                isAuthenticated: true,
                infoAdmin: response.data,
            };
        }
        return {
            isLoading: false,
            isAuthenticated: false,
            infoAdmin: null,
        };
    } catch (error) {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_ADMIN);
        return {
            isLoading: false,
            isAuthenticated: false,
            infoAdmin: null,
        };
    }
});
export const AdminLogout = createAsyncThunk('admin/logout', async () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_ADMIN);
    return {
        isLoading: false,
        isAuthenticated: false,
        infoAdmin: null,
    };
});
/*
  => Admin/fetchTodos/pending
  => Admin/fetchTodos/fullfilled
  => Admin/fetchTodos/rejected
*/

export default adminAuthSlice;
