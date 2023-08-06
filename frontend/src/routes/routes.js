import AdminLayout from '~/layouts/AdminLayout';
import AddBrand from '~/pages/Admin/Brand/AddBrand';
import ListBrands from '~/pages/Admin/Brand/ListBrands';
import UpdateBrand from '~/pages/Admin/Brand/UpdateBrand';
import AddColorProduct from '~/pages/Admin/ColorProduct/AddColorProduct';
import ListColorProducts from '~/pages/Admin/ColorProduct/ListColorProducts';
import UpdateColorProduct from '~/pages/Admin/ColorProduct/UpdateColorProduct';
import AddProduct from '~/pages/Admin/Product/AddProduct';
import ListProducts from '~/pages/Admin/Product/ListProducts';
import UpdateProduct from '~/pages/Admin/Product/UpdateProduct';
import AddSupplier from '~/pages/Admin/Supplier/AddSupplier';
import ListSuppliers from '~/pages/Admin/Supplier/ListSuppliers';
import UpdateSupplier from '~/pages/Admin/Supplier/UpdateSupplier';
import AddWareHouse from '~/pages/Admin/WareHouse/AddWareHouse';
import ListWareHouses from '~/pages/Admin/WareHouse/ListWareHouses';
import UpdateWareHouse from '~/pages/Admin/WareHouse/UpdateWareHouse';
// Public routes
const publicRoutes = [
    { path: '/admin-list-brands', component: ListBrands, layout: AdminLayout },
    { path: '/admin-add-brand', component: AddBrand, layout: AdminLayout },
    { path: '/admin-brands/:id', component: UpdateBrand, layout: AdminLayout },
    { path: '/admin-list-products', component: ListProducts, layout: AdminLayout },
    { path: '/admin-add-product', component: AddProduct, layout: AdminLayout },
    { path: '/admin-products/:id', component: UpdateProduct, layout: AdminLayout },
    { path: '/admin-list-warehouses', component: ListWareHouses, layout: AdminLayout },
    { path: '/admin-add-warehouse', component: AddWareHouse, layout: AdminLayout },
    { path: '/admin-warehouses/:id', component: UpdateWareHouse, layout: AdminLayout },
    { path: '/admin-list-suppliers', component: ListSuppliers, layout: AdminLayout },
    { path: '/admin-add-supplier', component: AddSupplier, layout: AdminLayout },
    { path: '/admin-suppliers/:id', component: UpdateSupplier, layout: AdminLayout },
    { path: '/admin-list-colorproducts', component: ListColorProducts, layout: AdminLayout },
    { path: '/admin-add-colorproduct', component: AddColorProduct, layout: AdminLayout },
    { path: '/admin-colorproducts/:id', component: UpdateColorProduct, layout: AdminLayout },
];
const adminPrivateRoutes = [];
export { publicRoutes, adminPrivateRoutes };
