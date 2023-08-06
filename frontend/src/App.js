import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { privateRoutes, publicRoutes, adminPrivateRoutes } from '~/routes';
import DefaultLayout from '~/layouts';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer, toast } from 'react-toastify';
import AdminProtectedRoutes from './routes/AdminProtectedRoutes';
import { useDispatch, useSelector } from 'react-redux';

// import { HostLoadUser } from '~/redux/Slices/HostAuthSlice';
// import { AdminLoadUser } from '~/redux/Slices/AdminAuthSlice';
// import { ClientLoadUser } from '~/redux/Slices/ClientAuthSlice';

const queryClient = new QueryClient();
function App() {
    const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(HostLoadUser());
    //     dispatch(AdminLoadUser());
    //     dispatch(ClientLoadUser());
    // }, []);
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="App">
                    <Routes>
                        {publicRoutes.map((route, index) => {
                            const Page = route.component;
                            let Layout = DefaultLayout;
                            if (route.layout) {
                                Layout = route.layout;
                            } else if (route.layout === null) {
                                Layout = Fragment;
                            }
                            return (
                                <Route
                                    exact
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                        {adminPrivateRoutes.map((route, index) => {
                            const Page = route.component;
                            let Layout = DefaultLayout;
                            if (route.layout) {
                                Layout = route.layout;
                            } else if (route.layout === null) {
                                Layout = Fragment;
                            }
                            return (
                                <Route element={<AdminProtectedRoutes />} key={index}>
                                    <Route
                                        exact
                                        key={index}
                                        path={route.path}
                                        element={
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        }
                                    />
                                </Route>
                            );
                        })}
                    </Routes>
                    <ToastContainer
                        position="top-center"
                        autoClose={1200}
                        hideProgressBar={true}
                        newestOnTop={false}
                        closeOnClick={false}
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                    />
                </div>
            </Router>
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </QueryClientProvider>
    );
}

export default App;
