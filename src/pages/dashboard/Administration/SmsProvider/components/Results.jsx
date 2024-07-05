import React, { useEffect, useState } from "react";
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
  CircularProgress,
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


const Results = ({ resultData, pagination, actions, refresh, orderBy, order, onRequestSort }) => {
  const { checkPermission } = useCheckPermission();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState(false);
  const [modalId, setModalId] = useState(null)
  const [onActiveUpdate, setOnActiveUpdate] = useState(true)
  const { toast } = useToast()
  const handlePageChange = (_event, newPage) => {
    actions.changePage(newPage);
  };

  const handleLimitChange = (event) => {
    actions.changeTake(parseInt(event.target.value));
  };

  const handleUpdate = () => {
    setOnActiveUpdate(true)
    actions.handleRefreshList()
  }

  const handleModalOpening = (id) => {
    setConfirmModal(true)
    setModalId(id)
  }

  useEffect(() => {
    setTimeout(() => {
      setOnActiveUpdate(false)
    }, 100);
  },[resultData])


  const headCells = [
    {
      id: 'id',
      numeric: false,
      disablePadding: false,
      label: 'id',
      sortable: true
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: 'name',
      sortable: true
    },
    {
      id: 'isDisabled',
      numeric: false,
      disablePadding: false,
      label: 'active',
      sortable: true
    }
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
            {"We couldn't find any SMS Provider matching your search criteria"}
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
                          <Typography fontWeight="700">{data.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {onActiveUpdate ? <CircularProgress size={14}/> : <ListActiveStatus data={data} onUpdate={handleUpdate} />}
                      </TableCell>
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
              rowsPerPageOptions={[100]}
            />
          </Box>

        </>
      )
      }
    </>
  );
};

export default Results;

const ListActiveStatus = ({ data, onUpdate }) => {
  const { toast } = useToast();
  const [isTypeDisabled, setIsTypeDisabled] = useState(!data.isActive);
  const [, setLoading] = useState(false);

  const handleToggle = async () => {
    // if(!checkPermission('TOGGLE_COUNTRY')) return  //NEED_PERMISSION_KEY toggle address type
    const tempData = {
      disable: !isTypeDisabled,
    };

    try {
      setLoading(true);
      await adminService.toggleSmsProvider(data.id, tempData);
      toast(
        `${data.name.toUpperCase()} ${isTypeDisabled ? "Activate" : "Deactivate"
        } successfully!`,
        "success"
      );
      setIsTypeDisabled((toggle) => !toggle);
      onUpdate()
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
        color="primary"
        onChange={(e) => handleToggle(e)}
        inputProps={{ "aria-label": "controlled" }}
      // disabled={!checkPermission(null)} //NEED_PERMISSION_KEY toggle address type
      />
    </Box>
  );
};

const ConfirmModal = ({ show, onHide, deleteRow, onClose, id }) => {
  console.log('is open ?', show)
  return (
    <Dialog fullWidth maxWidth="md" open={show} onClose={onClose}>
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
        <CustomButton text={"No"} onClick={() => onHide()} />
      </DialogActions>
    </Dialog>
  );
};