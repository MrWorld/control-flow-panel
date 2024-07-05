import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { adminService } from 'src/api/services/admin'
import { errorMessage } from 'src/utils/errorTypeDetector'

import {
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  TextField,
  CircularProgress,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import useToast from 'src/hooks/useToast'
import { adminRolesOptions } from '../../../../../constants'
import { useCheckPermission } from 'src/hooks/useCheckPermission'
import { DatePicker } from '@mui/x-date-pickers';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import dayjs from 'dayjs'

Yup.addMethod(Yup.string, 'phoneValidation', function ({errorMessage, value}) {
  return this.test('phoneValidation', errorMessage, function() {
      const {path, createError} = this
      console.log('error', value, path)
      if(!String(value).startsWith('+965')) {
          return createError({path, message: 'phone number is limited to Kuwait(+965) numbers!'})
      }
      console.log('validation', matchIsValidTel(value))
      if(!value || !matchIsValidTel(value)) {
          console.log('am i here ?')
          return createError({path, message: errorMessage})
      }

      return true
  })
})

const PageHeader = ({ handleRefreshAdminList }) => {
  const { checkPermission } = useCheckPermission()
  const [open, setOpen] = useState(false);
  const [vendorsList, setVendorsList] = useState([])
  const [roleGroupsList, setRoleGroupsList] = useState([])
  const [branches, setBranches] = useState([])
  const [phone, setPhone] = useState('')
  const [birthDate, setBirthDate] = useState(dayjs())

  const { toast } = useToast()

  const handleCreateUserOpen = () => {
    setOpen(true);
  };

  const handleCreateUserClose = () => {
    setOpen(false);
  };

  const handleCreateAdminCallback = (type, error) => {
    switch (type) {
      case 'SUCCESS':
        setOpen(false);
        handleRefreshAdminList()
        toast('The admin account was created successfully', 'success')
        break;
      case 'ERROR':
        toast(error.response.data.message, 'error')
        break;
      default:
        break;
    }
  }

  // const getListOfVendors = async () => {

  //   const data = {
  //     take: 1000,
  //     page: 0,
  //   }

  //   try {
  //     const res = await adminService.getVendorList(data)
  //     setVendorsList(res.data.data.items)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const getRoleGroupList = async () => {
    const data = {
      offset: 0,
      limit: 1000
    }

    try {
      const res = await adminService.getRoleGroupList(data)
      setRoleGroupsList(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const createAdmin = async (data, resetForm, setStatus, setSubmitting) => {
    const { email, name, roleId, password, gender, internalNote, branchId, unPaidPassword, username } = data
    const body = { email, name, roleId, password, gender, birthDate, internalNote, phone, branchId, unPaidPassword, username }
    //we should return a promise here then handle try catch below **** also on close modal we should re-render tabel and get new members

    try {
      await adminService.adminInvitation(body)
      setSubmitting(false);
      resetForm();
      setStatus({ success: true });
      handleCreateAdminCallback('SUCCESS')
    } catch (error) {
      setSubmitting(false);
      setStatus({ success: false });
      handleCreateAdminCallback('ERROR', error)
    }
  }

  // useEffect(() => {
  //   if (open) getListOfVendors()
  // }, [open])

  const getBranches = async () => {
    try {

      const payload = {
        offset: 0,
        limit: 100
      }

      const response = await adminService.getParkingLocations(payload)
      setBranches(response.data.data)
    } catch (err) {
      console.log(err);
    }
  }


  useEffect(() => {
    if (open) {
      getRoleGroupList()
      getBranches()
    }
  }, [open])

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {'Admin Management'}
          </Typography>
          <Typography variant="subtitle2">
            {
              'All aspects related to the panel users can be managed from this page'
            }
          </Typography>
        </Grid>
        {checkPermission('ADMIN:CREATE') &&
          <Grid item>
            <Button
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              onClick={handleCreateUserOpen}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
            >
              {'Create admin'}
            </Button>
          </Grid>
        }
      </Grid>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleCreateUserClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {'Add new admin user'}
          </Typography>
          <Typography variant="subtitle2">
            {
              'Fill in the fields below to create new admin'
            }
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            email: '',
            username: '',
            name: '',
            submit: null,
            roleId: '',
            password: '',
            gender: 'MALE',
            internalNote: '',
            branchId: '',
            unPaidPassword: '',
            phone: '+965'
          }}
          validationSchema={
            Yup.object().shape({
              password: Yup.string().required(),
              internalNote: Yup.string()
                .optional(),
              name: Yup.string()
                .max(255)
                .required('The full name field is required'),
              email: Yup.string()
                .email('The email provided should be a valid email address')
                .max(255)
                .required('The email field is required'),
              username: Yup.string()
                .max(255)
                .required('The username field is required'),
              roleId: Yup.number()
                .required('The role field is required'),
              branchId: Yup.number()
                .required('The branch field is required'),
              unPaidPassword: Yup.string()
                .optional(),
              phone: Yup.string().phoneValidation({errorMessage: "The Phone Number Field should be a valid phone", value: phone}),
            })
          }
          onSubmit={async (
            _values,
            { resetForm, setStatus, setSubmitting }
          ) => createAdmin(_values, resetForm, setStatus, setSubmitting)}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent
                dividers
                sx={{
                  p: 3
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={7}>
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <FormControl fullWidth 
                        error={Boolean(
                          touched?.roleId && errors.roleId
                        )}>
                          <InputLabel id="select-role-label" required>Role</InputLabel>
                          <Select
                            labelId="select-role-label"
                            id="select-role"
                            value={values.roleId}
                            helperText={touched?.name && errors.name}
                            label="Role"
                            name='roleId'
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            {
                              roleGroupsList.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                            }
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth
                         error={Boolean(
                          touched?.branchId && errors.branchId
                        )}
                          >
                          <InputLabel id="select-branch" required>Branch</InputLabel>
                          <Select
                            labelId="select-branch"
                            id="select-branch"
                            helperText={touched?.name && errors.name}
                            value={values.branchId}
                            label="Branch"
                            name='branchId'
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            {
                              branches.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                            }
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(
                            touched?.name && errors.name
                          )}
                          required
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
                            touched?.username && errors.username
                          )}
                          required
                          fullWidth
                          helperText={touched?.username && errors.username}
                          label={'Username'}
                          name="username"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.username}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(touched?.email && errors.email)}
                          fullWidth
                          required
                          helperText={touched?.email && errors.email}
                          label={'Email Address'}
                          name="email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="email"
                          value={values.email}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(
                            touched?.password && errors.password
                          )}
                          fullWidth
                          required
                          helperText={touched?.password && errors.password}
                          label={'password'}
                          name="password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.password}
                          type="password"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(
                            touched?.unPaidPassword && errors.unPaidPassword
                          )}
                          fullWidth
                          helperText={touched?.unPaidPassword && errors.unPaidPassword}
                          label={'Unpaid Password'}
                          name="unPaidPassword"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.unPaidPassword}
                          type="unPaidPassword"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MuiTelInput
                          onChange={setPhone}
                          error={Boolean(
                              touched?.phone && errors.phone
                          )}
                          fullWidth
                          required
                          name='phone'
                          label={'phone'}
                          onBlur={handleBlur}
                          helperText={touched?.phone && errors.phone}
                          value={phone}
                          defaultCountry='KW'
                          variant='outlined'
                          onlyCountries={['KW']}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DatePicker
                          label={'Birth Date'}
                          name="birthDate"
                          onBlur={handleBlur}
                          onChange={(x) => setBirthDate(x)}
                          value={birthDate}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <RadioGroup
                          row
                          onChange={handleChange}
                          value={values.gender}
                          name="gender"
                        >
                          <FormControlLabel value="MALE" control={<Radio />} label="Male" />
                          <FormControlLabel value="FEMALE" control={<Radio />} label="Female" />
                        </RadioGroup>
                      </Grid>
                      <Grid item xs={24} md={24}>
                        <TextField
                          error={Boolean(
                            touched?.internalNote && errors.internalNote
                          )}
                          fullWidth
                          helperText={touched?.internalNote && errors.internalNote}
                          label={'Internal Note'}
                          name="internalNote"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.internalNote}
                          variant="outlined"
                        />
                      </Grid>




                      {/* {values.role === 'VENDORADMIN' ? <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel id="vendor_id-label">Vendor</InputLabel>
                          <Select
                            error={Boolean(touched?.vendor && errors.vendor)}
                            labelId="vendor_id-label"
                            id="vendor_id"
                            value={values.vendor}
                            label="Vendor"
                            name='vendor'
                            options={vendorsList}
                            onChange={handleChange}
                          >
                            {
                              vendorsList.map(item => {
                                return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                              })
                            }
                          </Select>
                        </FormControl>
                      </Grid> : null} */}
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions
                sx={{
                  p: 3
                }}
              >
                <Button color="secondary" onClick={handleCreateUserClose}>
                  {'Cancel'}
                </Button>
                <Button
                  type="submit"
                  startIcon={
                    isSubmitting ? <CircularProgress size="1rem" /> : null
                  }
                  disabled={Boolean(errors.submit) || isSubmitting}
                  variant="contained"
                >
                  {'Add new user'}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}

export default PageHeader;