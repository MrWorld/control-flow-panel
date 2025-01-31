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
  TableSortLabel,
} from "@mui/material";
import { useCheckPermission } from "src/hooks/useCheckPermission";
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import { useNavigate } from "react-router-dom";
import { adminService } from "src/api/services/admin";
import useToast from "src/hooks/useToast";
import { visuallyHidden } from '@mui/utils';


const Results = ({ resultData, pagination, actions, orderBy, order, onRequestSort }) => {
  const { checkPermission } = useCheckPermission();
  const navigate = useNavigate();

  const handlePageChange = (_event, newPage) => {
    actions.changePage(newPage);
  };

  const handleLimitChange = (event) => {
    actions.changeTake(parseInt(event.target.value));
  };


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
      id: 'description',
      numeric: false,
      disablePadding: false,
      label: 'description',
      sortable: true
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
            {"We couldn't find any role group matching your search criteria"}
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
                        <Box dir={'rtl'}>
                          <Typography fontWeight="700">
                            {data.description}
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
                              disabled={!checkPermission("ROLE_GROUP:UPDATE")}
                              onClick={() =>
                                checkPermission("ROLE_GROUP:UPDATE") &&
                                navigate(
                                  ROUTE_CONSTANTS.DASHBOARD.ADMINISTRATION.ROLE_GROUP.UPDATE.ROOT.ABSOLUTE,
                                  { state: data }
                                )
                              }
                              // to={checkPermission(null) && ROUTE_CONSTANTS.DASHBOARD.LOGISTICS.VENDORS.GET_BY_DATA(data.vendorId).GET_BY_DATA(data.id).ABSOLUTE}
                              // to={ROUTE_CONSTANTS.DASHBOARD.STORE_FRONT.APP_HOME.UPDATE.ROOT.ABSOLUTE, {state: data}}
                              color="primary"
                            >
                              <LaunchTwoToneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Typography>
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
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Box>
        </>
      )}
    </>
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
      await adminService.toggleRoleGroup(data.id, tempData);
      toast(
        `${data.name.toUpperCase()} ${isTypeDisabled ? "Activate" : "Deactivate"
        } successfully!`,
        "success"
      );
      setIsTypeDisabled((toggle) => !toggle);
      setLoading(false);
    } catch (err) {
      toast(err?.response?.data?.message || 'Network Error!', 'error')
      // toast(`Error happened in toggle`, "error");
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
