import AdminLayout from '~/layouts/AdminLayout';
import AdminLogin from '~/pages/Admin/Account/AdminLogin';
import AddBrand from '~/pages/Admin/Brand/AddBrand';
import ListBrands from '~/pages/Admin/Brand/ListBrands';
import UpdateBrand from '~/pages/Admin/Brand/UpdateBrand';
import AddColorProduct from '~/pages/Admin/ColorProduct/AddColorProduct';
import ListColorProducts from '~/pages/Admin/ColorProduct/ListColorProducts';
import UpdateColorProduct from '~/pages/Admin/ColorProduct/UpdateColorProduct';
import DashBoard from '~/pages/Admin/DashBoard/DashBoard';
import AddProduct from '~/pages/Admin/Product/AddProduct';
import ListProducts from '~/pages/Admin/Product/ListProducts';
import PhotoProductSamples from '~/pages/Admin/Product/PhotoProductSamples';
import UpdateProduct from '~/pages/Admin/Product/UpdateProduct';
import AddProductPurchaseOrder from '~/pages/Admin/ProductPurchaseOrder/AddProductPurchaseOrder';
import DetailProductPurchaseOrder from '~/pages/Admin/ProductPurchaseOrder/DetailProductPurchaseOrder';
import ListProductInventories from '~/pages/Admin/ProductPurchaseOrder/ListProductInventories';
import ListProductPurchaseOrders from '~/pages/Admin/ProductPurchaseOrder/ListProductPurchaseOrders';
import TestPDF from '~/pages/Admin/ProductPurchaseOrder/TestPDF';
import AddRole from '~/pages/Admin/Role/AddRole';
import ListRoles from '~/pages/Admin/Role/ListRoles';
import UpdateRole from '~/pages/Admin/Role/UpdateRole';
import AddSupplier from '~/pages/Admin/Supplier/AddSupplier';
import ListSuppliers from '~/pages/Admin/Supplier/ListSuppliers';
import UpdateSupplier from '~/pages/Admin/Supplier/UpdateSupplier';
import AddWareHouse from '~/pages/Admin/WareHouse/AddWareHouse';
import ListWareHouses from '~/pages/Admin/WareHouse/ListWareHouses';
import UpdateWareHouse from '~/pages/Admin/WareHouse/UpdateWareHouse';
// Public routes
const publicRoutes = [{ path: '/admin-login', component: AdminLogin, layout: null }];
const adminPrivateRoutes = [
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

    { path: '/admin-list-roles', component: ListRoles, layout: AdminLayout },
    { path: '/admin-add-role', component: AddRole, layout: AdminLayout },
    { path: '/admin-roles/:id', component: UpdateRole, layout: AdminLayout },

    { path: '/admin-list-product-purchase-orders', component: ListProductPurchaseOrders, layout: AdminLayout },
    { path: '/admin-add-product-purchase-order', component: AddProductPurchaseOrder, layout: AdminLayout },
    { path: '/admin-detail-product-purchase-order/:id', component: DetailProductPurchaseOrder, layout: AdminLayout },
    { path: '/list-product-inventories', component: ListProductInventories, layout: AdminLayout },
    { path: '/admin-photo-product-samples/:id', component: PhotoProductSamples, layout: AdminLayout },
    { path: '/test-pdf', component: TestPDF, layout: null },
    { path: '/admin-dashboard', component: DashBoard, layout: AdminLayout },
];
export { publicRoutes, adminPrivateRoutes };
