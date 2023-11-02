import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GetInfo } from '~/services/admin/adminauth.service';
import { ToastContainer, toast } from 'react-toastify';
import { LOCAL_STORAGE_TOKEN_CLIENT } from '~/helpers/constants';
import setAuthToken from '~/helpers/setAuthToken';
import { useDispatch } from 'react-redux';
import { GetInfoClient } from '~/services/client/clientAuth.service';

const clientChatMessageSlice = createSlice({
    name: 'clientChatMessage',
    initialState: { roomId: null },
    reducers: {
        // IMMER
        createClientChatMessage: (state, action) => {
            state.roomId = action.payload.roomId;
        },
    },
});

/*
  => Admin/fetchTodos/pending
  => Admin/fetchTodos/fullfilled
  => Admin/fetchTodos/rejected
*/

export default clientChatMessageSlice;
