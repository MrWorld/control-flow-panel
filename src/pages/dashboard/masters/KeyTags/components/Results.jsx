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
} from "@mui/material";
import { useCheckPermission } from "src/hooks/useCheckPermission";
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import DeleteTwoTone from "@mui/icons-material/DeleteTwoTone";
import { useNavigate } from "react-router-dom";
import { adminService } from "src/api/services/admin";
import useToast from "src/hooks/useToast";
import CustomButton from "src/components/CustomButton";
import { visuallyHidden } from '@mui/utils';


const Results = ({ resultData, pagination, actions, orderBy, order, onRequestSort }) => {
  const { checkPermission } = useCheckPermission();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState(false);
  const [modalId, setModalId] = useState(null)
  const handlePageChange = (_event, newPage) => {
    actions.changePage(newPage);
  };

  const handleLimitChange = (event) => {
    actions.changeTake(parseInt(event.target.value));
  };
  const deleteRow = async (id) => {
    try {
      const response = await adminService.deleteKeyTag(id)
      if (response) actions.handleRefreshList()
      setModalId(null)
      setConfirmModal(false)

    } catch (err) {
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
      id: 'code',
      numeric: false,
      disablePadding: false,
      label: 'code',
      sortable: true
    },
    {
      id: 'identifier',
      numeric: false,
      disablePadding: false,
      label: 'identifier',
      sortable: true
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: false,
      label: 'status',
      sortable: false
    },
    {
      id: 'isDisabled',
      numeric: false,
      disablePadding: false,
      label: 'active',
      sortable: true
    },
    {
      id: 'actions',
      numeric: true,
      disablePadding: false,
      label: 'actions',
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
            {"We couldn't find any key tag matching your search criteria"}
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
                          <Typography fontWeight="700">{data.code}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box dir={'rtl'}>
                          <Typography fontWeight="700">
                            {data.identifier}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box dir={'rtl'}>
                          <Typography fontWeight="700" color={data.status == 'Booked' ? 'red' : 'green'}>
                            {data.status == 'Booked' ? 'Booked': 'Available'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <ListActiveStatus data={data} />
                      </TableCell>
                      <TableCell align="right">
                        <Typography noWrap>
                          <Tooltip title={"View"} arrow>
                            <IconButton
                              disabled={!checkPermission("KEY_TAG:UPDATE")}
                              onClick={() =>
                                checkPermission("KEY_TAG:UPDATE") &&
                                navigate(
                                  ROUTE_CONSTANTS.DASHBOARD.MASTERS.KEY_TAG.GET_BY_DATA(data.id).ABSOLUTE,
                                  // ROUTE_CONSTANTS.DASHBOARD.MASTERS.KEY_TAG.GET_BY_DATA(data.id).ABSOLUTE,
                                  { state: data }
                                )
                              }
                              color="primary"
                            >
                              <LaunchTwoToneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={"Delete"} arrow>
                            <IconButton
                              disabled={!checkPermission("KEY_TAG:DELETE")}
                              onClick={() => handleModalOpening(data.id)}
                              color="error"
                            >
                              <DeleteTwoTone fontSize="small" />

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

export default Results;
const ConfirmModal = ({ show, onHide, deleteRow, id }) => {
  return (
    <Dialog fullWidth maxWidth="sm" open={show} onClose={onHide}>
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
          onClick={() => deleteRow(id)}
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
    // if(!checkPermission('KEY_TAG:UPDATE')) return  //NEED_PERMISSION_KEY toggle address type
    const tempData = {
      disable: !isTypeDisabled,
    };

    try {
      setLoading(true);
      await adminService.toggleKeyTag(data.id, tempData);
      toast(
        `${data.code} ${isTypeDisabled ? "Activate" : "Deactivate"
        } successfully!`,
        "success"
      );
      setIsTypeDisabled((toggle) => !toggle);
      setLoading(false);
    } catch (err) {
      toast(err?.response?.data?.message || 'Network Error!', 'error')
      // toast(`Error happened in toggle type`, "error");
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
