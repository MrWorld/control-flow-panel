import { useEffect, useState } from 'react';

import {
    Grid,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Box,
    useMediaQuery,
    useTheme,
    InputAdornment,
    Button,
    CircularProgress,
    Select,
    Switch,
    Divider,
    MenuItem,
    FormHelperText,
    Card
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { adminService } from 'src/api/services/admin';
import useToast from 'src/hooks/useToast'
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import { discountTypeOptions } from '../../ProductDetails/constants'
import { useCheckPermission } from 'src/hooks/useCheckPermission'
import { errorMessage } from 'src/utils/errorTypeDetector';
import { useUser } from 'src/contexts/GlobalContext';


const AddUpdateForm = ({ targetAPI, addNew, details }) => {
    const { checkPermission } = useCheckPermission();
    const { role, vendorId } = useUser();
    const isVendorAdmin = role === 'VENDORADMIN';
    const { toast } = useToast()
    const navigate = useNavigate()
    const theme = useTheme()
    const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"))
    const [formOptions, setFormOptions] = useState({
        categories: [],
        types: [],
        shops: []
    })

    const handleApiCall = async (data, resetForm, setErrors, setStatus, setSubmitting) => {
        if (addNew ? !checkPermission('CREATE_PRODUCT') : !checkPermission('UPDATE_PRODUCT')) return true;
        try {
            await targetAPI(data)
            resetForm()
            setStatus({ success: true });
            setSubmitting(false);
            toast(`Product ${addNew ? 'created' : 'update'} successfully!`, 'success')
            if (addNew) navigate(ROUTE_CONSTANTS.DASHBOARD.CATALOG.PRODUCT.ROOT.ABSOLUTE)
            else navigate(ROUTE_CONSTANTS.DASHBOARD.CATALOG.PRODUCT.GET_BY_DATA(details.id).ABSOLUTE)
        } catch (error) {
            if (errorMessage(error)) toast(errorMessage(error), 'error')
            else toast(error, 'error')
            setSubmitting(false);
            console.log(error);
        }
    }

    const getSelectFormData = async () => {
        // if (!checkPermission('GET_VEHICLE_CLASS')) return

        try {
            Promise.all([
                adminService.getCatalogCategoriesList({ take: 1000, page: 0 }),
                adminService.getCatalogTypesList({ take: 1000, page: 0 }),
                adminService.getVendorList({ take: 1000, page: 0 }),
            ])
                .then(values => {
                    setFormOptions({
                        categories: values[0].data.data.items,
                        types: values[1].data.data.items,
                        shops: values[2].data.data.items
                    })
                })
                .catch(error => {
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getSelectFormData()
    }, [])

    return (
        <>
            <Typography variant='subtitle2' marginBottom='20px'>
                {addNew ? 'Fill out form below to add your new product' : 'Fill out form below to update your product'}
            </Typography>
            <Card style={{ padding: '25px' }}>
                <Formik
                    initialValues={{
                        name: details?.name || '',
                        nameAr: details?.nameAr || '',
                        price: details?.price || undefined,
                        categoryId: details?.categoryId || '',
                        typeId: details?.typeId || '',
                        vendorId: isVendorAdmin ? vendorId : details?.vendorId || '',
                        width: details?.width || undefined,
                        height: details?.height || undefined,
                        description: details?.description || '',
                        descriptionAr: details?.descriptionAr || '',
                        hasDiscount: details?.hasDiscount,
                        discountType: details?.discountType || '',
                        discount: details?.discount || '',
                    }}
                    validationSchema={
                        Yup.object().shape({
                            name: Yup.string()
                                .max(255)
                                .required('The name field is required'),
                            nameAr: Yup.string()
                                .max(255)
                                .required('The Arabic name field is required'),
                            vendorId: Yup.number()
                                .typeError('The shop field is required')
                                .required('The shop field is required'),
                            categoryId: Yup.number()
                                .typeError('The category field is required')
                                .required('The category field is required'),
                            typeId: Yup.number()
                                .typeError('The type field is required')
                                .required('The type field is required'),
                            price: Yup.number()
                                .typeError('The price field is required')
                                .positive()
                                .min(0)
                                .required('The price field is required'),
                            width: Yup.number()
                                .typeError('The width field is required')
                                .integer()
                                .positive()
                                .min(0)
                                .required('The width field is required'),
                            height: Yup.number()
                                .typeError('The height field is required')
                                .integer()
                                .positive()
                                .min(0)
                                .required('The height field is required'),
                            description: Yup.string()
                                .max(600)
                                .required('The description field is required'),
                            descriptionAr: Yup.string()
                                .max(600)
                                .required('The description Arabic field is required'),
                            hasDiscount: Yup.boolean(),
                            discountType: Yup.string()
                                .when('hasDiscount', {
                                    is: true,
                                    then: Yup.string(),
                                }),
                            discount: Yup.number()
                                .when('hasDiscount', {
                                    is: true,
                                    then: Yup.number()
                                        .when('discountType', {
                                            is: 'PERCENTAGE',
                                            then: Yup.number()
                                                .min(0)
                                                .max(100)
                                                .required('The discount percentage field is required'),
                                            otherwise:
                                                Yup.number()
                                                    .min(0)
                                                    .required('The discount amount field is required')
                                                    .test({
                                                        name: 'max',
                                                        exclusive: false,
                                                        params: {},
                                                        message: 'Max discount amount should be smaller or equal to original price',
                                                        test: function (value) {
                                                            if (!this.parent.price) return true
                                                            else return value <= this.parent.price
                                                        },
                                                    }),
                                        }),
                                }),
                        })

                    }
                    onSubmit={async (
                        _values,
                        { resetForm, setErrors, setStatus, setSubmitting }
                    ) => handleApiCall(_values, resetForm, setErrors, setStatus, setSubmitting)}
                >
                    {({
                        errors,
                        handleBlur,
                        handleChange,
                        setFieldValue,
                        handleSubmit,
                        isSubmitting,
                        touched,
                        values
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3} marginBottom={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        error={Boolean(
                                            touched?.name && errors.name
                                        )}
                                        fullWidth
                                        helperText={touched?.name && errors.name}
                                        label={'Name'}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.name}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        error={Boolean(
                                            touched?.nameAr && errors.nameAr
                                        )}
                                        fullWidth
                                        helperText={touched?.nameAr && errors.nameAr}
                                        label={'Name Arabic'}
                                        name="nameAr"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.nameAr}
                                        variant="outlined"
                                        style={{ direction: 'rtl' }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        error={Boolean(
                                            touched?.price && errors.price
                                        )}
                                        fullWidth
                                        helperText={touched?.price && errors.price}
                                        label={'Price'}
                                        name="price"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.price}
                                        variant="outlined"
                                        type='number'
                                        InputProps={{ inputProps: { min: 0, step: "any" } }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        error={Boolean(
                                            touched?.height && errors.height
                                        )}
                                        fullWidth
                                        helperText={touched?.height && errors.height}
                                        label={'Height'}
                                        name="height"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.height}
                                        InputProps={{ inputProps: { min: 0 }, endAdornment: <InputAdornment position="end">Cm</InputAdornment> }}
                                        variant="outlined"
                                        type='number'
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        error={Boolean(
                                            touched?.width && errors.width
                                        )}
                                        fullWidth
                                        helperText={touched?.width && errors.width}
                                        label={'Width'}
                                        name="width"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        InputProps={{ inputProps: { min: 0 }, endAdornment: <InputAdornment position="end">Cm</InputAdornment> }}
                                        value={values.width}
                                        variant="outlined"
                                        type='number'
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="gearbox-label">Category</InputLabel>
                                        <Select
                                            error={Boolean(
                                                touched?.categoryId && errors.categoryId
                                            )}
                                            labelId="select-category-label"
                                            id="select-category"
                                            value={values.categoryId}
                                            label={'Category'}
                                            name={'categoryId'}
                                            onChange={handleChange}
                                            options={formOptions.categoryId}
                                        >
                                            {
                                                formOptions.categories.map(category => <MenuItem key={category.id} value={parseInt(category.id)}>{category.name}</MenuItem>)
                                            }
                                        </Select>
                                        {touched?.categoryId && errors.categoryId && <StyledHelperText>{errors.categoryId}</StyledHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="gearbox-label">Type</InputLabel>
                                        <Select
                                            error={Boolean(
                                                touched?.typeId && errors.typeId
                                            )}
                                            labelId="select-type-label"
                                            id="select-type"
                                            value={values.typeId}
                                            label={'Type'}
                                            name={'typeId'}
                                            onChange={handleChange}
                                            options={formOptions.types}
                                        >
                                            {
                                                formOptions.types.map(type => <MenuItem key={type.id} value={parseInt(type.id)}>{type.name}</MenuItem>)
                                            }
                                        </Select>
                                        {touched?.typeId && errors.typeId && <StyledHelperText>{errors.typeId}</StyledHelperText>}
                                    </FormControl>
                                </Grid>
                                {(!isVendorAdmin) && <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="shop-label">Shop</InputLabel>
                                        <Select
                                            error={Boolean(
                                                touched?.vendorId && errors.vendorId
                                            )}
                                            labelId="select-shop-label"
                                            id="shop-label"
                                            value={values.vendorId}
                                            label={'Shop'}
                                            name={'vendorId'}
                                            onChange={handleChange}
                                            options={formOptions.shops}
                                        >
                                            {
                                                formOptions.shops.map(shop => <MenuItem key={shop.id} value={parseInt(shop.id)}>{shop.name}</MenuItem>)
                                            }
                                        </Select>
                                        {touched?.vendorId && errors.vendorId && <StyledHelperText>{errors.vendorId}</StyledHelperText>}
                                    </FormControl>
                                </Grid>}
                                <Grid item xs={12} md={12}>
                                    <TextField
                                        error={Boolean(
                                            touched?.description && errors.description
                                        )}
                                        fullWidth
                                        helperText={touched?.description && errors.description}
                                        label={'Description'}
                                        name="description"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.description}
                                        variant="outlined"
                                        multiline
                                        rows={3}
                                        maxRows={4}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <TextField
                                        error={Boolean(
                                            touched?.descriptionAr && errors.descriptionAr
                                        )}
                                        fullWidth
                                        helperText={touched?.descriptionAr && errors.descriptionAr}
                                        label={'Description Arabic'}
                                        name="descriptionAr"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.descriptionAr}
                                        variant="outlined"
                                        multiline
                                        rows={3}
                                        maxRows={4}
                                        style={{ direction: 'rtl' }}
                                    />
                                </Grid>
                                {!addNew &&
                                    <>
                                        <Grid item xs={12} md={12} display='flex' alignItems='center'>
                                            <Box dir={'rtl'} display='flex' alignItems='center'>
                                                <Typography variant="h5" width='100px'>
                                                    Discount
                                                </Typography>
                                                <Switch
                                                    checked={values.hasDiscount}
                                                    onChange={() => setFieldValue('hasDiscount', !values.hasDiscount)}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            {values.hasDiscount &&
                                                <FormControl fullWidth>
                                                    <InputLabel id="select-discount-type-label">Discount type</InputLabel>
                                                    <Select
                                                        error={Boolean(
                                                            touched?.discountType && errors.discountType
                                                        )}
                                                        labelId="select-discount-type-label"
                                                        id="discount-type"
                                                        value={values.discountType}
                                                        label={'Discount Type'}
                                                        name={'discountType'}
                                                        onChange={handleChange}
                                                        options={formOptions.discountType}
                                                    >
                                                        {
                                                            discountTypeOptions.map(type => <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>)
                                                        }
                                                    </Select>
                                                    {touched?.discountType && errors.discountType && <StyledHelperText>{errors.discountType}</StyledHelperText>}
                                                </FormControl>
                                            }
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            {values.hasDiscount &&
                                                <TextField
                                                    error={Boolean(
                                                        touched?.discount && errors.discount
                                                    )}
                                                    fullWidth
                                                    helperText={touched?.discount && errors.discount}
                                                    label={'Discount Amount'}
                                                    name="discount"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.discount}
                                                    variant="outlined"
                                                    type='number'
                                                    InputProps={{ inputProps: { min: 0, step: "any" } }}
                                                />
                                            }
                                        </Grid>
                                    </>
                                }
                            </Grid>
                            <Divider />
                            <Grid container style={{ margin: '20px 0px' }} direction={!is_small_screen ? 'row' : 'column-reverse'} alignItems="center">
                                <Button color="secondary" onClick={() => navigate(-1)}>
                                    {'Cancel'}
                                </Button>
                                <Button
                                    type="submit"
                                    startIcon={
                                        isSubmitting ? <CircularProgress size="1rem" /> : null
                                    }
                                    disabled={Boolean(errors.submit) || isSubmitting}
                                    variant="contained"
                                    style={{ width: is_small_screen && '100%' }}
                                >
                                    Save
                                </Button>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </Card>
        </>
    )

}
export default AddUpdateForm

const StyledHelperText = styled(FormHelperText)(
    () => `
        color: red
  `
);
