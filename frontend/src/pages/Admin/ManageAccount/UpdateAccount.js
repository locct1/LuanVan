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
import { useGetAccountData, useUpdateAccountData } from '~/hooks/react-query/manageaccountData';
import { callAPIGetDistrict, callAPIGetProvince, callAPIGetWard } from '~/services/client/getaddress.service';
import { useRolesData } from '~/hooks/react-query/roleData';

function UpdateAccount() {
    const [errorsForm, setErrorsForm] = useState([]);
    const { id } = useParams();
    const { isLoading, data, isError, error } = useGetAccountData(id);
    const schema = yup
        .object()
        .shape({
            fullName: yup.string().required('Vui lòng nhập họ và tên'),
            phoneNumber: yup.string().matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, 'Số điện thoại không hợp lệ.'),
        })
        .required();
    const schemaAddress = yup
        .object()
        .shape({
            fullName: yup.string().required('Vui lòng nhập họ và tên'),
            phoneNumber: yup.string().matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, 'Số điện thoại không hợp lệ.'),
            newAddress: yup.string().required('Vui lòng nhập địa chỉ'),
            province: yup.string().required('Vui lòng chọn thành phố'),
            district: yup.string().required('Vui lòng chọn quận'),
            ward: yup.string().required('Vui lòng chọn phường'),
        })
        .required();
    const [showChangeAddress, setShowAddress] = useState(false);
    const {
        register,
        reset,
        handleSubmit,
        clearErrors,
        resetField,
        setValue,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(showChangeAddress ? schemaAddress : schema),
    });
    useEffect(() => {
        if (data && data.data) {
            console.log(data.data.address);
            console.log(data.data.address);
            setValue('fullName', data.data.fullName);
            setValue('phoneNumber', data.data.phoneNumber);
        }
    }, [data]);
    const [listProvinces, setListProvinces] = useState([]);
    const [listDistricts, setListDistricts] = useState([]);
    const [listWards, setListWards] = useState([]);
    const [province, setProvice] = useState();
    const [ward, setWard] = useState();
    const [district, setDistrict] = useState();
    useEffect(() => {
        reset(data);
    }, [data]);
    const handleProvinceChange = async (e) => {
        clearErrors('province');
        if (e.target.value === '') {
            return;
        }
        let ProvinceID = parseInt(e.target.value);
        let province = listProvinces.find((x) => x.ProvinceID === ProvinceID);
        setValue('province', e.target.value);
        console.log(ProvinceID);
        let response = await callAPIGetDistrict(ProvinceID);
        setListDistricts(response);
        setListWards([]);
        setProvice(province);
        setValue('ward', '');
        setValue('district', '');
    };
    const handleDistrictChange = async (e) => {
        clearErrors('district');
        let DistrictID = parseInt(e.target.value);
        let district = listDistricts.find((x) => x.DistrictID === DistrictID);
        setValue('district', e.target.value);
        setDistrict(district);
        let response = await callAPIGetWard(DistrictID);
        setListWards(response);
        setValue('ward', '');
    };
    const handleWardChange = async (e) => {
        clearErrors('ward');
        let WardCode = e.target.value;
        let ward = listWards.find((x) => x.WardCode === WardCode);
        setValue('ward', e.target.value);
        setWard(ward);
    };
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        let response = await callAPIGetProvince();
        if (response) {
            setListProvinces(response);
        }
    };
    const onSuccess = (data) => {
        if (data.success) {
            toast.success(data.message);
            setShowAddress(false);
            setListDistricts([]);
            setListWards([]);
            setListProvinces([]);
        } else {
            setErrorsForm(data.errors);
        }
    };

    const { mutate: updateAccount } = useUpdateAccountData(onSuccess);

    const onSubmit = async (dataForm) => {
        let fullAddress = '';
        setErrorsForm([]);
        if (showChangeAddress) {
            fullAddress =
                dataForm.newAddress +
                ', ' +
                ward.WardName +
                ', ' +
                district.DistrictName +
                ', ' +
                province.NameExtension[1];
        }
        let UpdateInfoClient = {
            id: data.data.id,
            fullName: dataForm.fullName,
            phoneNumber: dataForm.phoneNumber,
            address: showChangeAddress ? fullAddress : data.data.address,
            provinceID: showChangeAddress ? province.ProvinceID : data.data.provinceID,
            wardCode: showChangeAddress ? ward.WardCode : data.data.wardCode,
            districtID: showChangeAddress ? district.DistrictID : data.data.districtID,
            houseNumberAndStreet: showChangeAddress ? dataForm.newAddress : data.data.houseNumberAndStreet,
            roleNames: check,
        };
        console.log(data.data);
        updateAccount(UpdateInfoClient);
    };
    const handleShowChangeAddress = async () => {
        setShowAddress(!showChangeAddress);
        setListDistricts([]);
        setProvice('');
        setListWards([]);
        let response = await callAPIGetProvince();
        if (response) {
            setListProvinces(response);
        }
        clearErrors('province');
        clearErrors('district');
        clearErrors('ward');
        setValue('province', '');
        setValue('district', '');
        setValue('ward', '');
        resetField('newAddress');
    };
    //role
    const [check, setCheck] = useState([]);
    const { isLoading: rolesIsLoading, isError: rolesIsError, data: rolesData, error: rolesError } = useRolesData();
    const handleChange = (roleName) => {
        if (check.includes(roleName)) {
            setCheck(check.filter((value) => value !== roleName));
        } else {
            setCheck([...check, roleName]);
        }
    };
    useEffect(() => {
        if (data && data.data) {
            setCheck(data.data.roleNames);
        }
    }, [id, data]);
    if (isLoading || rolesIsLoading) {
        return <LoadingAdmin />;
    }

    return (
        <>
            <>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Cập nhật tài khoản</h6>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                                <div className="col-7">
                                    {errorsForm && errorsForm.length > 0 && (
                                        <>
                                            {errorsForm.map((error, index) => (
                                                <p className="text-danger" key={index}>
                                                    {error}
                                                </p>
                                            ))}
                                        </>
                                    )}
                                    <div className="form-group">
                                        <label className="text-dark font-weight-bold">Họ và tên:</label>
                                        <input
                                            type="text"
                                            placeholder="Nhập họ tên"
                                            {...register('fullName')}
                                            className="form-control"
                                        />
                                        {errors.fullName?.message && (
                                            <p className="mt-2 text-danger">{errors.fullName?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-dark font-weight-bold">Email:</label>
                                        <input
                                            type="text"
                                            disabled={'disabled'}
                                            value={data?.data.email}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-dark font-weight-bold">Số điện thoại:</label>
                                        <input
                                            type="text"
                                            placeholder="Nhập số điện thoại"
                                            {...register('phoneNumber')}
                                            className="form-control"
                                        />
                                        {errors.phoneNumber?.message && (
                                            <p className="mt-2 text-danger">{errors.phoneNumber?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-dark font-weight-bold">Địa chỉ:</label>
                                        <input
                                            type="text"
                                            placeholder="Nhập địa chỉ"
                                            value={data?.data.address}
                                            disabled={'disabled'}
                                            className="form-control"
                                        />
                                        {errors.address?.message && (
                                            <p className="mt-2 text-danger">{errors.address?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-dark font-weight-bold">Vai trò:</label>
                                        {rolesData.data.map((role, index) => (
                                            <div key={role.name} className="ml-4 mt-1">
                                                <label className="form-check-label">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        onChange={() => handleChange(role.name)}
                                                        checked={check.includes(role.name)}
                                                    />
                                                    {role.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="btn btn-primary mb-3" onClick={handleShowChangeAddress}>
                                        Đổi địa chỉ
                                    </button>
                                    <Link
                                        to={`/admin-change-password/${data?.data.id}`}
                                        className="btn btn-info mb-3 ml-3"
                                    >
                                        Đổi mật khẩu
                                    </Link>
                                    {showChangeAddress === true ? (
                                        <>
                                            <div class="form-group">
                                                <label className="text-dark font-weight-bold" for="inputState">
                                                    Tỉnh/Thành phố:
                                                </label>
                                                <select
                                                    id="inputState"
                                                    class="form-control"
                                                    value={province?.ProvinceID || ''}
                                                    onChange={handleProvinceChange}
                                                >
                                                    <option selected value="">
                                                        Chọn tỉnh/thành phố
                                                    </option>
                                                    {listProvinces?.map((province, index) => (
                                                        <option value={province.ProvinceID} key={index}>
                                                            {province.NameExtension[1]}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.province?.message && (
                                                    <p className="mt-2 text-danger">{errors.province?.message}</p>
                                                )}
                                            </div>
                                            <div class="form-group">
                                                <label className="text-dark font-weight-bold" for="inputState">
                                                    Quận/Huyện:
                                                </label>
                                                <select
                                                    id="inputState"
                                                    class="form-control"
                                                    value={district?.DistrictID || ''}
                                                    onChange={handleDistrictChange}
                                                >
                                                    <option selected value="">
                                                        Chọn quận/huyện
                                                    </option>
                                                    {listDistricts?.map((district, index) => (
                                                        <option value={district.DistrictID} key={index}>
                                                            {district.DistrictName}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.district?.message && (
                                                    <p className="mt-2 text-danger">{errors.district?.message}</p>
                                                )}
                                            </div>
                                            <div class="form-group">
                                                <label className="text-dark font-weight-bold" for="inputState">
                                                    Phường/Xã:
                                                </label>
                                                <select
                                                    id="inputState"
                                                    class="form-control"
                                                    value={ward?.WardCode || ''}
                                                    onChange={handleWardChange}
                                                >
                                                    <option selected value="">
                                                        Chọn phường/xã
                                                    </option>
                                                    {listWards?.map((ward, index) => (
                                                        <option value={ward.WardCode} key={index}>
                                                            {ward.WardName}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.ward?.message && (
                                                    <p className="mt-2 text-danger">{errors.ward?.message}</p>
                                                )}
                                            </div>
                                            <div className="form-group">
                                                <label className="text-dark font-weight-bold">Số nhà/đường:</label>
                                                <textarea
                                                    class="form-control"
                                                    id="exampleFormControlTextarea1"
                                                    rows="3"
                                                    placeholder="Nhập số nhà"
                                                    {...register('newAddress')}
                                                ></textarea>
                                                {errors.newAddress?.message && (
                                                    <p className="mt-2 text-danger">{errors.newAddress?.message}</p>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Lưu
                            </button>
                            <Link to="/admin-list-manage-accounts" type="submit" className="btn btn-dark ml-3">
                                Quay lại
                            </Link>
                        </form>
                    </div>
                </div>
            </>
        </>
    );
}

export default UpdateAccount;
