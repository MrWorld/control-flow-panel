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
  styled,
  IconButton,
  Tooltip,
  Switch,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { useCheckPermission } from "src/hooks/useCheckPermission";
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import { useNavigate } from "react-router-dom";
import { imageURLCombiner } from "src/utils/imageUrlCombiner";
import { staticImages } from "src/assets/images";
import { adminService } from "src/api/services/admin";
import useToast from "src/hooks/useToast";

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
          onChange={actions.handleSearchCategory}
          placeholder={"Search by name or ..."}
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
                  <TableCell>{"Arabic Name"}</TableCell>
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
                          <Typography fontWeight="700">{data.id}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <StyledImage
                          alt={`category-${data.name}-photo`}
                          src={
                            imageURLCombiner(data.medias?.url) ||
                            staticImages.sampleProduct
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Box dir={'rtl'}>
                          <Typography fontWeight="700">{data.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box dir={'rtl'}>
                          <Typography fontWeight="700">
                            {data.nameAr}
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
                              disabled={!checkPermission(null)}
                              onClick={() =>
                                navigate(
                                  ROUTE_CONSTANTS.DASHBOARD.CATALOG.CATEGORY
                                    .UPDATE.ROOT.ABSOLUTE,
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

const ListActiveStatus = ({ data }) => {
  const { toast } = useToast();
  const [isCategoryDisabled, setIsCategoryDisabled] = useState(data.isDisabled);
  const [, setLoading] = useState(false);

  const handleToggle = async () => {
    // if(!checkPermission(null)) return  //NEED_PERMISSION_KEY toggle address type
    const tempData = {
      isDisabled: !isCategoryDisabled,
    };

    try {
      setLoading(true);
      await adminService.toggleCatalogCategories(data.id, tempData);
      toast(
        `${data.name.toUpperCase()} ${
          isCategoryDisabled ? "Activate" : "Deactivate"
        } successful!`,
        "success"
      );
      setIsCategoryDisabled((toggle) => !toggle);
      setLoading(false);
    } catch (error) {
      toast(`Error happened in toggle class`, "error");
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Box dir={'rtl'}>
      <Switch
        checked={!isCategoryDisabled}
        onChange={(e) => handleToggle(e)}
        inputProps={{ "aria-label": "controlled" }}
        // disabled={!checkPermission(null)} //NEED_PERMISSION_KEY toggle address type
      />
    </Box>
  );
};

const StyledImage = styled("img")`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
`;
