import React, { useState, useEffect } from 'react'
import {
    Grid,
    Typography,
    CardContent,
    Card,
    Box,
    Divider,
    Button,
    FormControl, 
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import Text from '../Text';
import UpdateModal from './UpdateModal'
import * as Yup from 'yup';
import { adminRolesOptions } from '../../constants'
import { adminService } from 'src/api/services/admin'
import useToast from 'src/hooks/useToast' 
import { useCheckPermission } from 'src/hooks/useCheckPermission'
import { errorMessage } from 'src/utils/errorTypeDetector'

// ***** role management should be restricted and only super admin should see and work with it. so dynamic importing is required!
const RoleManagement = ({ user, handleRefreshData }) => {
    const isOwnProfile = user.ownProfile
    const isCustomer = user?.role?.name === 'CUSTOMER'

    const { checkPermission } = useCheckPermission()
    const { toast } = useToast()
    const [modalShow, setModalShow] = useState(false)
    const [roleList, setRoleList] = useState([])


    const handleChangeModalShow = bool => {
        if (!bool) setModalShow(prevShow => !prevShow)
        else setModalShow(bool)
    }


    const handleUpdateRole = async (_values) => {
        const data = {
            roleId: _values.role,
        }
        try{
            const response = await adminService.updateAdmin(user.id, data)
            toast(response.data.message, 'success')
            setModalShow(false)
            handleRefreshData()
        }catch(error) {
            toast(error.response.data.message, 'error')
            console.log(error)
        }
    }

    const isEditRolePermitted = () => {
        if(isOwnProfile) return false
        if(isCustomer) return false
        else return isOwnProfile ? false : checkPermission('ADMIN:UPDATE')
    }

    const getRoles = async() => {
        try {
            const payload = {
                offset: 0,
                limit: 1000
            }
            const response = await adminService.getRoleGroupList(payload)
            setRoleList(response.data.data)
        }catch(err) {
            toast(err.response.data.message, 'error')
        }
    }

    useEffect(() => {
        if (modalShow) getRoles()
    }, [modalShow])

    return (
        <Card>
            <Box dir={'rtl'}
                p={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Box dir={'rtl'}>
                    <Typography variant="h4" gutterBottom>
                        {'Role '}
                    </Typography>
                    <Typography variant="subtitle2">
                        {'Manage details related to admin role'}
                    </Typography>
                </Box>
                {isEditRolePermitted() &&
                    <Button variant="text" onClick={() => handleChangeModalShow(true)} startIcon={<EditTwoToneIcon />}>
                        {'Edit'}
                    </Button>
                }
            </Box>
            <Divider />
            <CardContent
                sx={{
                    p: 4
                }}
            >
                <Typography variant="subtitle2">
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                            <Box dir={'rtl'} pr={3} pb={2}>
                                {'Current role'}:
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={8} md={9}>
                            <Text color="black">
                                <b>{user?.role?.name}</b>
                            </Text>
                        </Grid>
                    </Grid>
                </Typography>
            </CardContent>
            <UpdateModal
                show={modalShow}
                onHide={() => handleChangeModalShow(false)}
                onCancel={() => handleChangeModalShow(false)}
                title='Role management'
                subtitle='You can change Admin Role here'
                buttonText='Update'
                onSubmitCustomAction={handleUpdateRole}
                validationSchema={Yup.object().shape({
                    role: Yup
                        .string()
                        .required('The role field is required'),
                })}
                initialValues={{
                    role: user?.role?.id,
                }}
                fields={(errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values) =>
                (
                    <>
                        <Grid item>
                            <FormControl fullWidth>
                                <InputLabel id="select-role-label">Role</InputLabel>
                                <Select
                                    labelId="select-role-label"
                                    id="select-role"
                                    defaultValue={user?.role?.id}
                                    label="role"
                                    name='role'
                                    onChange={handleChange}
                                >
                                    {
                                        roleList.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                    </>
                )
                }
            />
        </Card>
    )
}
export default RoleManagement