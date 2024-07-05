import React from "react";
import {
  Box,
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  Typography,
  TextField,
  InputAdornment
} from "@mui/material";
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import CouponRow from "./CouponRow";

const Results = ({ resultData, pagination, actions }) => {
  const couponList = resultData?.items || [];

  const handlePageChange = (_event, newPage) => {
    actions.changePage(newPage);
  };

  //**** change number of vendors gotten in a page ***
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
          onChange={actions.handleSearchCoupon}
          placeholder={"Search by coupon code ..."}
          size="small"
          fullWidth
          margin="normal"
          variant="outlined"
        />
      </Box>
      <Divider />
      {couponList.length === 0 ? (
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
            {"We couldn't find any coupon matching your search criteria"}
          </Typography>
        </>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="right">{"ID"}</TableCell>
                  <TableCell align="right">{"Amount"}</TableCell>
                  <TableCell>{"Coupon code"}</TableCell>
                  <TableCell>{"Start date"}</TableCell>
                  <TableCell>{"End date"}</TableCell>
                  <TableCell>{"Status"}</TableCell>
                  <TableCell>{"Limit"}</TableCell>
                  <TableCell>{"uint"}</TableCell>
                  <TableCell align="right">{"Remaining"}</TableCell>
                  <TableCell align="right">{"Action"}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {couponList.map((data) => (
                  <CouponRow
                    onDelete={actions.onDelete}
                    key={data.id}
                    data={data}
                  />
                ))}
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
