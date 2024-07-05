import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { adminService } from 'src/api/services/admin';

import {
    Grid,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import ImagePicker from 'src/components/ImagePicker'
import AddUpdateForm from './components/AddUpdateForm'
import RelatedProducts from './components/RelatedProducts'
import { useCheckPermission } from 'src/hooks/useCheckPermission';

const AddUpdatePage = ({ addNew }) => {
    const { checkPermission } = useCheckPermission();
    const details = useLocation().state
    const theme = useTheme()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))
    const targetId = details?.id

    const [imageIds, setImageIds] = useState([]) //**** handling array of ids of images for sending to create or update vehicle api
    const [, setDisconnectImageIds] = useState([]) //**** handling array of ids of images for sending to create or update vehicle api

    const onCreate = async (formData) => {
        if (!imageIds[0]) {
            throw 'Images is required!'
        }
        const tempData = { ...formData, image: imageIds[0] }

        try {
            if (checkPermission) await adminService.addCatalogCategories(tempData)
        } catch (error) {
            console.log(error);
        }
    }

    const onUpdate = async (formData) => {
        if (!imageIds[0]) {
            throw new Error({ message: 'Images is required!' })
        }
        const tempData = { ...formData, image: imageIds[0] }

        try {
            if (checkPermission)
                await adminService.updateCatalogCategories(targetId, tempData)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Grid container padding={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {addNew ? 'Add new category' : 'Update category'}
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
                    {!addNew &&
                        <RelatedProducts
                            targetId={targetId}
                            filterType='categoryId'
                        />
                    }
                </Grid>
                <Grid xs={12} sm={12} md={4} lg={4} xl={4} item p={2}>
                    <ImagePicker
                        imageStates={{
                            setDisconnectImageIds,
                            imageIds,
                            setImageIds
                        }}
                        addNew={addNew}
                        data={details}
                        imageIds={imageIds}
                        singlePicker
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default AddUpdatePage