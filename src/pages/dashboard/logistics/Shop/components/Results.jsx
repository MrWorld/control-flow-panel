import React from "react";
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
  styled,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { useCheckPermission } from "src/hooks/useCheckPermission";
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { imageURLCombiner } from "src/utils/imageUrlCombiner";
import { staticImages } from "src/assets/images";

const Results = ({ resultData, pagination, actions }) => {
  const { checkPermission } = useCheckPermission();
  const navigate = useNavigate();

  const handlePageChange = (_event, newPage) => {
    actions.changePage(newPage);
  };

  const handleLimitChange = (event) => {
    actions.changeTake(parseInt(event.target.value));
  };

  return (
    <Card>
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
          onChange={actions.handleSearchShop}
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
            {"We couldn't find any shop matching your search criteria"}
          </Typography>
        </>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{"ID"}</TableCell>
                  <TableCell>{"Photo"}</TableCell>
                  <TableCell>{"Name"}</TableCell>
                  <TableCell>{"Email"}</TableCell>
                  <TableCell>{"Commission"}</TableCell>
                  <TableCell>{"Active"}</TableCell>
                  <TableCell>{"Phone number"}</TableCell>
                  <TableCell align="right">{"Action"}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultData.map((data) => {
                  return (
                    <TableRow hover key={data.id}>
                      <TableCell>
                        <Typography variant="h5">{data.id}</Typography>
                      </TableCell>
                      <TableCell>
                        <StyledImage
                          alt={`${data.name}-photo`}
                          src={
                            imageURLCombiner(data.logo?.url) ||
                            staticImages.sampleWorld
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Box dir={'rtl'}>
                          <Typography fontWeight="700">{data.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h5">{data.email1}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h5">{data.commission}%</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>
                          {!data.isDisabled ? (
                            <CheckIcon color="success" />
                          ) : (
                            <CloseIcon color="error" />
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h5">
                          {data.phoneNumber1}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography noWrap>
                          <Tooltip title={"View"} arrow>
                            <IconButton
                              disabled={!checkPermission("GET_VENDOR_DETAIL")}
                              onClick={() =>
                                navigate(
                                  ROUTE_CONSTANTS.DASHBOARD.LOGISTICS.SHOP.GET_BY_DATA(
                                    data.id
                                  ).ABSOLUTE,
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
    </Card>
  );
};

export default Results;

const StyledImage = styled("img")`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
`;
