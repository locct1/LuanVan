import { createSelector } from '@reduxjs/toolkit';

export const isAuthenticatedAdminSelector = (state) => state.adminAuth.isAuthenticated;
export const infoAdminSelector = (state) => state.adminAuth.infoAdmin;

export const isAuthenticatedClientSelector = (state) => state.clientAuth.isAuthenticatedClient;
export const infoClientSelector = (state) => state.clientAuth.infoClient;

export const infoCart = (state) => state.cart;
export const infoNoteSelector = (state) => state.cart.note;
export const infoRecipientSelector = (state) => state.cart.recipient;
export const infoCheckOutSelector = (state) => state.cart.isCheckOut;
export const infoHeightSelector = (state) => state.cart.height;
export const infoWidthSelector = (state) => state.cart.width;
export const infoWeightSelector = (state) => state.cart.weight;
export const infoLengthSelector = (state) => state.cart.length;
