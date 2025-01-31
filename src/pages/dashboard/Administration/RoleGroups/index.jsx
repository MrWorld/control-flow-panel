import React, { useState, useEffect } from "react";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import PageHeader from "./components/PageHeader";
import { Grid, Box, CircularProgress } from "@mui/material";
import Results from "./components/Results";
import Footer from "src/components/layouts/AccentSidebarLayout/Footer";
import { adminService } from "src/api/services/admin";
import { useCheckPermission } from "src/hooks/useCheckPermission";
import { useSearchDebounce } from "src/hooks/useSearchDebounce";
import useToast from "src/hooks/useToast";

const RoleGroup = () => {
  const { checkPermission } = useCheckPermission();
  const { handleChangeSearch, query } = useSearchDebounce();
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [take, setTake] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');
  const { toast } = useToast()

  const getMyList = async () => {
    if (!checkPermission("ROLE_GROUP:READ")) return true;
    let data = { page, take };
    if (query) data.search = query;
    else delete data.search;
    //**** */ let filter = {
    //   hideDisabled: false,
    //   hideDeleted: false,
    // }
    // data['filter'] = filter
    data.limit = take
    data.offset = page < 1 ? '0' : +(page * take)
    if (orderBy) {
      data.sort = orderBy + ':' + order
    }

    try {
      const response = await adminService.getRoleGroupList(data);
      setLoading(false);
      setListData(response.data.data);
      setTotalCount(response.data.pagination.total);
    } catch (err) {
      toast(err?.response?.data?.message || 'Network Error!', 'error')
      setLoading(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRefreshList = () => getMyList();

  const handleChangePage = (page) => {
    if (page >= 0) setPage(page);
  };

  useEffect(() => {
    getMyList();
  }, [page, take, query, order, orderBy]);

  return (
    <Box dir={'rtl'}
      style={{
        display: "flex",
        flexDirection: "column",
        // justifyContent: "space-between",
        minHeight: "92vh",
      }}
    >
      <PageTitleWrapper>
        <PageHeader
          pageTitle="Role Group"
          pageSubtitle="You can see list of Role Group here"
          handleRefreshList={handleRefreshList}
        />
      </PageTitleWrapper>
      <Grid
        sx={{
          px: 4,
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12}>
          {loading ? (
            <Box dir={'rtl'}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Results
              resultData={listData}
              pagination={{
                page,
                take,
                totalCount,
              }}
              onRequestSort={handleRequestSort}
              order={order}
              orderBy={orderBy}
              actions={{
                changePage: (page) => handleChangePage(page),
                changeTake: (take) => setTake(take),
                handleSearchType: handleChangeSearch,
              }}
              itemPartitions={{
                toggle: true,
                image: false,
              }}
            />
          )}
        </Grid>
      </Grid>
      {/* <Footer /> */}
    </Box>
  );
};

export default RoleGroup;
