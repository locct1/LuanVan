import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export default createSlice({
    name: 'cart',
    initialState: {
        listProducts: [],
        recipient: null,
        note: null,
        total: 0,
        isCheckOut: false,
    },
    reducers: {
        // IMMER
        resetCart: (state, action) => {
            state.listProducts = [];
            state.total = 0;
        },
        updateInfoRecipient: (state, action) => {
            state.note = action.payload.note;
            state.recipient = action.payload.recipient;
            state.isCheckOut = false;
        },
        updateCheckOut: (state, action) => {
            state.isCheckOut = false;
        },
        addProduct: (state, action) => {
            const productSample = state.listProducts.find((productSample) => productSample.id === action.payload.id);
            if (productSample) {
                if (productSample.quantityCart + action.payload.quantityCart > productSample.quantity) {
                    toast.warning('Số lượng sản phẩm đã vượt quá trong kho hàng', { toastId: 'quantity_success' });
                    return;
                }
                productSample.quantityCart = productSample.quantityCart + action.payload.quantityCart;
                state.total = state.total + productSample.priceOut * action.payload.quantityCart;
                toast.success('Thêm điện thoại vào giỏ hàng thành công');
                return;
            } else {
                if (action.payload.quantityCart > action.payload.quantity) {
                    toast.warning('Số lượng sản phẩm đã vượt quá trong kho hàng', { toastId: 'quantity_success' });
                    return;
                }
                state.listProducts.push(action.payload);
                state.total = state.total + action.payload.priceOut * action.payload.quantityCart;
                toast.success('Thêm điện thoại vào giỏ hàng thành công');
            }
        },
        removeProduct: (state, action) => {
            const productSample = state.listProducts.find((productSample) => productSample.id === action.payload.id);
            if (productSample) {
                state.total = state.total - productSample.quantityCart * productSample.priceOut;
                state.listProducts = state.listProducts.filter(
                    (productSample) => productSample.id !== action.payload.id,
                );
            }
        },
        minusProduct: (state, action) => {
            const productSample = state.listProducts.find((productSample) => productSample.id === action.payload.id);
            if (productSample) {
                if (productSample.quantityCart === 1) {
                    return;
                }
                productSample.quantityCart = productSample.quantityCart - 1;
                state.total = state.total - productSample.priceOut;
            }
        },
        plusProduct: (state, action) => {
            const productSample = state.listProducts.find((productSample) => productSample.id === action.payload.id);
            if (productSample) {
                if (productSample.quantityCart + 1 > productSample.quantity) {
                    toast.warning('Số lượng sản phẩm đã vượt quá trong kho hàng', { toastId: 'quantity_success' });
                    return;
                }
                productSample.quantityCart = productSample.quantityCart + 1;
                state.total = state.total + productSample.priceOut;
            }
        },
    },
});
