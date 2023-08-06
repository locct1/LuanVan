import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAddWareHouseData } from '~/hooks/react-query/warehouseData';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
function AddWareHouse() {
    const schema = yup
        .object()
        .shape({
            name: yup.string().required('Vui lòng nhập tên nhà kho'),
            address: yup.string().required('Vui lòng nhập địa chỉ nhà kho'),
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
            resetField('address');
            toast.success('Tạo thành công');
        } else {
            setErrorsForm(data.errors);
        }
    };

    const { mutate: addWareHouse } = useAddWareHouseData(onSuccess);

    const onSubmit = async (data) => {
        addWareHouse(data);
    };
    return (
        <>
            <>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Thêm nhà kho</h6>
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
                                            Tên nhà kho:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            placeholder="Nhập tên nhà kho"
                                            {...register('name')}
                                        />
                                        {errors.name?.message && (
                                            <p className="mt-2 text-danger">{errors.name?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Địa chỉ nhà kho:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="address"
                                            placeholder="Nhập địa chỉ nhà kho"
                                            {...register('address')}
                                        />
                                        {errors.address?.message && (
                                            <p className="mt-2 text-danger">{errors.address?.message}</p>
                                        )}
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Lưu
                                    </button>
                                    <Link to="/admin-list-warehouses" type="submit" className="btn btn-dark ml-3">
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

export default AddWareHouse;
