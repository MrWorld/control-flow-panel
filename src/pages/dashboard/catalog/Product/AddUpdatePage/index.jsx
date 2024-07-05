import React, { useState, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { adminService } from 'src/api/services/admin';

import {
    Grid,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import ImagePicker from 'src/components/ImagePicker'
import AddUpdateForm from './components/AddUpdateForm';
import { useCheckPermission } from 'src/hooks/useCheckPermission';

const AddUpdatePage = ({ addNew }) => {
    const { checkPermission } = useCheckPermission()
    const productId = useLocation()?.state?.productId
    const theme = useTheme()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))
    const [details, setDetails] = useState(null)
    const [loading, setLoading] = useState(!addNew)
    const [imageIds, setImageIds] = useState([]) //**** handling array of ids of images for sending to create or update vehicle api
    const [allImages, setAllImages] = useState([])
    const [disconnectImageIds, setDisconnectImageIds] = useState([]) //**** handling array of ids of images for sending to create or update vehicle api

    const handleSetMedias = () => {
        let medias = []

        allImages.forEach((media, index) => {
            medias = [...medias, { id: media.id, listOrder: (index + 1) }]
        })
        return medias
    }

    const onCreate = async (formData) => {
        const medias = await handleSetMedias()
        const tempData = { ...formData, medias }

        delete tempData['hasDiscount']
        delete tempData['discount']
        delete tempData['discountType']

        if (tempData.medias.length === 0) {
            throw 'Image is required!'
        }
        try {
            if (!checkPermission('CREATE_PRODUCT')) return true;
            await adminService.createProduct(tempData)
        } catch (error) {
            console.log(error);
        }
    }

    const onUpdate = async (formData) => {
        const medias = await handleSetMedias()
        const tempDisconnectMedias = []

        disconnectImageIds.forEach(id => {
            tempDisconnectMedias.push({ id })
        })

        const tempData = { ...formData, medias, disconnectMedias: tempDisconnectMedias }
        if (!tempData.hasDiscount) {
            delete tempData['discount']
            delete tempData['discountType']
        }

        try {
            if (!checkPermission('UPDATE_PRODUCT')) return true;
            await adminService.updateProduct(productId, tempData)
        } catch (error) {
            console.log(error);
        }
    }

    const getData = useCallback(async () => {
        let response;

        try {
            setLoading(true)
            response = await adminService.getProductDetails(productId)
            setDetails(response.data.data);
            setLoading(false)
        } catch (err) {
            console.error(err);
            setLoading(false)
        }
    }, [productId]);

    useEffect(() => {
        if (productId) getData()
    }, [getData])


    if (loading) return null

    return (
        <>
            <Grid container padding={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {addNew ? 'Add new product' : 'Update product'}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container p={2} direction={!isMediumScreen ? 'row' : 'column-reverse'}>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6} item p={2}>
                    <AddUpdateForm
                        targetAPI={addNew ? onCreate : onUpdate}
                        details={details}
                        addNew={addNew}
                    />
                </Grid>
                <Grid xs={12} sm={12} md={4} lg={4} xl={4} item p={2}>
                    <ImagePicker
                        imageStates={{
                            setDisconnectImageIds,
                            imageIds,
                            setImageIds,
                            setAllImages
                        }}
                        addNew={addNew}
                        data={details}
                        imageIds={imageIds}
                        isDraggable
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default AddUpdatePage