import { createSelector } from '@reduxjs/toolkit';

export const isAuthenticatedAdminSelector = (state) => state.adminAuth.isAuthenticated;
export const infoAdminSelector = (state) => state.adminAuth.infoAdmin;
export const infoCart = (state) => state.cart;
