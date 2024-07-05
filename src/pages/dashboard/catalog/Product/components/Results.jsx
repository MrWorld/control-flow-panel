import React from "react";
import {
  Box,
  Card,
  TablePagination,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Tooltip,
  IconButton,
  styled,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { useCheckPermission } from "src/hooks/useCheckPermission";
import { useNavigate } from "react-router-dom";
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";
import { imageURLCombiner } from "src/utils/imageUrlCombiner";
import { staticImages } from "src/assets/images";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

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
          onChange={actions.handleSearchProduct}
          placeholder={"Search by name ..."}
          size="small"
          // fullWidth
          margin="normal"
          variant="outlined"
        />
      </Box>
      {resultData.length === 0 ? (
        <Typography
          sx={{
            py: 10,
          }}
          variant="h3"
          fontWeight="normal"
          color="text.secondary"
          align="center"
        >
          {"We couldn't find any classes matching your search criteria"}
        </Typography>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{"Id"}</TableCell>
                  <TableCell>{"Photo"}</TableCell>
                  <TableCell>{"Name"}</TableCell>
                  <TableCell>{"Price"}</TableCell>
                  <TableCell>{"Discount"}</TableCell>
                  <TableCell>{"Dimension"}</TableCell>
                  <TableCell>{"Category"}</TableCell>
                  <TableCell>{"Type"}</TableCell>
                  <TableCell>{"Active"}</TableCell>
                  <TableCell align="right">{"Update"}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultData.map((data) => {
                  return (
                    <TableRow hover key={data.id}>
                      <TableCell style={{ width: "30px" }}>
                        <Box dir={'rtl'}>
                          <Typography fontWeight="800">{data.id}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <StyledImage
                          alt={`category-${data?.name}-photo`}
                          src={
                            imageURLCombiner(data?.medias[0]?.url) ||
                            staticImages.sampleProduct
                          }
                        />
                      </TableCell>
                      <TableCell style={{ maxWidth: "150px" }}>
                        <Box dir={'rtl'}>
                          <Typography fontWeight="800">{data?.name}</Typography>
                          <Typography fontWeight="600">
                            {data?.nameAr}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box dir={'rtl'}>
                          <Typography fontWeight="800">
                            KD {data?.price}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box dir={'rtl'}>
                          {data?.hasDiscount ? (
                            <Typography fontWeight="800">
                              {`${
                                data?.discountType === "AMOUNT" ? "KD" : "%"
                              } ${data?.discount}`}
                            </Typography>
                          ) : (
                            <Typography fontWeight="800" marginLeft={2}>
                              _
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box dir={'rtl'}
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <Typography fontWeight="700">
                            Height: {data?.height}
                          </Typography>
                          <Typography fontWeight="700">
                            Width: {data?.width}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box dir={'rtl'}>
                          <Typography fontWeight="700">
                            {data?.category?.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box dir={'rtl'}>
                          <Typography fontWeight="700">
                            {data?.type?.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {!data.isDisabled ? (
                          <CheckIcon color="success" />
                        ) : (
                          <CloseIcon color="error" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography noWrap>
                          <Tooltip title={"View"} arrow>
                            <IconButton
                              disabled={!checkPermission("GET_PRODUCT_DETAIL")}
                              onClick={() =>
                                navigate(
                                  ROUTE_CONSTANTS.DASHBOARD.CATALOG.PRODUCT.GET_BY_DATA(
                                    data?.id
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
          <Card
            sx={{
              p: 2,
              mt: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box dir={'rtl'}>
              <Typography component="span" variant="subtitle1">
                {"Showing"}
              </Typography>{" "}
              <b>
                {pagination.totalCount < pagination.take
                  ? pagination.totalCount
                  : pagination.take}
              </b>{" "}
              {"of"} <b>{pagination.totalCount}</b> <b>{"Products"}</b>
            </Box>
            <TablePagination
              component="div"
              count={pagination.totalCount}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={pagination.page}
              rowsPerPage={pagination.take}
              labelRowsPerPage=""
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Card>
        </>
      )}
    </Card>
  );
};

export default Results;

const StyledImage = styled("img")`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
`;
