import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useGetSupplierData, useUpdateSupplierData } from '~/hooks/react-query/supplierData';
import { ToastContainer, toast } from 'react-toastify';
import { useMatch, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { updateSupplier } from '~/services/admin/supplier.service';
import LoadingAdmin from '~/components/LoadingAdmin';

function UpdateSupplier() {
    const [errorsForm, setErrorsForm] = useState([]);
    const { id } = useParams();
    const { isLoading, data, isError, error } = useGetSupplierData(id);
    console.log(data);
    const schema = yup
        .object()
        .shape({
            id: yup.number(),
            name: yup.string().required('Vui lòng nhập tên nhà cung cấp'),
            email: yup.string().required('Vui lòng nhập email nhà cung cấp'),
            phoneNumber: yup.string().required('Vui lòng số điện thoại nhà cung cấp'),
            address: yup.string().required('Vui lòng nhập địa chỉ nhà cung cấp'),
        })
        .required();
    const {
        register,
        resetField,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
    });
    // Update the form's defaultValues when data changes
    useEffect(() => {
        if (data) {
            setValue('name', data.data.name);
            setValue('email', data.data.email);
            setValue('phoneNumber', data.data.phoneNumber);
            setValue('address', data.data.address);
            setValue('id', data.data.id);
        }
    }, [data]);
    const onSuccess = (data) => {
        if (data.success) {
            toast.success('Cập nhật thành công');
        } else {
            setErrorsForm(data.errors);
        }
    };

    const { mutate: updateSupplier } = useUpdateSupplierData(onSuccess);

    const onSubmit = async (data) => {
        console.log(data);
        updateSupplier(data);
    };
    if (isLoading) {
        return <LoadingAdmin />;
    }
    return (
        <>
            <>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Cập nhật nhà cung cấp</h6>
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
                                            Tên nhà cung cấp:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            placeholder="Nhập tên nhà cung cấp"
                                            {...register('name')}
                                        />
                                        {errors.name?.message && (
                                            <p className="mt-2 text-danger">{errors.name?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Địa chỉ nhà cung cấp:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="address"
                                            placeholder="Nhập địa chỉ nhà cung cấp"
                                            {...register('address')}
                                        />
                                        {errors.address?.message && (
                                            <p className="mt-2 text-danger">{errors.address?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Số điện thoại nhà cung cấp:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="phoneNumber"
                                            placeholder="Nhập địa chỉ nhà cung cấp"
                                            {...register('phoneNumber')}
                                        />
                                        {errors.phoneNumber?.message && (
                                            <p className="mt-2 text-danger">{errors.phoneNumber?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Email nhà cung cấp:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="email"
                                            placeholder="Nhập email nhà cung cấp"
                                            {...register('email')}
                                        />
                                        {errors.email?.message && (
                                            <p className="mt-2 text-danger">{errors.email?.message}</p>
                                        )}
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Lưu
                                    </button>
                                    <Link to="/admin-list-suppliers" type="submit" className="btn btn-dark ml-3">
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

export default UpdateSupplier;
