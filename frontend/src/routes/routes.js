import AdminLayout from '~/layouts/AdminLayout';
import HomeLayout from '~/layouts/HomeLayout/HomeLayout';
import HomeLayoutNoImg from '~/layouts/HomeLayout/HomeLayoutNoImg';
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
import Home from '~/pages/Client/Home';
import ListProductsClient from '~/pages/Client/ListProductsClients';
import ListProductsByBrand from '~/pages/Client/ListProductsByBrand';
import ListProductsBySearch from '~/pages/Client/ListProductsBySearch';
import ProductDetail from '~/pages/Client/ProducrDetail';
import Cart from '~/pages/Client/Cart';
import LoginClient from '~/pages/Client/ClientLogin';
import RegisterClient from '~/pages/Client/ClientRegister';
import ConfirmOrder from '~/pages/Client/ConfirmOrder';
import ChangePassWordClient from '~/pages/Client/ChangePassWordClient';
import UpdateInfoClient from '~/pages/Client/UpdateInfoClient';
import ListPaymentMethods from '~/pages/Admin/PaymentMethod/ListPaymentMethods';
import AddPaymentMethod from '~/pages/Admin/PaymentMethod/AddPaymentMethod';
import UpdatePaymentMethod from '~/pages/Admin/PaymentMethod/UpdatePaymentMethod';
import CheckoutSuccess from '~/pages/Client/CheckoutSuccess';
import ListOrders from '~/pages/Admin/Order/ListOrders';
import DetailOrder from '~/pages/Admin/Order/DetailOrder';
import OrderHistory from '~/pages/Client/OrderHistory';
import CheckoutVnPaySuccess from '~/pages/Client/CheckoutVnPaySuccess';
import AddPromotionProduct from '~/pages/Admin/PromotionProduct/AddPromotionProduct';
import ListPromotionProducts from '~/pages/Admin/PromotionProduct/ListPromotionProducts';
import UpdatePromotionProduct from '~/pages/Admin/PromotionProduct/UpdatePromotionProduct';
import ListReviewProducts from '~/pages/Admin/Comment/ListReviewProducts';
import ListChats from '~/pages/Admin/Chat/ListChats';
import ListManageAccounts from '~/pages/Admin/ManageAccount/ListManageAccounts';
import AddAccount from '~/pages/Admin/ManageAccount/AddAccount';
import UpdateAccount from '~/pages/Admin/ManageAccount/UpdateAccount';
import ChangePassword from '~/pages/Admin/ManageAccount/ChangePassWord';
import ListProductCategories from '~/pages/Admin/ProductCategory/ListProductCategories';
import AddProductCateogry from '~/pages/Admin/ProductCategory/AddProductCategory';
import AddProductCategory from '~/pages/Admin/ProductCategory/AddProductCategory';
import UpdateProductCategory from '~/pages/Admin/ProductCategory/UpdateProductCategory';
import ListAccessories from '~/pages/Admin/Accessory/ListAccessories';
import AddAccessory from '~/pages/Admin/Accessory/AddAccessory';
import UpdateAccessory from '~/pages/Admin/Accessory/UpdateAccessory';
import ListAccessoriesClients from '~/pages/Client/ListAccessoriesClients';
import ListShockDeals from '~/pages/Admin/ShockDeal/ListShockDeals';
import AddShockDeal from '~/pages/Admin/ShockDeal/AddShockDeal';
import UpdateShockDeal from '~/pages/Admin/ShockDeal/UpdateShockDeal';
// Public routes
const publicRoutes = [
    { path: '/admin-login', component: AdminLogin, layout: null },
    { path: '/', component: Home, layout: HomeLayout },
    { path: '/list-products', component: ListProductsClient, layout: HomeLayoutNoImg },
    { path: '/list-accessories', component: ListAccessoriesClients, layout: HomeLayoutNoImg },
    { path: '/list-product-by-brand/:id', component: ListProductsByBrand, layout: HomeLayoutNoImg },
    { path: '/search-product', component: ListProductsBySearch, layout: HomeLayoutNoImg },
    { path: '/product-detail/:id', component: ProductDetail, layout: HomeLayoutNoImg },
    { path: '/cart', component: Cart, layout: HomeLayoutNoImg },
    { path: '/client-login', component: LoginClient, layout: HomeLayoutNoImg },
    { path: '/client-register', component: RegisterClient, layout: HomeLayoutNoImg },
    { path: '/confirm-order', component: ConfirmOrder, layout: HomeLayoutNoImg },
    { path: '/change-password-client', component: ChangePassWordClient, layout: HomeLayoutNoImg },
    { path: '/update-info-client', component: UpdateInfoClient, layout: HomeLayoutNoImg },
    { path: '/confirm-order', component: ConfirmOrder, layout: HomeLayoutNoImg },
    { path: '/checkout-success', component: CheckoutSuccess, layout: HomeLayoutNoImg },
    { path: '/checkout-vnpay-success', component: CheckoutVnPaySuccess, layout: HomeLayoutNoImg },
    { path: '/order-history', component: OrderHistory, layout: HomeLayoutNoImg },
];
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

    { path: '/admin-list-accessories', component: ListAccessories, layout: AdminLayout },
    { path: '/admin-add-accessory', component: AddAccessory, layout: AdminLayout },
    { path: '/admin-accessories/:id', component: UpdateAccessory, layout: AdminLayout },

    { path: '/admin-list-productcategories', component: ListProductCategories, layout: AdminLayout },
    { path: '/admin-add-productcategory', component: AddProductCategory, layout: AdminLayout },
    { path: '/admin-productcategories/:id', component: UpdateProductCategory, layout: AdminLayout },

    { path: '/admin-list-paymentmethods', component: ListPaymentMethods, layout: AdminLayout },
    { path: '/admin-add-paymentmethod', component: AddPaymentMethod, layout: AdminLayout },
    { path: '/admin-paymentmethods/:id', component: UpdatePaymentMethod, layout: AdminLayout },

    { path: '/admin-list-roles', component: ListRoles, layout: AdminLayout },
    { path: '/admin-add-role', component: AddRole, layout: AdminLayout },
    { path: '/admin-roles/:id', component: UpdateRole, layout: AdminLayout },

    { path: '/admin-list-manage-accounts', component: ListManageAccounts, layout: AdminLayout },
    { path: '/admin-add-account', component: AddAccount, layout: AdminLayout },
    { path: '/admin-accounts/:id', component: UpdateAccount, layout: AdminLayout },
    { path: '/admin-change-password/:id', component: ChangePassword, layout: AdminLayout },

    { path: '/admin-list-promotion-products', component: ListPromotionProducts, layout: AdminLayout },
    { path: '/admin-add-promotion-product', component: AddPromotionProduct, layout: AdminLayout },
    { path: '/admin-promotion-products/:id', component: UpdatePromotionProduct, layout: AdminLayout },

    { path: '/admin-list-shock-deals', component: ListShockDeals, layout: AdminLayout },
    { path: '/admin-add-shock-deal', component: AddShockDeal, layout: AdminLayout },
    { path: '/admin-shock-deals/:id', component: UpdateShockDeal, layout: AdminLayout },

    { path: '/admin-list-product-purchase-orders', component: ListProductPurchaseOrders, layout: AdminLayout },
    { path: '/admin-add-product-purchase-order', component: AddProductPurchaseOrder, layout: AdminLayout },
    { path: '/admin-detail-product-purchase-order/:id', component: DetailProductPurchaseOrder, layout: AdminLayout },
    { path: '/list-product-inventories', component: ListProductInventories, layout: AdminLayout },
    { path: '/admin-photo-product-samples/:id', component: PhotoProductSamples, layout: AdminLayout },
    { path: '/test-pdf', component: TestPDF, layout: null },
    { path: '/admin-dashboard', component: DashBoard, layout: AdminLayout },

    { path: '/admin-list-orders', component: ListOrders, layout: AdminLayout },
    { path: '/detail-order/:id', component: DetailOrder, layout: AdminLayout },

    { path: '/admin-list-reviewproducts', component: ListReviewProducts, layout: AdminLayout },
    { path: '/admin-list-chats', component: ListChats, layout: AdminLayout },
];
export { publicRoutes, adminPrivateRoutes };
