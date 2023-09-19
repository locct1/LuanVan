import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
    useUpdateProductData,
    useGetProductData,
    useRamsData,
    useRomsData,
    useChipsData,
    useChipTypesData,
    useOperatingSystemTypesData,
    useOperatingSystemsData,
    useScreenTechnologiesData,
    useDeleteProductVersionData,
} from '~/hooks/react-query/productData';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useBrandsData } from '~/hooks/react-query/brandData';
import { useWareHousesData } from '~/hooks/react-query/warehouseData';
import { useColorProductsData } from '~/hooks/react-query/colorproductData';
import LoadingAdmin from '~/components/LoadingAdmin';
import Select from 'react-select';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import parse from 'html-react-parser';
import { useMatch, useParams } from 'react-router-dom';
import { LINK_PRODUCT_IMAGE, htmlTable } from '~/helpers/constants';
function UpdateProduct() {
    const [formattedPriceIn, setFormattedPriceIn] = useState('');
    const [formattedPriceOut, setFormattedPriceOut] = useState('');
    const [selectedOption, setSelectedOption] = useState([]);
    const [listColorProducts, setListColorProducts] = useState(null);
    const { id } = useParams();
    const { isLoading, data, isError, error } = useGetProductData(id);
    const schema = yup
        .object()
        .shape({
            id: yup.number(),
            name: yup.string().required('Vui lòng nhập tên sản phẩm'),
            warehouseId: yup.number().typeError('Vui lòng chọn nhà kho').required('Vui lòng chọn nhà kho'),
            brandId: yup.number().typeError('Vui lòng chọn thương hiệu').required('Vui lòng chọn thương hiệu'),
            infomation: yup.string().required('Vui lòng nhập thông tin sản phẩm'),
            isVersionRam: yup.number().typeError('Vui lòng chọn phiên bản').required('Vui lòng chọn phiên bản'),
            resolution: yup.string().required('Vui lòng nhập độ phân giải'),
            screenWidth: yup.string().required('Vui lòng nhập kích thước màn hình'),
            frontCamera: yup.string().required('Vui lòng nhập camera trước'),
            rearCamera: yup.string().required('Vui lòng nhập camera sau'),
            sim: yup.string().required('Vui lòng nhập sim'),
            battery: yup.string().required('Vui lòng nhập pin'),
            charging: yup.string().required('Vui lòng nhập sạc'),
            screenTechnologyId: yup
                .number()
                .typeError('Vui lòng chọn công nghệ màn hình')
                .required('Vui lòng chọn công nghệ màn hình'),
            chipId: yup.number().typeError('Vui lòng chọn chip').required('Vui lòng chọn chip'),
            operatingSystemId: yup
                .number()
                .typeError('Vui lòng chọn hệ điều hành')
                .required('Vui lòng chọn hệ điều hành'),
            colorproducts: yup
                .array()
                .min(1, 'Vui lòng chọn ít nhất một màu')
                .required('Vui lòng chọn ít nhất một màu'),
        })
        .required();
    const {
        register,
        resetField,
        handleSubmit,
        setValue,
        clearErrors,
        trigger,
        getValues,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
    });
    const [productVersionList, setProductVersionList] = useState([
        {
            ramId: '',
            romId: '',
            formattedPriceIn: '',
            formattedPriceOut: '',
            priceIn: 0,
            priceOut: 0,
        },
    ]);
    useEffect(() => {
        if (data) {
            // const rawValuePriceIn = data.data.priceIn.toString().replace(/,/g, '');
            // const formattedValuePriceIn = formatPrice(rawValuePriceIn);
            // setFormattedPriceIn(formattedValuePriceIn);
            // setValue('priceIn', rawValuePriceIn);
            const convertedOptions = data.data.productColorProducts.map((option) => ({
                value: option.colorProduct.id,
                label: option.colorProduct.name,
            }));
            const convertproductVersionsedOptions = data.data.productVersions.map((version) => ({
                ...version,
                formattedPriceIn: version.priceIn.toLocaleString(),
                formattedPriceOut: version.priceOut.toLocaleString(),
            }));
            console.log(convertproductVersionsedOptions);
            setSelectedOption(convertedOptions);
            setProductVersionList(convertproductVersionsedOptions);
            // const rawValuePriceOut = data.data.priceOut.toString().replace(/,/g, '');
            // const formattedValuePriceOut = formatPrice(rawValuePriceOut);
            // setFormattedPriceOut(formattedValuePriceOut);
            // setValue('priceOut', rawValuePriceOut);
            //
            let isVersionRam = (data.isVersionRam = data.isVersionRam === true ? 0 : 1);
            setValue('name', data.data.name);
            setValue('warehouseId', data.data.wareHouseId);
            setValue('brandId', data.data.brandId);
            setValue('infomation', data.data.infomation);
            setValue('isVersionRam', isVersionRam);
            setValue('resolution', data.data.resolution);
            setValue('screenWidth', data.data.screenWidth);
            setValue('frontCamera', data.data.frontCamera);
            setValue('rearCamera', data.data.rearCamera);
            setValue('battery', data.data.battery);
            setValue('sim', data.data.sim);
            setValue('charging', data.data.charging);
            setValue('screenTechnologyId', data.data.screenTechnologyId);
            setValue('chipId', data.data.chipId);
            setValue('operatingSystemId', data.data.operatingSystemProductId);
            setValue('id', data.data.id);
            setValue('colorproducts', convertedOptions);
        }
    }, [data]);
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
            toast.success('Lưu thành công');
        } else {
            setErrorsForm(data.errors);
        }
    };

    const { mutate: updateProduct } = useUpdateProductData(onSuccess);
    const { isLoading: isLoadingBrands, data: dataBrands, isError: isErrorBrands, error: errorBrand } = useBrandsData();
    const {
        isLoading: isLoadingWareHouses,
        data: dataWareHouses,
        isError: isErrorWareHouses,
        error: errorWareHouses,
    } = useWareHousesData();
    const {
        isLoading: isLoadingColorProducts,
        data: dataColorProducts,
        isError: isErrorColorProducts,
        error: errorColorProducts,
    } = useColorProductsData();
    const { isLoading: isLoadingRams, data: dataRams, isError: isErrorRams, error: errorRam } = useRamsData();
    const { isLoading: isLoadingRoms, data: dataRoms, isError: isErrorRoms, error: errorRoms } = useRomsData();
    const {
        isLoading: isLoadingChipTypes,
        data: dataChipTypes,
        isError: isErrorChipTypes,
        error: errorChipTypes,
    } = useChipTypesData();
    const { isLoading: isLoadingChips, data: dataChips, isError: isErrorChips, error: errorChips } = useChipsData();
    const {
        isLoading: isLoadingOperatingSystemTypes,
        data: dataOperatingSystemTypes,
        isError: isErrorOperatingSystemTypes,
        error: errorOperatingSystemTypes,
    } = useOperatingSystemTypesData();
    const {
        isLoading: isLoadingOperatingSystems,
        data: dataOperatingSystems,
        isError: isErrorOperatingSystems,
        error: errorOperatingSystems,
    } = useOperatingSystemsData();
    const {
        isLoading: isLoadingScreenTechnologies,
        data: dataScreenTechnologies,
        isError: isErrorScreenTechnologies,
        error: errorScreenTechnologies,
    } = useScreenTechnologiesData();
    useEffect(() => {
        if (dataColorProducts) {
            const convertedOptions = dataColorProducts.data.map((option) => ({
                value: option.id,
                label: option.name,
            }));
            setListColorProducts(convertedOptions);
        }
    }, [dataColorProducts]);
    // Helper function to format the input with commas for thousand separators
    const formatPrice = (value) => {
        return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    const onSuccessChangeStatus = () => {
        toast.success('Đổi trạng thái thành công');
    };
    const onSuccessDelete = () => {
        toast.success('Xóa phiên bản thành công');
    };
    const { mutate: deleteProductVersion } = useDeleteProductVersionData(onSuccessDelete);
    const handleSelectChange = (selected) => {
        clearErrors('colorproducts');
        setSelectedOption(selected);
        setValue('colorproducts', selected);
    };
    //////////////
    // ProductVersionList

    const handleStepChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...productVersionList];
        if (name === 'priceIn') {
            const rawValue = value.replace(/,/g, '');
            const formattedValue = formatPrice(rawValue);
            list[index][name] = parseInt(rawValue);
            list[index]['formattedPriceIn'] = formattedValue;
        } else if (name === 'priceOut') {
            const rawValue = value.replace(/,/g, '');
            const formattedValue = formatPrice(rawValue);
            list[index][name] = parseInt(rawValue);
            list[index]['formattedPriceOut'] = formattedValue;
        } else {
            list[index][name] = value;
        }
        setProductVersionList(list);
    };
    const handleStepRemove = (index) => {
        const list = [...productVersionList];
        let productVersion = productVersionList[index];
        if (productVersion.id) {
            deleteProductVersion(productVersion.id);
        }
        list.splice(index, 1);
        setProductVersionList(list);
    };

    const handleStepAdd = () => {
        setProductVersionList([...productVersionList, { ramId: '', romId: '', priceIn: 0, priceOut: 0 }]);
    };
    /////////////
    const onSubmit = async (data) => {
        data.isVersionRam = data.isVersionRam === 1 ? true : false;
        console.log(data.colorproducts);
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('id', data.id);
        formData.append('warehouseId', data.warehouseId);
        formData.append('brandId', data.brandId);
        formData.append('infomation', data.infomation);
        formData.append('technicalDetail', data.technicalDetail);
        formData.append('colorproducts', JSON.stringify(data.colorproducts));
        formData.append('productVersionList', JSON.stringify(productVersionList));
        formData.append('isVersionRam', data.isVersionRam);
        formData.append('resolution', data.resolution);
        formData.append('screenWidth', data.screenWidth);
        formData.append('frontCamera', data.frontCamera);
        formData.append('rearCamera', data.rearCamera);
        formData.append('battery', data.battery);
        formData.append('sim', data.sim);
        formData.append('charging', data.charging);
        formData.append('screenTechnologyId', data.screenTechnologyId);
        formData.append('chipId', data.chipId);
        formData.append('operatingSystemProductId', data.operatingSystemId);
        formData.append('image', avt);
        console.log(data);
        console.log(productVersionList);
        updateProduct(formData);
    };
    if (
        isLoadingBrands ||
        isLoadingColorProducts ||
        isLoadingWareHouses ||
        isLoading ||
        isLoadingRams ||
        isLoadingRoms ||
        isLoadingChipTypes ||
        isLoadingChips ||
        isLoadingOperatingSystemTypes ||
        isLoadingOperatingSystems ||
        isLoadingScreenTechnologies
    ) {
        return <LoadingAdmin />;
    }
    return (
        <>
            <>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Cập nhật sản phẩm</h6>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-8">
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
                                            Tên sản phẩm:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            placeholder="Nhập tên sản phẩm"
                                            {...register('name')}
                                        />
                                        {errors.name?.message && (
                                            <p className="mt-2 text-danger">{errors.name?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Nhà kho:
                                        </label>
                                        <select class="form-control" name="warehouseId" {...register('warehouseId')}>
                                            <option disabled selected value="">
                                                Chọn nhà kho
                                            </option>
                                            {dataWareHouses.data?.map((warehouse, index) => (
                                                <option value={warehouse.id} key={warehouse.id}>
                                                    {warehouse.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.warehouseId?.message && (
                                            <p className="mt-2 text-danger">{errors.warehouseId?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Thương hiệu:
                                        </label>
                                        <select class="form-control" name="brandId" {...register('brandId')}>
                                            <option disabled selected value="">
                                                Chọn thương hiệu
                                            </option>
                                            {dataBrands.data?.map((brand, index) => (
                                                <option value={brand.id} key={brand.id}>
                                                    {brand.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.brandId?.message && (
                                            <p className="mt-2 text-danger">{errors.brandId?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Màu sắc:
                                        </label>
                                        <Select
                                            value={selectedOption}
                                            isMulti
                                            name="colors"
                                            options={listColorProducts}
                                            onChange={handleSelectChange}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            placeholder="Chọn màu sắc"
                                        />
                                        {errors.colorproducts?.message && (
                                            <p className="mt-2 text-danger">{errors.colorproducts?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Thông tin sản phẩm:
                                        </label>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={getValues('infomation')}
                                            onReady={(editor) => {
                                                // You can store the "editor" and use when it is needed.
                                                console.log('Editor is ready to use!', editor);
                                            }}
                                            onChange={(event, editor) => {
                                                setValue('infomation', editor.getData());
                                                trigger('infomation');
                                            }}
                                        />
                                        {errors.infomation?.message && (
                                            <p className="mt-2 text-danger">{errors.infomation?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Thông số kỹ thuật:
                                        </label>
                                    </div>
                                    <div className="form-group row">
                                        <label
                                            htmlFor="inputPassword"
                                            className="col-sm-2 col-form-label font-weight-bold"
                                        >
                                            Công nghệ màn hình:
                                        </label>
                                        <div className="col-sm-10">
                                            <select
                                                className="form-control"
                                                name="screenTechnologyId"
                                                {...register('screenTechnologyId')}
                                            >
                                                <option disabled selected value="">
                                                    Chọn công nghệ màn hình
                                                </option>
                                                {dataScreenTechnologies.data?.map((screenTechnology, index) => (
                                                    <option value={screenTechnology.id} key={screenTechnology.id}>
                                                        {screenTechnology.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.screenTechnologyId?.message && (
                                                <p className="mt-2 text-danger">{errors.screenTechnologyId?.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label
                                            htmlFor="inputPassword"
                                            className="col-sm-2 col-form-label font-weight-bold"
                                        >
                                            Độ phân giải:
                                        </label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="resolution"
                                                placeholder="Nhập độ phân giải"
                                                {...register('resolution')}
                                            />
                                            {errors.resolution?.message && (
                                                <p className="mt-2 text-danger">{errors.resolution?.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label
                                            htmlFor="inputPassword"
                                            className="col-sm-2 col-form-label font-weight-bold"
                                        >
                                            Màn hình rộng:
                                        </label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="screenWidth"
                                                placeholder="Nhập màn hình rộng"
                                                {...register('screenWidth')}
                                            />
                                            {errors.screenWidth?.message && (
                                                <p className="mt-2 text-danger">{errors.screenWidth?.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label
                                            htmlFor="inputPassword"
                                            className="col-sm-2 col-form-label font-weight-bold"
                                        >
                                            Hệ điêu hành:
                                        </label>
                                        <div className="col-sm-10">
                                            <select
                                                className="form-control"
                                                name="operatingSystemId"
                                                {...register('operatingSystemId')}
                                            >
                                                <option disabled selected value="">
                                                    Chọn hệ điều hành
                                                </option>
                                                {dataOperatingSystems.data?.map((operatingSystem, index) => (
                                                    <option value={operatingSystem.id} key={operatingSystem.id}>
                                                        {operatingSystem.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.operatingSystemId?.message && (
                                                <p className="mt-2 text-danger">{errors.operatingSystemId?.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label
                                            htmlFor="inputPassword"
                                            className="col-sm-2 col-form-label font-weight-bold"
                                        >
                                            Camera trước:
                                        </label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="frontCamera"
                                                placeholder="Nhập camera trước"
                                                {...register('frontCamera')}
                                            />
                                            {errors.frontCamera?.message && (
                                                <p className="mt-2 text-danger">{errors.frontCamera?.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label
                                            htmlFor="inputPassword"
                                            className="col-sm-2 col-form-label font-weight-bold"
                                        >
                                            Camera sau:
                                        </label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="rearCamera"
                                                placeholder="Nhập camera sau"
                                                {...register('rearCamera')}
                                            />
                                            {errors.rearCamera?.message && (
                                                <p className="mt-2 text-danger">{errors.rearCamera?.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label
                                            htmlFor="inputPassword"
                                            className="col-sm-2 col-form-label font-weight-bold"
                                        >
                                            Chip:
                                        </label>
                                        <div className="col-sm-10">
                                            <select className="form-control" name="chipId" {...register('chipId')}>
                                                <option disabled selected value="">
                                                    Chọn chip
                                                </option>
                                                {dataChips.data?.map((chip, index) => (
                                                    <option value={chip.id} key={chip.id}>
                                                        {chip.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.chipId?.message && (
                                                <p className="mt-2 text-danger">{errors.chipId?.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label
                                            htmlFor="inputPassword"
                                            className="col-sm-2 col-form-label font-weight-bold"
                                        >
                                            SIM:
                                        </label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="sim"
                                                placeholder="Nhập sim"
                                                {...register('sim')}
                                            />
                                            {errors.sim?.message && (
                                                <p className="mt-2 text-danger">{errors.sim?.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label
                                            htmlFor="inputPassword"
                                            className="col-sm-2 col-form-label font-weight-bold"
                                        >
                                            Pin:
                                        </label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="battery"
                                                placeholder="Nhập pin"
                                                {...register('battery')}
                                            />
                                            {errors.battery?.message && (
                                                <p className="mt-2 text-danger">{errors.battery?.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label
                                            htmlFor="inputPassword"
                                            className="col-sm-2 col-form-label font-weight-bold"
                                        >
                                            Sạc:
                                        </label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="charging"
                                                placeholder="Nhập sạc"
                                                {...register('charging')}
                                            />
                                            {errors.charging?.message && (
                                                <p className="mt-2 text-danger">{errors.charging?.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label
                                            htmlFor="inputPassword"
                                            className="col-sm-2 col-form-label font-weight-bold"
                                        >
                                            Phiên bản:
                                        </label>
                                        <div className="col-sm-10">
                                            <select
                                                className="form-control"
                                                name="isVersionRam"
                                                {...register('isVersionRam')}
                                            >
                                                <option disabled selected value="">
                                                    Chọn phiên bản
                                                </option>
                                                <option value={1} key={1}>
                                                    Ram
                                                </option>
                                                <option value={0} key={0}>
                                                    Rom
                                                </option>
                                            </select>
                                            {errors.isVersionRam?.message && (
                                                <p className="mt-2 text-danger">{errors.isVersionRam?.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <table className="table table-bordered mt-3">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="w-25">
                                                    Ram
                                                </th>
                                                <th scope="col" className="w-25">
                                                    Rom
                                                </th>
                                                <th scope="col" className="w-30">
                                                    Giá nhập
                                                </th>
                                                <th scope="col" className="w-30">
                                                    Giá bán
                                                </th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productVersionList.map((step, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="services">
                                                            <div className="first-division">
                                                                <select
                                                                    id="ramId"
                                                                    className="form-control"
                                                                    name="ramId"
                                                                    value={step.ramId === '' ? '' : step.ramId}
                                                                    onChange={(e) => handleStepChange(e, index)}
                                                                >
                                                                    <option disabled selected value="">
                                                                        Chọn ram
                                                                    </option>
                                                                    {dataRams.data?.map((item, index) => (
                                                                        <option value={item.id} key={item.id}>
                                                                            {item.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="services">
                                                            <div className="first-division">
                                                                <select
                                                                    id="romId"
                                                                    className="form-control"
                                                                    name="romId"
                                                                    value={step.romId === '' ? '' : step.romId}
                                                                    onChange={(e) => handleStepChange(e, index)}
                                                                >
                                                                    <option disabled selected value="">
                                                                        Rom
                                                                    </option>
                                                                    {dataRoms.data?.map((item, index) => (
                                                                        <option value={item.id} key={item.id}>
                                                                            {item.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div key={index} className="services">
                                                            <div className="first-division">
                                                                <input
                                                                    name="priceIn"
                                                                    type="text"
                                                                    id="priceIn"
                                                                    className="form-control"
                                                                    value={step.formattedPriceIn}
                                                                    onChange={(e) => handleStepChange(e, index)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div key={index} className="services">
                                                            <div className="first-division">
                                                                <input
                                                                    name="priceOut"
                                                                    type="text"
                                                                    id="priceOut"
                                                                    className="form-control"
                                                                    value={step.formattedPriceOut}
                                                                    onChange={(e) => handleStepChange(e, index)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {productVersionList.length !== 1 && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleStepRemove(index)}
                                                                    className="btn btn-danger ml-2"
                                                                >
                                                                    <i className="fas fa-trash-alt"></i>
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="text-center">
                                                <td colSpan={6}>
                                                    {
                                                        <button
                                                            type="button"
                                                            onClick={handleStepAdd}
                                                            className="btn btn-success m-auto"
                                                        >
                                                            <span>+</span>
                                                        </button>
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div>
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Hình ảnh sản phẩm hiện tại:
                                        </label>
                                        <br></br>
                                        <img
                                            src={LINK_PRODUCT_IMAGE + data.data.image}
                                            className=" mt-4 mb-4"
                                            width="50%"
                                            height="50%"
                                            alt="..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Hình ảnh sản phẩm:
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
                                    <Link to="/admin-list-products" type="submit" className="btn btn-dark ml-3">
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

export default UpdateProduct;
