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
    Option,
    MenuItem,
    List,
    ListItem,
    IconButton,
    ListItemText,
    Tooltip,
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
import { DeleteForeverOutlined, DeleteOutline } from '@mui/icons-material';

  
// ***** role management should be restricted and only super admin should see and work with it. so dynamic importing is required!
const BranchManagement = ({ user, handleRefreshData }) => {

    const { checkPermission } = useCheckPermission()
    const { toast } = useToast()
    const [branchList, setBranchList] = useState([])
    const [loadingOnButtons,setLoadingOnButtons] = useState(false)



    const handleAssignBranch = async (branchId) => {
        try{
            const data = {adminId : user.id}
            await adminService.assignBranch(branchId, data)
            toast('branch assigned successfully!', 'success')
            handleRefreshData()
        }catch(err) {
            toast(err.response.data.message, 'error')
            console.log(err)
        }
    }

    const getBranchList = async() => {
        try {
            const data = {
                limit: 1000,
                offset: 0,
            }
      
            const response = await adminService.getParkingLocations(data)
            setBranchList(response.data.data)

        }catch(err) {
            toast(err.response.data.message, 'error')
        }

    }

    const handleUnAssignBranch = async(branchId) => {
        try {
            const data = {adminId : user.id}
            setLoadingOnButtons(true)
            const response = await adminService.unAssignBranch(branchId, data)
            if(response) handleRefreshData()
        }catch(err) {
            toast(err.response.data.message,'error')
        }
    }

    useEffect(() => {
        getBranchList()
    }, [])

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
                        {'Branch '}
                    </Typography>
                    <Typography variant="subtitle2">
                        {'Manage details related to admin Branches'}
                    </Typography>
                </Box>
                <Box dir={'rtl'} 
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between">
                    <Typography>Assign Branch</Typography>
                    <FormControl sx={{marginLeft: 1}} >
                        <InputLabel id="branch_label_id" size='small'>branch</InputLabel>
                        <Select size='small' label={'branch'} labelId='branch_label_id' onChange={(x) => handleAssignBranch(x.target.value)} sx={{minWidth: '200px'}}>
                            {branchList.map((branch) => <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>)}
                        </Select>
                    </FormControl>

                </Box>
                
            </Box>
            <Divider />
            <CardContent
                sx={{
                    p: 2
                }}
            >
                <Typography variant="subtitle2">
                    
                        <List dense={false} style={{width: '100%'}}>
                            
                            {user?.AssignedBranches?.map((branch, i) => <><ListItem
                                key={i}
                                secondaryAction={
                                    <Button onLoad={loadingOnButtons} onClick={() => handleUnAssignBranch(branch.branchId)} variant='text'><Tooltip title="Un Assign Branch"><DeleteOutline color='error'/></Tooltip></Button>     
                                }
                                >
                                <ListItemText
                                    primary={branch?.branch?.name || '---'}
                                />
                                </ListItem>
                                <Divider style={{margin: 2}}/> 
                                </>
                            )}
                            </List>
                </Typography>
            </CardContent>
        </Card>
    )
}
export default BranchManagement