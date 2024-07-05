import React, { useState, } from 'react'
import { useLocation } from 'react-router-dom';
import { adminService } from 'src/api/services/admin';

import {
    Grid,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import ImagePicker from 'src/components/ImagePicker'
// import { useNavigate } from 'react-router-dom';
import useToast from 'src/hooks/useToast'
// import { ROUTE_CONSTANTS } from '../../../../../constants/AppRoutes'
import AddUpdateForm from './components/AddUpdateForm';
import { useCheckPermission } from 'src/hooks/useCheckPermission';

const AddUpdatePage = ({ addNew }) => {
    const { checkPermission } = useCheckPermission()
    const details = useLocation().state
    const banner = details?.banner
    const logo = details?.logo
    const theme = useTheme()
    const { toast } = useToast()
    // const navigate = useNavigate()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))
    const targetId = details?.id

    const [imageIds,] = useState([])

    const [logoIds, setLogoIds] = useState([])
    const [bannerIds, setBannerIds] = useState([])
    const [, setDisconnectLogoImageIds] = useState([])
    const [, setDisconnectBannerImageIds] = useState([])

    const onCreate = async (formData) => {
        if (!checkPermission('CREATE_VENDOR')) return true;
        const tempData = formData

        if (logoIds.length > 0) tempData.logoId = logoIds[0]
        if (bannerIds.length > 0) tempData.bannerId = bannerIds[0]

        if (!tempData.bannerId) throw 'Shop banner is required!'
        if (!tempData.logoId) throw 'Shop logo is required!'

        try {
            await adminService.createVendor(tempData)
        } catch (error) {
            console.log(error);
        }
    }

    const onUpdate = async (formData) => {
        if (!checkPermission('UPDATE_VENDOR')) return true;

        const tempData = formData

        if (logoIds.length > 0) tempData.logoId = logoIds[0]
        if (bannerIds.length > 0) tempData.bannerId = bannerIds[0]

        try {
            await adminService.updateVendor(targetId, tempData)
            // toast('Shop update successful!', 'success')
            // setSubmitting(false);
            // resetForm();
            // setStatus({ success: true });
            // navigate(ROUTE_CONSTANTS.DASHBOARD.ADDRESS_SETTING.TYPE.ROOT.ABSOLUTE, { replace: true })
        } catch (error) {
            toast('Error in updating shop!', 'error')
        }
    }

    return (
        <>
            <Grid container padding={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {addNew ? 'Add new shop' : 'Update shop'}
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
                            setDisconnectImageIds: setDisconnectBannerImageIds,
                            imageIds: bannerIds,
                            setImageIds: setBannerIds
                        }}
                        addNew={addNew}
                        data={{ medias: { ...banner }, mediaId: details?.bannerId }}
                        imageIds={imageIds}
                        singlePicker
                        title='Upload your banner'
                        aspectRatio={5}
                    />
                    <ImagePicker
                        imageStates={{
                            setDisconnectImageIds: setDisconnectLogoImageIds,
                            imageIds: logoIds,
                            setImageIds: setLogoIds
                        }}
                        addNew={addNew}
                        data={{ medias: { ...logo }, mediaId: details?.logoId }}
                        imageIds={imageIds}
                        singlePicker
                        title='Upload your logo'
                        wrapperStyle={{ marginTop: '30px' }}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default AddUpdatePage