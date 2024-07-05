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
import { MuiTelInput } from 'mui-tel-input';
import dayjs from 'dayjs'
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
        toast(errorMessage(error), 'error')
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

  // useEffect(() => {
  //   if (open) getListOfVendors()
  // }, [open])


  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {'Customer Management'}
          </Typography>
          <Typography variant="subtitle2">
            {
              'All aspects related to the customers can be managed from this page'
            }
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}

export default PageHeader;