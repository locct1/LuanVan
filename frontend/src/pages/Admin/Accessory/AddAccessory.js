import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
    useAddAccessoryData,
    useAddProductData,
    useChargePortsData,
    useChargePortssData,
    useChipTypesData,
    useChipsData,
    useJackPlugsData,
    useOperatingSystemTypesData,
    useOperatingSystemsData,
    useRamsData,
    useRomsData,
    useScreenTechnologiesData,
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
import { htmlTable } from '~/helpers/constants';
import { useProductCategoriesData } from '~/hooks/react-query/productcategoryData';
function AddAccessory() {
    const navigate = useNavigate();
    const [formattedPriceIn, setFormattedPriceIn] = useState('');
    const [formattedPriceOut, setFormattedPriceOut] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [listColorProducts, setListColorProducts] = useState(null);
    const [productCategory, setProductCategory] = useState(null);

    const { isLoading: isLoadingProductCategories, data: dataProductCategories } = useProductCategoriesData();
    const schemaSACDUPHONG = yup
        .object()
        .shape({
            name: yup.string().required('Vui lòng nhập tên sản phẩm'),
            productCategoryId: yup.string().required('Vui lòng nhập loại sản phẩm'),
            warehouseId: yup.number().typeError('Vui lòng chọn nhà kho').required('Vui lòng chọn nhà kho'),
            brandId: yup.number().typeError('Vui lòng chọn thương hiệu').required('Vui lòng chọn thương hiệu'),
            infomation: yup.string().required('Vui lòng nhập thông tin sản phẩm'),
            battery: yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập pin'),
            charging: yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập công suất sạc'),
            priceIn: yup.number().typeError('Vui lòng nhập giá nhập').required('Vui lòng nhập giá nhập'),
            priceOut: yup.number().typeError('Vui lòng nhập giá bán').required('Vui lòng nhập giá bán'),
            weight: yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập khối lượng'),
            width: yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập chiều dài sản phẩm'),
            height: yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập độ dày'),
            length: yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập chiều dài'),
            chargerPortId: yup.number().typeError('Vui lòng chọn cổng sạc').required('Vui lòng chọn cổng sạc'),
            jackPlugId: yup.number().typeError('Vui lòng chọn jack cắm').required('Vui lòng chọn jack cắm'),
            colorproducts: yup
                .array()
                .min(1, 'Vui lòng chọn ít nhất một màu')
                .required('Vui lòng chọn ít nhất một màu'),
        })
        .required();
    const schemaTAINGHE = yup
        .object()
        .shape({
            name: yup.string().required('Vui lòng nhập tên sản phẩm'),
            productCategoryId: yup.string().required('Vui lòng nhập loại sản phẩm'),
            warehouseId: yup.number().typeError('Vui lòng chọn nhà kho').required('Vui lòng chọn nhà kho'),
            brandId: yup.number().typeError('Vui lòng chọn thương hiệu').required('Vui lòng chọn thương hiệu'),
            infomation: yup.string().required('Vui lòng nhập thông tin sản phẩm'),
            headPhoneTime: yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập thời gian dùng'),
            chargerPortId: yup.number().typeError('Vui lòng chọn cổng sạc').required('Vui lòng chọn cổng sạc'),
            jackPlugId: yup.number().typeError('Vui lòng chọn jack cắm').required('Vui lòng chọn jack cắm'),
            priceIn: yup.number().typeError('Vui lòng nhập giá nhập').required('Vui lòng nhập giá nhập'),
            priceOut: yup.number().typeError('Vui lòng nhập giá bán').required('Vui lòng nhập giá bán'),
            weight: yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập khối lượng'),
            width: yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập chiều dài sản phẩm'),
            height: yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập độ dày'),
            length: yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập chiều dài'),
            colorproducts: yup
                .array()
                .min(1, 'Vui lòng chọn ít nhất một màu')
                .required('Vui lòng chọn ít nhất một màu'),
        })
        .required();
    const schemaOPLUNG = yup
        .object()
        .shape({
            name: yup.string().required('Vui lòng nhập tên sản phẩm'),
            productCategoryId: yup.string().required('Vui lòng nhập loại sản phẩm'),
            warehouseId: yup.number().typeError('Vui lòng chọn nhà kho').required('Vui lòng chọn nhà kho'),
            brandId: yup.number().typeError('Vui lòng chọn thương hiệu').required('Vui lòng chọn thương hiệu'),
            infomation: yup.string().required('Vui lòng nhập thông tin sản phẩm'),
            priceIn: yup.number().typeError('Vui lòng nhập giá nhập').required('Vui lòng nhập giá nhập'),
            priceOut: yup.number().typeError('Vui lòng nhập giá bán').required('Vui lòng nhập giá bán'),
            weight: yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập khối lượng'),
            width: yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập chiều dài sản phẩm'),
            height: yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập độ dày'),
            length: yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập chiều dài'),
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
        resolver: (() => {
            if (productCategory?.code === 'SACDUPHONG') {
                return yupResolver(schemaSACDUPHONG);
            } else if (productCategory?.code === 'TAINGHE') {
                return yupResolver(schemaTAINGHE);
            } else if (productCategory?.code === 'OPLUNG') {
                return yupResolver(schemaOPLUNG);
            }
        })(),
    });
    const [avt, setAvt] = useState();
    console.log(errors);
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
            // setSelectedOption([]);
            // setValue('colorproducts', []);
            // resetField('name');
            // resetField('priceIn');
            // resetField('priceOut');
            // resetField('brandId');
            // resetField('warehouseId');
            // resetField('infomation', '');
            // setValue('technicalDetail', htmlTable);
            // setFormattedPriceIn('');
            // setFormattedPriceOut('');
            // setAvt(null);

            navigate('/admin-list-products');
            toast.success('Tạo thành công');
        } else {
            setErrorsForm(data.errors);
        }
    };

    const { mutate: addAccessory } = useAddAccessoryData(onSuccess);
    const { isLoading: isLoaingChargePorts, data: dataChargePorts } = useChargePortsData();
    const { isLoading: isLoaingJackPlugs, data: dataJackPlugs } = useJackPlugsData();
    const { isLoading: isLoadingBrands, data: dataBrands, isError: isErrorBrands, error: errorBrand } = useBrandsData();
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
    useEffect(() => {
        if (dataColorProducts) {
            const convertedOptions = dataColorProducts.data.map((option) => ({
                value: option.id,
                label: option.name,
            }));
            setListColorProducts(convertedOptions);
        }
    }, [dataColorProducts]);
    useEffect(() => {
        setValue('technicalDetail', htmlTable);
    }, []);
    // Helper function to format the input with commas for thousand separators
    const formatPrice = (value) => {
        return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    const handleSelectChange = (selected) => {
        clearErrors('colorproducts');
        console.log(selected);
        setSelectedOption(selected);
        setValue('colorproducts', selected);
    };
    //////////////
    // ProductVersionList
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
    const handleChangePriceIn = (e) => {
        const rawValue = e.target.value.replace(/,/g, '');
        const formattedValue = formatPrice(rawValue);
        setFormattedPriceIn(formattedValue);
        setValue('priceIn', parseInt(rawValue));
    };
    const handleChangePriceOut = (e) => {
        const rawValue = e.target.value.replace(/,/g, '');
        const formattedValue = formatPrice(rawValue);
        setFormattedPriceOut(formattedValue);
        let number = parseInt(rawValue);
        setValue('priceOut', number);
    };
    const handleStepRemove = (index) => {
        const list = [...productVersionList];
        list.splice(index, 1);
        setProductVersionList(list);
    };

    const handleStepAdd = () => {
        setProductVersionList([...productVersionList, { ramId: '', romId: '', priceIn: 0, priceOut: 0 }]);
    };
    /////////////
    const handleChangeProductCategory = (e) => {
        if (dataProductCategories && dataProductCategories.data) {
            let productCategory = dataProductCategories.data.find(
                (productCategory) => productCategory.id === parseInt(e.target.value),
            );
            setProductCategory(productCategory);
        }
        setValue('productCategoryId', e.target.value);
    };
    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('warehouseId', data.warehouseId);
        formData.append('brandId', data.brandId);
        formData.append('infomation', data.infomation);
        formData.append('weight', data.weight);
        formData.append('length', data.length);
        formData.append('height', data.height);
        formData.append('width', data.width);
        formData.append('priceIn', data.priceIn);
        formData.append('priceOut', data.priceOut);
        formData.append('colorProducts', JSON.stringify(data.colorproducts));
        if (productCategory.code === 'TAINGHE') {
            formData.append('productCategoryCode', 'TAINGHE');
            formData.append('headPhoneTime', data.headPhoneTime);
            formData.append('chargerPortId', data.chargerPortId);
            formData.append('jackPlugId', data.jackPlugId);
        } else if (productCategory.code === 'OPLUNG') {
            formData.append('productCategoryCode', 'OPLUNG');
        } else if (productCategory.code === 'SACDUPHONG') {
            formData.append('productCategoryCode', 'SACDUPHONG');
            formData.append('battery', data.battery);
            formData.append('charging', data.charging);
            formData.append('chargerPortId', data.chargerPortId);
            formData.append('jackPlugId', data.jackPlugId);
        }
        formData.append('image', avt);
        addAccessory(formData);
    };
    if (
        isLoadingBrands ||
        isLoadingColorProducts ||
        isLoadingWareHouses ||
        isLoadingRams ||
        isLoadingRoms ||
        isLoadingChipTypes ||
        isLoadingChips ||
        isLoadingOperatingSystemTypes ||
        isLoadingOperatingSystems ||
        isLoadingScreenTechnologies ||
        isLoadingProductCategories ||
        isLoaingChargePorts ||
        isLoaingJackPlugs
    ) {
        return <LoadingAdmin />;
    }
    return (
        <>
            <>
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Thêm sản phẩm</h6>
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
                                            Loại sản phẩm:
                                        </label>
                                        <select
                                            className="form-control"
                                            name="productCategoryId"
                                            onChange={(e) => handleChangeProductCategory(e)}
                                        >
                                            <option disabled selected value="">
                                                Loại sản phẩm
                                            </option>
                                            {dataProductCategories.data
                                                ?.filter((productCategory) => productCategory.code !== 'DIENTHOAI')
                                                .map((productCategory, index) => (
                                                    <option value={productCategory.id} key={productCategory.id}>
                                                        {productCategory.name}
                                                    </option>
                                                ))}
                                        </select>
                                        {errors.productCategoryId?.message && (
                                            <p className="mt-2 text-danger">{errors.productCategoryId?.message}</p>
                                        )}
                                    </div>
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
                                        <select
                                            className="form-control"
                                            name="warehouseId"
                                            {...register('warehouseId')}
                                        >
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
                                        <select className="form-control" name="brandId" {...register('brandId')}>
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
                                            defaultValue={[]}
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
                                            Giá nhập:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="priceIn"
                                            placeholder="Nhập giá nhập"
                                            value={formattedPriceIn}
                                            onChange={(e) => handleChangePriceIn(e)}
                                        />
                                        {errors.priceIn?.message && (
                                            <p className="mt-2 text-danger">{errors.priceIn?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Giá bán:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="priceOut"
                                            placeholder="Nhập giá bán"
                                            onChange={(e) => handleChangePriceOut(e)}
                                            value={formattedPriceOut}
                                        />
                                        {errors.priceOut?.message && (
                                            <p className="mt-2 text-danger">{errors.priceOut?.message}</p>
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
                                        <label
                                            htmlFor="inputPassword"
                                            className="col-sm-2 col-form-label font-weight-bold"
                                        >
                                            Khối lượng(gram):
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="weight"
                                            placeholder="Nhập khối lượng"
                                            {...register('weight')}
                                        />
                                        {errors.weight?.message && (
                                            <p className="mt-2 text-danger">{errors.weight?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group ">
                                        <label
                                            htmlFor="inputPassword"
                                            className="col-sm-2 col-form-label font-weight-bold"
                                        >
                                            Chiều dài(cm):
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="length"
                                            placeholder="Nhập chiều dài"
                                            {...register('length')}
                                        />
                                        {errors.length?.message && (
                                            <p className="mt-2 text-danger">{errors.length?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group ">
                                        <label
                                            htmlFor="inputPassword"
                                            className="col-sm-2 col-form-label font-weight-bold"
                                        >
                                            Độ dày(cm):
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="height"
                                            placeholder="Nhập khối lượng"
                                            {...register('height')}
                                        />
                                        {errors.height?.message && (
                                            <p className="mt-2 text-danger">{errors.height?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group ">
                                        <label
                                            htmlFor="inputPassword"
                                            className="col-sm-2 col-form-label font-weight-bold"
                                        >
                                            Chiều rộng(cm):
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="width"
                                            placeholder="Nhập chiều rộng"
                                            {...register('width')}
                                        />
                                        {errors.width?.message && (
                                            <p className="mt-2 text-danger">{errors.width?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Thông số kỹ thuật:
                                        </label>
                                    </div>
                                    {productCategory && productCategory.code === 'SACDUPHONG' && (
                                        <>
                                            <div className="form-group row">
                                                <label
                                                    htmlFor="inputPassword"
                                                    className="col-sm-2 col-form-label font-weight-bold"
                                                >
                                                    Dung lượng pin:
                                                </label>
                                                <div className="col-sm-10">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="battery"
                                                        placeholder="Nhập dung lượng pin"
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
                                                    Công suất sạc:
                                                </label>
                                                <div className="col-sm-10">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="charging"
                                                        placeholder="Nhập công suất sạc"
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
                                                    Thời gian dùng:
                                                </label>
                                                <div className="col-sm-10">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="headPhoneTime"
                                                        placeholder="Thời gian dùng"
                                                        {...register('headPhoneTime')}
                                                    />
                                                    {errors.headPhoneTime?.message && (
                                                        <p className="mt-2 text-danger">
                                                            {errors.headPhoneTime?.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label
                                                    htmlFor="inputPassword"
                                                    className="col-sm-2 col-form-label font-weight-bold"
                                                >
                                                    Cổng sạc:
                                                </label>
                                                <div className="col-sm-10">
                                                    <select
                                                        className="form-control"
                                                        name="chargerPortId"
                                                        {...register('chargerPortId')}
                                                    >
                                                        <option disabled selected value="">
                                                            Cổng sạc
                                                        </option>
                                                        {dataChargePorts.data?.map((chargePort, index) => (
                                                            <option value={chargePort.id} key={chargePort.id}>
                                                                {chargePort.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.chargerPortId?.message && (
                                                        <p className="mt-2 text-danger">
                                                            {errors.chargerPortId?.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label
                                                    htmlFor="inputPassword"
                                                    className="col-sm-2 col-form-label font-weight-bold"
                                                >
                                                    Jack cắm:
                                                </label>
                                                <div className="col-sm-10">
                                                    <select
                                                        className="form-control"
                                                        name="jackPlugId"
                                                        {...register('jackPlugId')}
                                                    >
                                                        <option disabled selected value="">
                                                            Jack cắm
                                                        </option>
                                                        {dataJackPlugs.data?.map((jackPlug, index) => (
                                                            <option value={jackPlug.id} key={jackPlug.id}>
                                                                {jackPlug.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.jackPlugId?.message && (
                                                        <p className="mt-2 text-danger">{errors.jackPlugId?.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {productCategory && productCategory.code === 'TAINGHE' && (
                                        <>
                                            <div className="form-group row">
                                                <label
                                                    htmlFor="inputPassword"
                                                    className="col-sm-2 col-form-label font-weight-bold"
                                                >
                                                    Thời gian dùng:
                                                </label>
                                                <div className="col-sm-10">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="headPhoneTime"
                                                        placeholder="Thời gian dùng"
                                                        {...register('headPhoneTime')}
                                                    />
                                                    {errors.headPhoneTime?.message && (
                                                        <p className="mt-2 text-danger">
                                                            {errors.headPhoneTime?.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label
                                                    htmlFor="inputPassword"
                                                    className="col-sm-2 col-form-label font-weight-bold"
                                                >
                                                    Cổng sạc:
                                                </label>
                                                <div className="col-sm-10">
                                                    <select
                                                        className="form-control"
                                                        name="chargerPortId"
                                                        {...register('chargerPortId')}
                                                    >
                                                        <option disabled selected value="">
                                                            Cổng sạc
                                                        </option>
                                                        {dataChargePorts.data?.map((chargePort, index) => (
                                                            <option value={chargePort.id} key={chargePort.id}>
                                                                {chargePort.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.chargerPortId?.message && (
                                                        <p className="mt-2 text-danger">
                                                            {errors.chargerPortId?.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label
                                                    htmlFor="inputPassword"
                                                    className="col-sm-2 col-form-label font-weight-bold"
                                                >
                                                    Jack cắm:
                                                </label>
                                                <div className="col-sm-10">
                                                    <select
                                                        className="form-control"
                                                        name="jackPlugId"
                                                        {...register('jackPlugId')}
                                                    >
                                                        <option disabled selected value="">
                                                            Jack cắm
                                                        </option>
                                                        {dataJackPlugs.data?.map((jackPlug, index) => (
                                                            <option value={jackPlug.id} key={jackPlug.id}>
                                                                {jackPlug.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.jackPlugId?.message && (
                                                        <p className="mt-2 text-danger">{errors.jackPlugId?.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Hình ảnh sản phẩm:
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control-file"
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
                                    <button type="button" className="btn btn-dark ml-3" onClick={() => navigate(-1)}>
                                        Quay lại
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </>
    );
}

export default AddAccessory;
