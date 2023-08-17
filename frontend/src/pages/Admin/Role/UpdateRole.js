import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useGetRoleData, useUpdateRoleData } from '~/hooks/react-query/roleData';
import { ToastContainer, toast } from 'react-toastify';
import { useMatch, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { updateRole } from '~/services/admin/role.service';
import LoadingAdmin from '~/components/LoadingAdmin';

function UpdateRole() {
    const [errorsForm, setErrorsForm] = useState([]);
    const { id } = useParams();
    const { isLoading, data, isError, error } = useGetRoleData(id);
    const schema = yup
        .object()
        .shape({
            id: yup.string(),
            name: yup.string().required('Vui lòng nhập tên vai trò'),
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

    const { mutate: updateRole } = useUpdateRoleData(onSuccess);

    const onSubmit = async (data) => {
        console.log('checkdssds', data);
        updateRole(data);
    };
    if (isLoading) {
        return <LoadingAdmin />;
    }
    return (
        <>
            <>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Cập nhật vai trò</h6>
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
                                            Tên vai trò:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            placeholder="Nhập tên vai trò"
                                            {...register('name')}
                                        />
                                        {errors.name?.message && (
                                            <p className="mt-2 text-danger">{errors.name?.message}</p>
                                        )}
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Lưu
                                    </button>
                                    <Link to="/admin-list-roles" type="submit" className="btn btn-dark ml-3">
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

export default UpdateRole;
