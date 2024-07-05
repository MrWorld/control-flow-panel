import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  TablePagination,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  IconButton,
  Tooltip,
  Switch,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Badge,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { useCheckPermission } from "src/hooks/useCheckPermission";
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import DeleteTwoTone from "@mui/icons-material/DeleteTwoTone";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../../../api/services/admin";
import useToast from "src/hooks/useToast";
import CustomButton from "src/components/CustomButton";
import KeyTagCards from "./cards";
import KanbanKeys from "./KanbanMode";
import { ArrowDownward, ArrowUpward, CheckBoxOutlineBlank, CheckRounded, ToggleOnOutlined } from "@mui/icons-material";
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { BookStatusColors } from "../Details/constants";
import sound from './../../../../assets/audio/notification.mp3'

const Results = ({ resultData, pagination, actions, handleRefreshList, statistics, changeSort, sort, changeFilter }) => {
  const { checkPermission } = useCheckPermission();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState(false);
  const [mode, setMode] = useState('list');
  const [playAlert, setPlayAlert] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [statuses, setStatuses] = useState([])
  const audio = new Audio(sound)

  const handleRefresh = () => {
    actions.handleRefreshList()
  }

  const handleToggleSort = (e) => {
    if(e == 'code') {
      console.log(sort);
      if(sort == 'code:asc') changeSort('code:desc')
      else changeSort('code:asc')
    }
    if(e == 'createdAt') {
      if(sort == 'createdAt:asc') changeSort('createdAt:desc')
      else changeSort('createdAt:asc')
    }
  }
  
  useEffect(() => {
    if(playAlert) {
      const it = setInterval(() => {audio.play()}, 15000)
      return () => clearInterval(it)
    } else {
      audio.pause()
    }
  }, [playAlert])

  useEffect(() => {
    let doWeHaveAlert = false
    resultData.map((item) => {
      if(item?.status?.title == 'Requested') {
        doWeHaveAlert = true
      }
    })
    setPlayAlert(doWeHaveAlert)
  },[resultData])

  useEffect(() => {
    let tempStatus = structuredClone(BookStatusColors)
    let array = []
    Object.entries(tempStatus).map(([k,v]) => {
      array.push({
        name: k,
        color: v.color,
        checked: true,
        key: v.key
      })
    })
    setStatuses(array)
  },[])
  
  // const handleChangeStatusFilterChecked = (status, index) => {
  //   const clone = structuredClone(statuses)
  //   clone[index].checked = !status.checked
  //   setStatuses(clone)
  //   let filterText = ''
  //   clone.map((st, index) => {
  //     if(st.checked){ 
  //       filterText = filterText + `${st.key},`
  //     }
  //   })
  //   if(filterText.endsWith(',')) {
  //     console.log('end here ?')
  //     filterText.slice(0, -1);
  //   }
  //   changeFilter('Bookings.some.status:in:'+filterText)
  // }

  return (
    <>
      <Box dir={'rtl'} p={0} display={'flex'} justifyContent={'space-between'}>
        <Box dir={'rtl'} display={'flex'}>
          <Grid container spacing={1}>
            <Grid item>
              <Box dir={'rtl'} style={{  padding: '5px 10px', width: '100%', display: "flex" }}>
                <Typography >Cars  Onboarded: {statistics?.carsOnboard || 0} </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box dir={'rtl'} style={{  margin: '0', padding: '5px 10px', width: '100%' }}>
                <Typography >Total Capacity: {statistics?.carsOnboard || 0}/{statistics?.totalCapacity || 0}</Typography>
              </Box>
            </Grid>
            <Grid item >
            <TextField
              sx={{
                m: 0,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchTwoToneIcon />
                  </InputAdornment>
                ),
              }}
              onChange={actions.handleSearchType}
              placeholder={"Search by key tag ..."}
              size="small"
              fullWidth
              type="number"
              inputProps={{
                type: "text",
                inputMode: "numeric",
                pattern: "d*",
                min: 0,
                maxLength: 20
              }}
              inputMode='numeric'
              margin="normal"
              variant="outlined"
            />
            </Grid>
            <Grid item>
              <Button sx={{ml: 1}} variant={ sort.includes('code') ? 'contained' : 'outlined' } onClick={() => handleToggleSort('code')}>Order By Key Tag {sort.includes('code') ? sort == 'code:desc' ? <ArrowDownward /> : <ArrowUpward /> : <></>}</Button>
              <Button sx={{ml: 1}} variant={ sort.includes('createdAt') ? 'contained' : 'outlined' } onClick={() => handleToggleSort('createdAt')}>Order By Key Time {sort.includes('createdAt') ? sort == 'createdAt:desc' ? <ArrowDownward /> : <ArrowUpward /> : <></>}</Button>
              <Button sx={{ml: 1}} variant="outlined" onClick={() => changeSort('id:desc')}>Reset</Button>
            </Grid>
            <Grid item>
              <Button onClick={() => setMode(mode == 'list' ? 'kanban' : 'list')}>
                <Tooltip title="Delete"></Tooltip>
                {mode == 'list' && <ViewKanbanIcon />}
                {mode == 'kanban' && <DashboardIcon />}
              </Button>   
            </Grid>
            <Grid container sx={{display: 'flex', flexDirection: 'row', whiteSpace: 'break-spaces', marginLeft: 1, marginTop: 3}} spacing={0.1}>
              {statuses.map((status, index)=>{
                return <Grid key={status.name} item md={'auto'} sm={2} xs={6} sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  p: 2,
                  alignItems: 'center'
                }}>
                  <Box dir={'rtl'} sx={{
                    width: '24px',
                    height: '24px',
                    background: status.color,
                    marginRight: 1,
                    borderRadius: '2px',
                    // cursor: 'pointer'
                  }}
                    // onClick={() => handleChangeStatusFilterChecked(status, index)}
                    >
                    {/* {status.checked ? <CheckRounded /> : <></>} */}
                  </Box>
                  <Typography fontSize={12}>
                    {status.name}
                  </Typography>
                </Grid>
              })}
            </Grid>
          </Grid>
        </Box>
      </Box>
      {resultData.length === 0 ? (
        <>
          <Typography
            sx={{
              py: 10,
            }}
            variant="h3"
            fontWeight="normal"
            color="text.secondary"
            align="center"
          >
            {"We couldn't find anything"}
          </Typography>
        </>
      ) : (
        <>
          {mode == 'list' && <>
            <Grid container spacing={1}>
              {resultData.map((data) => {
                return (
                  <KeyTagCards key={data.id} data={data} handleRefresh={handleRefresh} />
                );
              })}
            </Grid>

          </>}
          {mode == 'kanban' && <KanbanKeys items={resultData} handleRefresh={handleRefresh} />}
        </>
      )}
    </>
  );
};

export default Results;
const ConfirmModal = ({ show, onHide, deleteRow }) => {
  console.log('is open ?', show)
  return (
    <Dialog fullWidth maxWidth="md" open={show} onClose={onHide}>
      <DialogTitle>
        <Typography variant="h3">Warning</Typography>
      </DialogTitle>
      <DialogContent style={{ padding: "10px", margin: "10px" }}>
        <Typography variant="h4">
          Are you sure? Do you want to delete this record ?
        </Typography>
      </DialogContent>
      <DialogActions>
        <CustomButton
          text={"Yes"}
          style={{ backgroundColor: "#f33" }}
          onClick={deleteRow}
        />
        <CustomButton text={"No"} onClick={onHide} />
      </DialogActions>
    </Dialog>
  );
};
const ListActiveStatus = ({ data }) => {
  const { toast } = useToast();
  const [isTypeDisabled, setIsTypeDisabled] = useState(data.isDisabled);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    // if(!checkPermission('TOGGLE_COUNTRY')) return  //NEED_PERMISSION_KEY toggle address type
    const tempData = {
      disable: !isTypeDisabled,
    };

    try {
      setLoading(true);
      await adminService.toggleParkingLocations(data.id, tempData);
      toast(
        `${data.name.toUpperCase()} ${isTypeDisabled ? "Activate" : "Deactivate"
        } successfully!`,
        "success"
      );
      setIsTypeDisabled((toggle) => !toggle);
      setLoading(false);
    } catch (error) {
      toast(`Error happened in toggle type`, "error");
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Box dir={'rtl'}>
      <Switch
        checked={!isTypeDisabled}
        onChange={(e) => handleToggle(e)}
        inputProps={{ "aria-label": "controlled" }}
      // disabled={!checkPermission(null)} //NEED_PERMISSION_KEY toggle address type
      />
    </Box>
  );
};
