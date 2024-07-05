import React, { useState } from "react";
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
  TableSortLabel,
  Rating,
  Button,
} from "@mui/material";
import { useCheckPermission } from "src/hooks/useCheckPermission";
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import DeleteTwoTone from "@mui/icons-material/DeleteTwoTone";
import CustomButton from "src/components/CustomButton";
import { useNavigate } from "react-router-dom";
import { adminService } from "src/api/services/admin";
import useToast from "src/hooks/useToast";
import { visuallyHidden } from '@mui/utils';


const Results = ({ resultData, pagination, actions, orderBy, order, onRequestSort }) => {
  const { checkPermission } = useCheckPermission();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState(false);
  const [modalId, setModalId] = useState(null)
  const { toast } = useToast()

  const handlePageChange = (_event, newPage) => {
    actions.changePage(newPage);
  };

  const handleLimitChange = (event) => {
    actions.changeTake(parseInt(event.target.value));
  };
  const deleteRow = async (id) => {
    try {
      const response = await adminService.deleteFloor(id)
      if (response) actions.handleRefreshList()
      setModalId(null)
      setConfirmModal(false)

    } catch (err) {
      toast(err?.response?.data?.message || 'Network Error!', 'error')
      console.log(err)
      setModalId(null)
      setConfirmModal(false)

    }
  }

  const handleModalOpening = (id) => {
    setConfirmModal(true)
    setModalId(id)
  }


  const headCells = [
    {
      id: 'id',
      numeric: false,
      disablePadding: false,
      label: 'id',
      sortable: true
    },
    {
      id: 'bookingId',
      numeric: false,
      disablePadding: false,
      label: 'Booking',
      sortable: false
    },
    {
      id: 'customer',
      numeric: false,
      disablePadding: false,
      label: 'Customer',
      sortable: false
    },
    {
      id: 'subject',
      numeric: false,
      disablePadding: false,
      label: 'name',
      sortable: true
    },
    {
      id: 'rating',
      numeric: false,
      disablePadding: false,
      label: 'rating',
      sortable: true
    },
    {
      id: 'actions',
      numeric: true,
      disablePadding: false,
      label: 'Actions',
      sortable: false
    },
  ];

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };



  return (
    <>
      <Box dir={'rtl'} p={2}>
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
          placeholder={"Search by name ..."}
          size="small"
          // fullWidth
          margin="normal"
          variant="outlined"
        />
      </Box>
      <Divider />
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
            {"We couldn't find any feedback matching your search criteria"}
          </Typography>
        </>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {
                    headCells.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                      >{
                          headCell.sortable ?
                            <TableSortLabel
                              active={orderBy === headCell.id}
                              direction={orderBy === headCell.id ? order : 'asc'}
                              onClick={createSortHandler(headCell.id)}
                            >
                              {headCell.label}
                              {orderBy === headCell.id ? (
                                <Box dir={'rtl'} component="span" sx={visuallyHidden}>
                                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                              ) : null}
                            </TableSortLabel>
                            :
                            headCell.label
                        }
                      </TableCell>
                    )
                    )
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {resultData.map((data) => {
                  return (
                    <TableRow hover key={data.id}>

                      <TableCell>
                        <Box dir={'rtl'}>
                          <Typography fontWeight="700">{data.id}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box dir={'rtl'}>
                          <Button variant="text" fontWeight="700" onClick={() => navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.BOOKING.GET_BY_DATA(data.bookingId).ABSOLUTE)}>{data.bookingId}</Button>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box dir={'rtl'}>
                          <Typography fontWeight="700">{data?.booking?.customer?.name || '-'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box dir={'rtl'}>
                          <Typography fontWeight="700">{data.subject}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Rating readOnly value={data.rating} />
                      </TableCell>
                      <TableCell align="right">
                        <Typography noWrap>
                          <Tooltip title={"View"} arrow>
                            <IconButton
                              disabled={!checkPermission("PARKING_FLOOR:UPDATE")}
                              onClick={() =>
                                checkPermission("PARKING_FLOOR:UPDATE") &&
                                navigate(
                                  ROUTE_CONSTANTS.DASHBOARD.REPORTS.FEEDBACKS.GET_BY_DATA(data.id).ABSOLUTE,
                                  { state: data }
                                )
                              }
                              color="primary"
                            >
                              <LaunchTwoToneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Typography>
                      </TableCell>
                      <ConfirmModal
                        show={(confirmModal && modalId == data.id)}
                        onHide={() => setConfirmModal(false)}
                        deleteRow={(id) => deleteRow(id)}
                        id={data.id}
                      />
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box dir={'rtl'} p={2}>
            <TablePagination
              component="div"
              count={pagination.totalCount}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={pagination.page}
              rowsPerPage={pagination.take}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Box>
        </>
      )}
    </>
  );
};
const ConfirmModal = ({ show, onHide, deleteRow, id }) => {
  console.log('is open ?', id)
  return (
    <Dialog fullWidth maxWidth="md" open={show} onClose={() => onHide()}>
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
          onClick={() => { deleteRow(id) }}
        />
        <CustomButton text={"No"} onClick={() => onHide()} />
      </DialogActions>
    </Dialog>
  );
};
export default Results;

const ListActiveStatus = ({ data }) => {
  const { toast } = useToast();
  const [isTypeDisabled, setIsTypeDisabled] = useState(data.isDisabled);
  const [, setLoading] = useState(false);

  const handleToggle = async () => {
    // if(!checkPermission('TOGGLE_COUNTRY')) return  //NEED_PERMISSION_KEY toggle address type
    const tempData = {
      disable: !isTypeDisabled,
    };

    try {
      setLoading(true);
      await adminService.togglefloor(data.id, tempData);
      toast(
        `${data.name.toUpperCase()} ${isTypeDisabled ? "Activate" : "Deactivate"
        } successfully!`,
        "success"
      );
      setIsTypeDisabled((toggle) => !toggle);
      setLoading(false);
    } catch (err) {
      toast(err?.response?.data?.message || 'Network Error!', 'error')
      // toast(`err happened in toggle type`, "err");
      console.log(err);
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
