import React, { useState, useEffect } from "react";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import PageHeader from "./components/PageHeader";
import { Grid, Box, CircularProgress } from "@mui/material";
import Results from "./components/Results";
import Footer from "src/components/layouts/AccentSidebarLayout/Footer";
import { adminService } from "src/api/services/admin";
import { useCheckPermission } from "src/hooks/useCheckPermission";
import { useSearchDebounce } from "src/hooks/useSearchDebounce";

const Shop = () => {
  const { checkPermission } = useCheckPermission();
  const { handleChangeSearch, query } = useSearchDebounce();
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [take, setTake] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const getMyList = async () => {
    if (!checkPermission("GET_VENDOR_LIST")) return true;
    let data = { take, page };
    if (query) data.search = query;
    else delete data.search;
    //**** */ let filter = {
    //   hideDisabled: false,
    //   hideDeleted: false,
    // }
    // data['filter'] = filter

    try {
      const response = await adminService.getVendorList(data);
      setLoading(false);
      setListData(response.data.data.items);
      setTotalCount(response.data.data.pagination.total);
    } catch (err) {
      setLoading(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshList = () => getMyList();

  const handleChangePage = (page) => {
    if (page >= 0) setPage(page);
  };

  useEffect(() => {
    getMyList();
  }, [page, take, query]);

  return (
    <Box dir={'rtl'}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "92vh",
        justifyContent: "space-between",
      }}
    >
      <PageTitleWrapper>
        <PageHeader
          pageTitle="Shops"
          pageSubtitle="You can see list of shops here"
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
              actions={{
                changePage: (page) => handleChangePage(page),
                changeTake: (take) => setTake(take),
                handleSearchShop: handleChangeSearch,
              }}
              itemPartitions={{
                toggle: true,
                image: true,
              }}
            />
          )}
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
};

export default Shop;
