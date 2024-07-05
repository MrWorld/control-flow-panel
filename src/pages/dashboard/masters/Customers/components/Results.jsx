import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  Divider,
  Tooltip,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  Tab,
  Tabs,
  TextField,
  Typography,
  styled,
  CircularProgress,
  TableSortLabel
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import Label from 'src/components/Label';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import { imageURLCombiner } from 'src/utils/imageUrlCombiner'
import { staticImages } from 'src/assets/images'
import { useCheckPermission } from 'src/hooks/useCheckPermission'
import { tabs } from '../constants'
import { useUser } from 'src/contexts/GlobalContext';
import { makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';
import { adminService } from 'src/api/services/admin';

const useStyles = makeStyles({
  fadedRow: {
    background: 'white',
    opacity: 0.5,
    position: 'relative',
  },
  spinner: {
    position: 'absolute',
    right: '50%',
    bottom: '50%'
  }
})

const Results = ({ resultData, pagination, actions, activeTab, loading, orderBy, order, onRequestSort, hideTabs }) => {
  const classes = useStyles();
  const { checkPermission } = useCheckPermission()
  const navigate = useNavigate();
  const [roleGroups, setRoleGroups] = useState([])
  const [roleGroupLoading, setRoleGroupLoading] = useState(true)
  const user = useUser()
  const handlePageChange = (_event, newPage) => {
    actions.changePage(newPage);
  };

  const handleLimitChange = (event) => {
    actions.changeTake(parseInt(event.target.value));
  };

  const handleRedirectUserToProfile = id => {
    if (id === user.id) navigate(ROUTE_CONSTANTS.DASHBOARD.CUSTOMERS.PROFILE.ROOT.ABSOLUTE)
    else navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.CUSTOMERS.GET_BY_DATA(id).ABSOLUTE)
  }
  const getRoles = async () => {
    const data = {
      offset: 0,
      limit: 1000
    }
    try {
      const response = await adminService.getCustomerTypes(data)
      setRoleGroups([{ id: 'ALL', name: 'All Users' }, ...response.data.data])
      setRoleGroupLoading(false)
    } catch (err) {
      setRoleGroupLoading(false)
      console.log(err)
    }

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
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: 'name',
      sortable: true
    },
    {
      id: 'phone',
      numeric: false,
      disablePadding: false,
      label: 'phone',
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

  useEffect(() => {
    getRoles()
  }, [])

  return (
    <>
      <>
        <Box dir={'rtl'} p={2}>
          <TextField
            sx={{
              m: 0
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchTwoToneIcon />
                </InputAdornment>
              )
            }}
            onChange={actions.handleSearchAdmin}
            placeholder={'Search by name, email or username...'}
            // value={query} no need to have value here.
            size="small"
            // fullWidth
            margin="normal"
            variant="outlined"
          />
        </Box>
        <Divider />
        {resultData.length === 0}
        {resultData.length === 0 ? (
          <>
            <Typography
              sx={{
                py: 10
              }}
              variant="h3"
              fontWeight="normal"
              color="text.secondary"
              align="center"
            >
              {"We couldn't find any customer matching your search criteria"}
            </Typography>
          </>
        ) : (
          <>
            <TableContainer >
              <Table >
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
                <TableBody className={loading ? classes.fadedRow : classes.tableRow}>

                  <div className={classes.spinner}>
                    {loading && <CircularProgress />}
                  </div>

                  {resultData.map((user) => {
                    return (
                      <TableRow hover key={user.id} >
                        <TableCell>{user?.id}</TableCell>
                        <TableCell>
                          <Box dir={'rtl'} display="flex" alignItems="center">
                            <Box dir={'rtl'}>
                              <Typography fontWeight='700'>{user.name}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant='h5'>{user.phone}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography noWrap>
                            <Tooltip title={'View'} arrow>
                              <IconButton
                                disabled={!checkPermission('CUSTOMER:READ')}
                                onClick={() => checkPermission('CUSTOMER:READ') && handleRedirectUserToProfile(user.id)}
                                color="primary"
                              >
                                <LaunchTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )
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
    </>
  );
};

Results.propTypes = {
  users: PropTypes.array.isRequired
};

Results.defaultProps = {
  users: []
};

export default Results

// const search

const getUserRoleLabel = (userRole = 'SUPERADMIN') => {
  const map = {
    CUSTOMER: {
      text: 'Customer',
      color: 'info'
    },
    SUPERADMIN: {
      text: 'Super Admin',
      color: 'error'
    },
    VENDORADMIN: {
      text: 'Vendor Admin',
      color: 'warning'
    },
    ADMIN: {
      text: 'Admin',
      color: 'success'
    }
  };

  const { text, color } = map[userRole];

  return <Label color={color}>{text}</Label>
}


const TabsWrapper = styled(Tabs)(
  ({ theme }) => `
    @media (max-width: ${theme.breakpoints.values.md}px) {
      .MuiTabs-scrollableX {
        overflow-x: auto !important;
      }

      .MuiTabs-indicator {
          box-shadow: none;
      }
    }
    `
);


