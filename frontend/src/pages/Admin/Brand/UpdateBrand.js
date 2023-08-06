import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useGetBrandData, useUpdateBrandData } from '~/hooks/react-query/brandData';
import { ToastContainer, toast } from 'react-toastify';
import { useMatch, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { updateBrand } from '~/services/admin/brand.service';
import LoadingAdmin from '~/components/LoadingAdmin';
import { LINK_BRAND_IMAGE } from '~/helpers/constants';

function UpdateBrand() {
    const [errorsForm, setErrorsForm] = useState([]);
    const { id } = useParams();
    const { isLoading, data, isError, error } = useGetBrandData(id);
    console.log(data);
    const schema = yup
        .object()
        .shape({
            id: yup.number(),
            name: yup.string().required('Vui lòng nhập tên thương hiệu'),
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
            setAvt(null);
            toast.success('Cập nhật thành công');
        } else {
            setErrorsForm(data.errors);
        }
    };
    const [avt, setAvt] = useState();

    useEffect(() => {
        return () => {
            avt && URL.revokeObjectURL(avt.preview);
        };
    }, [avt]);

    const handleImg = (e) => {
        const file = e.target.files[0];
        file.preview = URL.createObjectURL(file);
        file && setAvt(file);
        e.target.value = null;
    };
    const { mutate: updateBrand } = useUpdateBrandData(onSuccess);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('id', data.id);
        formData.append('name', data.name);
        formData.append('image', avt);
        updateBrand(formData);
    };
    if (isLoading) {
        return <LoadingAdmin />;
    }
    return (
        <>
            <>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Cập nhật thương hiệu</h6>
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
                                            Tên thương hiệu:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            placeholder="Nhập tên thương hiệu"
                                            {...register('name')}
                                        />
                                        {errors.name?.message && (
                                            <p className="mt-2 text-danger">{errors.name?.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Hình ảnh thương hiệu hiện tại:
                                        </label>
                                        <br></br>
                                        <img
                                            src={LINK_BRAND_IMAGE + data.data.image}
                                            className=" mt-4 mb-4"
                                            width="50%"
                                            height="50%"
                                            alt="..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Hình ảnh thương hiệu cập nhật:
                                        </label>
                                        <input
                                            type="file"
                                            class="form-control-file"
                                            id="exampleFormControlFile1"
                                            onChange={handleImg}
                                        />
                                        {avt && (
                                            <img
                                                src={avt.preview}
                                                className="mt-5 mb-5"
                                                width="50%"
                                                height="50%"
                                                alt=""
                                            />
                                        )}
                                    </div>

                                    <button type="submit" className="btn btn-primary">
                                        Lưu
                                    </button>
                                    <Link to="/admin-list-brands" type="submit" className="btn btn-dark ml-3">
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

export default UpdateBrand;
