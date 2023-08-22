import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAddProductData } from '~/hooks/react-query/productData';
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
function AddProduct() {
    const navigate = useNavigate();
    const [formattedPriceIn, setFormattedPriceIn] = useState('');
    const [formattedPriceOut, setFormattedPriceOut] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [listColorProducts, setListColorProducts] = useState(null);
    const schema = yup
        .object()
        .shape({
            name: yup.string().required('Vui lòng nhập tên sản phẩm'),
            priceIn: yup.number().typeError('Vui lòng nhập định dạng số').required('Vui lòng nhập giá nhập'),
            priceOut: yup.number().typeError('Vui lòng nhập định dạng số').required('Vui lòng nhập giá bán'),
            warehouseId: yup.number().typeError('Vui lòng chọn nhà kho').required('Vui lòng chọn nhà kho'),
            brandId: yup.number().typeError('Vui lòng chọn thương hiệu').required('Vui lòng chọn thương hiệu'),
            infomation: yup.string().required('Vui lòng nhập thông tin sản phẩm'),
            technicalDetail: yup.string().required('Vui lòng nhập thông tin sản phẩm'),
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

    const { mutate: addProduct } = useAddProductData(onSuccess);
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
    const handlePriceInChange = (e) => {
        clearErrors('priceIn');
        const rawValue = e.target.value.replace(/,/g, '');
        const formattedValue = formatPrice(rawValue);
        setFormattedPriceIn(formattedValue);
        setValue('priceIn', rawValue);
    };
    const handlePriceOutChange = (e) => {
        clearErrors('priceOut');
        const rawValue = e.target.value.replace(/,/g, '');
        const formattedValue = formatPrice(rawValue);
        setFormattedPriceOut(formattedValue);
        setValue('priceOut', rawValue);
    };
    const handleSelectChange = (selected) => {
        clearErrors('colorproducts');
        console.log(selected);
        setSelectedOption(selected);
        setValue('colorproducts', selected);
    };
    const onSubmit = async (data) => {
        const parser = new DOMParser();
        const parsedTable = parser.parseFromString(data.technicalDetail, 'text/html');
        const tableRows = parsedTable.querySelectorAll('tr');
        // Create an object to store the key-value pairs
        const tableData = {};
        tableRows.forEach((row) => {
            const key = row.querySelector('td:nth-child(1)').innerText;
            const value = row.querySelector('td:nth-child(2)').innerText;
            tableData[key] = value;
        });
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('priceIn', data.priceIn);
        formData.append('priceOut', data.priceOut);
        formData.append('warehouseId', data.warehouseId);
        formData.append('brandId', data.brandId);
        formData.append('infomation', data.infomation);
        formData.append('technicalDetail', data.technicalDetail);
        formData.append('colorProducts', JSON.stringify(data.colorproducts));
        formData.append('image', avt);
        console.log(data);
        addProduct(formData);
    };
    if (isLoadingBrands || isLoadingColorProducts || isLoadingWareHouses) {
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
                                            Giá nhập sản phẩm:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="priceIn"
                                            placeholder="Nhập giá nhập"
                                            value={formattedPriceIn}
                                            onChange={handlePriceInChange} // Use the custom handler for formatting
                                        />
                                        {errors.priceIn?.message && (
                                            <p className="mt-2 text-danger">{errors.priceIn?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Giá bán sản phẩm:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="priceOut"
                                            placeholder="Nhập giá bán"
                                            value={formattedPriceOut}
                                            onChange={handlePriceOutChange}
                                        />
                                        {errors.priceOut?.message && (
                                            <p className="mt-2 text-danger">{errors.priceOut?.message}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="font-weight-bold">
                                            Nhà kho:
                                        </label>
                                        <select className="form-control" name="warehouseId" {...register('warehouseId')}>
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
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={getValues('technicalDetail')}
                                            onReady={(editor) => {
                                                // You can store the "editor" and use when it is needed.
                                                console.log('Editor is ready to use!', editor);
                                            }}
                                            onChange={(event, editor) => {
                                                setValue('technicalDetail', editor.getData());
                                                trigger('technicalDetail');
                                            }}
                                        />
                                        {errors.technicalDetail?.message && (
                                            <p className="mt-2 text-danger">{errors.technicalDetail?.message}</p>
                                        )}
                                    </div>
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

export default AddProduct;
