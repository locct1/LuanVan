import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAddProductCategoryData } from '~/hooks/react-query/productcategoryData';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import { htmlTable } from '~/helpers/constants';
function AddProductCategory() {
    const schema = yup
        .object()
        .shape({
            name: yup.string().required('Vui lòng nhập tên loại sản phẩm'),
            code: yup.string().required('Vui lòng nhập mã loại sản phẩm'),
        })
        .required();
    const {
        register,
        resetField,
        handleSubmit,
        clearErrors,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
    });
    const [errorsForm, setErrorsForm] = useState([]);
    const onSuccess = (data) => {
        if (data.success) {
            resetField('name');
            resetField('code');
            toast.success('Tạo thành công');
        } else {
            setErrorsForm(data.errors);
        }
    };

    const { mutate: addProductCategory } = useAddProductCategoryData(onSuccess);

    const onSubmit = async (data) => {
        addProductCategory(data);
    };

    return (
        <>
            <>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Thêm loại sản phẩm</h6>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-6">
                                {errorsForm && errorsForm.length > 0 && (
                                    <>
                                        {errorsForm.map((error, index) => (
                                            <p className="text-danger" key={index}>
                                                {error}
                                            </p>
                                        ))}
                                    </>
                                )}
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Tên loại sản phẩm:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            placeholder="Nhập tên loại sản phẩm"
                                            {...register('name')}
                                        />
                                        {errors.name?.message && (
                                            <p className="mt-2 text-danger">{errors.name?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Mã loại sản phẩm:
                                        </label>
                                        <input
                                            type="text"
                                            class="form-control form-control-color"
                                            name="code"
                                            placeholder="Nhập mã loại sản phẩm"
                                            {...register('code')}
                                        />
                                        {errors.code?.message && (
                                            <p className="mt-2 text-danger">{errors.code?.message}</p>
                                        )}
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Lưu
                                    </button>
                                    <Link
                                        to="/admin-list-productcategories"
                                        type="submit"
                                        className="btn btn-dark ml-3"
                                    >
                                        Quay lại
                                    </Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </>
    );
}

export default AddProductCategory;
