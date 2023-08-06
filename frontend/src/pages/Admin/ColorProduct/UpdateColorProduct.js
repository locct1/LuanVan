import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useGetColorProductData, useUpdateColorProductData } from '~/hooks/react-query/colorproductData';
import { ToastContainer, toast } from 'react-toastify';
import { useMatch, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { updateColorProduct } from '~/services/admin/colorproduct.service';
import LoadingAdmin from '~/components/LoadingAdmin';

function UpdateColorProduct() {
    const [errorsForm, setErrorsForm] = useState([]);
    const { id } = useParams();
    const { isLoading, data, isError, error } = useGetColorProductData(id);
    console.log(data);
    const schema = yup
        .object()
        .shape({
            id: yup.number(),
            name: yup.string().required('Vui lòng nhập tên màu sắc'),
            codeColor: yup.string().required('Vui lòng nhập mã màu sắc'),
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
            setValue('codeColor', data.data.codeColor);
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

    const { mutate: updateColorProduct } = useUpdateColorProductData(onSuccess);

    const onSubmit = async (data) => {
        console.log(data);
        updateColorProduct(data);
    };
    if (isLoading) {
        return <LoadingAdmin />;
    }
    return (
        <>
            <>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Cập nhật màu sắc</h6>
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
                                            Tên màu sắc:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            placeholder="Nhập tên màu sắc"
                                            {...register('name')}
                                        />
                                        {errors.name?.message && (
                                            <p className="mt-2 text-danger">{errors.name?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Mã màu sắc:
                                        </label>
                                        <input
                                            type="color"
                                            class="form-control form-control-color"
                                            name="codeColor"
                                            placeholder="Nhập địa chỉ màu sắc"
                                            {...register('codeColor')}
                                        />
                                        {errors.codeColor?.message && (
                                            <p className="mt-2 text-danger">{errors.codeColor?.message}</p>
                                        )}
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Lưu
                                    </button>
                                    <Link to="/admin-list-colorproducts" type="submit" className="btn btn-dark ml-3">
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

export default UpdateColorProduct;
