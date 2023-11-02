import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export default createSlice({
    name: 'cart',
    initialState: {
        listProducts: [],
        listShockDeals: [],
        recipient: null,
        note: null,
        total: 0,
        isCheckOut: false,
    },
    reducers: {
        // IMMER
        resetCart: (state, action) => {
            state.listProducts = [];
            state.listShockDeals = [];
            state.total = 0;
        },
        updateProductShockDeal: (state, action) => {
            const shockDealProduct = state.listShockDeals.find(
                (product) =>
                    product.productId === action.payload.productId &&
                    product.productMainId === action.payload.productMainId,
            );
            if (shockDealProduct) {
                shockDealProduct.shockDealPrice = action.payload.shockDealPrice;
            }
        },
        deleteShockDeal: (state, action) => {
            const shockDealProduct = state.listShockDeals.find(
                (product) =>
                    product.productId === action.payload.productId &&
                    product.productMainId === action.payload.productMainId,
            );
            if (shockDealProduct) {
                const shockDealProductIndex = state.listShockDeals.findIndex(
                    (product) =>
                        product.productId === action.payload.productId &&
                        product.productMainId === action.payload.productMainId,
                );

                if (shockDealProductIndex !== -1) {
                    state.listShockDeals = state.listShockDeals.filter(
                        (product, index) => index !== shockDealProductIndex,
                    );
                }
            }
        },
        updateInfoRecipient: (state, action) => {
            state.note = action.payload.note;
            state.orderId = action.payload.orderId;
            state.height = action.payload.height;
            state.width = action.payload.width;
            state.weight = action.payload.weight;
            state.length = action.payload.length;
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
                if (productSample.discountedPrice !== null) {
                    state.total = state.total + productSample.discountedPrice * action.payload.quantityCart;
                } else {
                    state.total = state.total + productSample.priceOut * action.payload.quantityCart;
                }
                toast.success('Thêm sản phẩm vào giỏ hàng thành công');
                return;
            } else {
                if (action.payload.quantityCart > action.payload.quantity) {
                    toast.warning('Số lượng sản phẩm đã vượt quá trong kho hàng', { toastId: 'quantity_success' });
                    return;
                }
                state.listProducts.push(action.payload);
                if (action.payload.discountedPrice !== null) {
                    state.total = state.total + action.payload.discountedPrice * action.payload.quantityCart;
                } else {
                    state.total = state.total + action.payload.priceOut * action.payload.quantityCart;
                }
                toast.success('Thêm sản phẩm vào giỏ hàng thành công');
            }
        },
        addShockDealProduct: (state, action) => {
            const shockDealProduct = state.listShockDeals.find(
                (product) =>
                    product.productId === action.payload.productId &&
                    product.productMainId === action.payload.productMainId,
            );
            if (shockDealProduct) {
                shockDealProduct.quantityCart = shockDealProduct.quantityCart + action.payload.quantityCart;
                state.total = state.total + shockDealProduct.shockDealPrice * action.payload.quantityCart;
            } else {
                state.listShockDeals.push(action.payload);
                state.total = state.total + action.payload.shockDealPrice * action.payload.quantityCart;
            }
        },
        removeProduct: (state, action) => {
            const productSample = state.listProducts.find((productSample) => productSample.id === action.payload.id);
            if (productSample) {
                if (productSample.discountedPrice !== null) {
                    state.total = state.total - productSample.quantityCart * productSample.discountedPrice;
                } else {
                    state.total = state.total - productSample.quantityCart * productSample.priceOut;
                }
                const listFilterShockDeals = state.listShockDeals.filter((x) => x.productMainId === productSample.id);
                listFilterShockDeals.forEach((product) => {
                    state.total = state.total - product.shockDealPrice * product.quantityCart;
                });
                state.listProducts = state.listProducts.filter(
                    (productSample) => productSample.id !== action.payload.id,
                );
                state.listShockDeals = state.listShockDeals.filter(
                    (product) => product.productMainId !== action.payload.id,
                );
            }
        },
        updateProductInPromotionProduct: (state, action) => {
            const productSample = state.listProducts.find(
                (productSample) => productSample.id === action.payload.productSample.id,
            );
            if (productSample) {
                if (action.payload.promotionDetail) {
                    productSample.discountedPrice = action.payload.promotionDetail.discountedPrice;
                    state.total =
                        state.total -
                        productSample.quantityCart * productSample.discountedPrice +
                        productSample.quantityCart * action.payload.promotionDetail.discountedPrice;
                } else {
                    if (productSample.discountedPrice !== null) {
                        state.total =
                            state.total -
                            productSample.quantityCart * productSample.discountedPrice +
                            productSample.quantityCart * action.payload.productVersion.priceOut;
                        productSample.discountedPrice = null;
                    } else {
                        state.total =
                            state.total -
                            productSample.quantityCart * productSample.priceOut +
                            productSample.quantityCart * action.payload.productVersion.priceOut;
                    }
                }
                productSample.priceOut = action.payload.productVersion.priceOut;
            }
        },
        minusProduct: (state, action) => {
            const productSample = state.listProducts.find((productSample) => productSample.id === action.payload.id);
            if (productSample) {
                if (productSample.quantityCart === 1) {
                    return;
                }
                productSample.quantityCart = productSample.quantityCart - 1;
                const listFilterShockDeals = state.listShockDeals.filter((x) => x.productMainId === productSample.id);
                listFilterShockDeals.forEach((product) => {
                    state.total = state.total - product.shockDealPrice;
                    product.quantityCart = product.quantityCart - 1;
                });
                if (productSample.discountedPrice !== null) {
                    state.total = state.total - productSample.discountedPrice;
                } else {
                    state.total = state.total - productSample.priceOut;
                }
            }
        },
        minusShockDealProduct: (state, action) => {
            const product = state.listShockDeals.find((product) => product.productId === action.payload.productId);
            if (product) {
                if (product.quantityCart === 0) {
                    return;
                }
                product.quantityCart = product.quantityCart - 1;
                state.total = state.total - product.shockDealPrice;
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
                const listFilterShockDeals = state.listShockDeals.filter((x) => x.productMainId === productSample.id);
                listFilterShockDeals.forEach((product) => {
                    state.total = state.total + product.shockDealPrice;
                    product.quantityCart = product.quantityCart + 1;
                });
                if (productSample.discountedPrice !== null) {
                    state.total = state.total + productSample.discountedPrice;
                } else {
                    state.total = state.total + productSample.priceOut;
                }
            }
        },
        plusShockDealProduct: (state, action) => {
            const product = state.listShockDeals.find((product) => product.productId === action.payload.productId);
            const productSample = state.listProducts.find(
                (productSample) => productSample.id === product.productMainId,
            );
            if (product.quantityCart + 1 > productSample.quantityCart) {
                return;
            }
            if (product) {
                product.quantityCart = product.quantityCart + 1;
                state.total = state.total + product.shockDealPrice;
            }
        },
    },
});
