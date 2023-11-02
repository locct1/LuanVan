import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    getAllProducts,
    addProduct,
    deleteProduct,
    updateProduct,
    getProductById,
    changeStatusProduct,
    getAllRams,
    getAllRoms,
    getAllChipTypes,
    getAllChips,
    getAllOperatingSystemTypes,
    getAllOperatingSystems,
    getAllScreenTechnologies,
    deleteProductVersion,
    getAllChargePorts,
    getAllJackPlugs,
    addAccessory,
    updateAccessory,
    getAllAccessories,
} from '~/services/admin/product.service';
export const useProductsData = (onSuccess, onError) => {
    return useQuery('products', getAllProducts);
};
export const useAccessoriesData = (onSuccess, onError) => {
    return useQuery('accessories', getAllAccessories);
};
export const useAddProductData = (onSuccess) => {
    const queryClient = useQueryClient();

    return useMutation(addProduct, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('products');
            onSuccess(data);
        },
    });
};
export const useAddAccessoryData = (onSuccess) => {
    const queryClient = useQueryClient();
    return useMutation(addAccessory, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('accessories');
            onSuccess(data);
        },
    });
};
export const useDeleteProductData = (onSuccess, id) => {
    const queryClient = useQueryClient();

    return useMutation(deleteProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries('products');
            queryClient.invalidateQueries('accessories');
            onSuccess();
        },
    });
};
export const useChangeStatusProductData = (onSuccessChangeStatus, id) => {
    const queryClient = useQueryClient();

    return useMutation(changeStatusProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries('products');
            queryClient.invalidateQueries('accessories');

            onSuccessChangeStatus();
        },
    });
};
export const useUpdateProductData = (onSuccess, ProductId) => {
    const queryClient = useQueryClient();
    return useMutation(updateProduct, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('product');

            onSuccess(data);
        },
    });
};
export const useUpdateAccessoryData = (onSuccess, ProductId) => {
    const queryClient = useQueryClient();
    return useMutation(updateAccessory, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('product');
            onSuccess(data);
        },
    });
};
export const useGetProductData = (productId) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['product', productId],
        queryFn: () => getProductById(productId),
        enabled: productId !== undefined,
    });
};
//
export const useRamsData = (onSuccess, onError) => {
    return useQuery('rams', getAllRams);
};
export const useRomsData = () => {
    return useQuery('roms', getAllRoms);
};

export const useChipTypesData = () => {
    return useQuery('chipTypes', getAllChipTypes);
};

export const useChipsData = () => {
    return useQuery('chips', getAllChips);
};

export const useOperatingSystemTypesData = () => {
    return useQuery('operatingSystemTypes', getAllOperatingSystemTypes);
};

export const useOperatingSystemsData = () => {
    return useQuery('operatingSystems', getAllOperatingSystems);
};

export const useScreenTechnologiesData = () => {
    return useQuery('screenTechnologies', getAllScreenTechnologies);
};
export const useChargePortsData = () => {
    return useQuery('chargeports', getAllChargePorts);
};
export const useJackPlugsData = () => {
    return useQuery('jackplugs', getAllJackPlugs);
};
export const useDeleteProductVersionData = (onSuccessDelete, id) => {
    const queryClient = useQueryClient();

    return useMutation(deleteProductVersion, {
        onSuccess: () => {
            queryClient.invalidateQueries('products');
            queryClient.invalidateQueries('product');
            onSuccessDelete();
        },
    });
};
