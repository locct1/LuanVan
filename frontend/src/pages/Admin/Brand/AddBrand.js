import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAddBrandData } from '~/hooks/react-query/brandData';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
function AddBrand() {
    const schema = yup
        .object()
        .shape({
            name: yup.string().required('Vui lòng nhập tên thương hiệu'),
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

    const [errorsForm, setErrorsForm] = useState([]);
    const onSuccess = (data) => {
        if (data.success) {
            resetField('name');
            setAvt(null);
            toast.success('Tạo thành công');
        } else {
            setErrorsForm(data.errors);
        }
    };

    const { mutate: addBrand } = useAddBrandData(onSuccess);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('image', avt);
        console.log(data);
        addBrand(formData);
    };
    return (
        <>
            <>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Thêm thương hiệu</h6>
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
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Hình ảnh thương hiệu:
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

export default AddBrand;
