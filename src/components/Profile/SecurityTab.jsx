import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  ListItem,
  List,
  ListItemText,
  Divider,
  Button,
  Switch,
  TextField
} from '@mui/material';
import UpdateModal from './UpdateModal'
import * as Yup from 'yup';
import { adminService } from 'src/api/services/admin';
import useToast from 'src/hooks/useToast'
import { errorMessage } from 'src/utils/errorTypeDetector'
import { useCheckPermission } from 'src/hooks/useCheckPermission'
import { useUser } from 'src/contexts/GlobalContext';



const SecurityTab = ({ user }) => {
  const myUser = useUser()
  const isOwnProfile = user.id == myUser.id
  console.log(user.id == myUser.id)
  const { checkPermission } = useCheckPermission()
  const { toast } = useToast()

  const [isAdminDisabled, setIsAdminDisabled] = useState(user.isDisabled);
  const [otherAdminPasswordShow, setOtherAdminPasswordShow] = useState(false)
  const [myOwnPasswordShow, setMyOwnPasswordShow] = useState(false)

  const adminToggleHandler = async () => {
    try {
      const data = { isDisabled: !isAdminDisabled }
      const userId = user.id
      await adminService.toggleUsers(userId, data)
      setIsAdminDisabled(prevState => !prevState)
      toast(`User ${isAdminDisabled ? 'Enabled' : 'Disabled'}`, 'success')
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangeModalShow = bool => {
   
      if (!bool) setOtherAdminPasswordShow(prevShow => !prevShow)
      else setOtherAdminPasswordShow(bool)
    
  }

  const handleUpdatePassword = async (_values) => {
    const data = { ..._values }

    try {
      const response = await adminService.updateAdmin(user.id, data)
      toast(response.data.message, 'success')
      handleChangeModalShow(false)
    } catch (error) {
      toast(error.response.data.message, 'error')
      console.log(error)
    }
  }

  const isDisableActionPermitted = () => {
    if (isOwnProfile) return false
    else return checkPermission('ADMIN:UPDATE')
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box dir={'rtl'} pb={2}>
          <Typography variant="h3">{'Security'}</Typography>
          <Typography variant="subtitle2">
            {'Change your security preferences below'}
          </Typography>
        </Box>
        <Card>
          <List>
            <ListItem
              sx={{
                p: 3
              }}
            >
              <ListItemText
                primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
                secondaryTypographyProps={{
                  variant: 'subtitle2',
                  lineHeight: 1
                }}
                primary={'Change Password'}
                secondary={'You can change your password here'}
              />
              {checkPermission('ADMIN:UPDATE') &&
                <Button size="large" variant="outlined" onClick={() => handleChangeModalShow(true)}>
                  {'Change password'}
                </Button>
              }
            </ListItem>

            {/* {isDisableActionPermitted() &&
              <>
                <Divider component="li" />
                <ListItem
                  sx={{
                    p: 3
                  }}
                >
                  <ListItemText
                    primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
                    secondaryTypographyProps={{
                      variant: 'subtitle2',
                      color: 'warning',
                      lineHeight: 1
                    }}
                    primary={'Disable this account ?'}
                    secondary={
                      'if you want to disable this account you can use this toggle button!'
                    }
                  />
                  <Switch checked={isAdminDisabled} onChange={adminToggleHandler} color="primary" />
                </ListItem>
              </>
            } */}
          </List>
        </Card>
      </Grid>
      <UpdateModal
        show={otherAdminPasswordShow}
        onHide={() => handleChangeModalShow(false)}
        onCancel={() => handleChangeModalShow(false)}
        title={`Change password for ${user.name}`}
        subtitle='You can change other admin password here'
        buttonText='Update'
        onSubmitCustomAction={handleUpdatePassword}
        validationSchema={Yup.object().shape({
          password: Yup
            .string()
            .max(100)
            .min(8)
            .required('The password field is required'),
        })}
        initialValues={{
          password: '',
        }}
        fields={(errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values) =>
        (
          <>
            <Grid item>
              <TextField
                error={Boolean(touched?.password && errors.password)}
                fullWidth
                margin="normal"
                autoFocus
                helperText={touched?.password && errors.password}
                label={'Password'}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
                variant="outlined"
              />
            </Grid>
          </>
        )
        }
      />
      <UpdateModal
        show={myOwnPasswordShow}
        onHide={() => handleChangeModalShow(false)}
        onCancel={() => handleChangeModalShow(false)}
        title={`Change password`}
        subtitle='You can change other admin password here'
        buttonText='Update'
        onSubmitCustomAction={handleUpdatePassword}
        validationSchema={Yup.object().shape({
          currentPassword: Yup
            .string()
            .max(100)
            .required('The current password field is required'),
          password: Yup
            .string()
            .max(100)
            .min(8)
            .required('The password field is required'),
          confirmPassword: Yup.string()
            .max(100)
            .min(8)
            .required('The confirm password field is required')
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
        })}
        initialValues={{
          currentPassword: '',
          password: '',
          confirmPassword: ''
        }}
        fields={(errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values) =>
        (
          <>
            <Grid item>
              <TextField
                error={Boolean(touched?.currentPassword && errors.currentPassword)}
                fullWidth
                margin="normal"
                autoFocus
                helperText={touched?.currentPassword && errors.currentPassword}
                label={'Current Password'}
                name="currentPassword"
                onBlur={handleBlur}
                onChange={handleChange}
                type="currentPassword"
                value={values.currentPassword}
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <TextField
                error={Boolean(touched?.password && errors.password)}
                fullWidth
                margin="normal"
                autoFocus
                helperText={touched?.password && errors.password}
                label={'Password'}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <TextField
                error={Boolean(touched?.confirmPassword && errors.confirmPassword)}
                fullWidth
                margin="normal"
                autoFocus
                helperText={touched?.confirmPassword && errors.confirmPassword}
                label={'Confirm Password'}
                name="confirmPassword"
                onBlur={handleBlur}
                onChange={handleChange}
                type="confirmPassword"
                value={values.confirmPassword}
                variant="outlined"
              />
            </Grid>
          </>
        )}
      />
    </Grid>
  );
}

export default SecurityTab;