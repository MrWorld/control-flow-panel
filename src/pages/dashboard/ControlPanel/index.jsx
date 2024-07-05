import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import PageHeader from "./components/PageHeader";
import { Grid, Box, CircularProgress } from "@mui/material";
import Results from "./components/Results";
import { adminService } from "src/api/services/admin";
import { useCheckPermission } from "src/hooks/useCheckPermission";
import { useSearchDebounce } from "src/hooks/useSearchDebounce";


const ControlPanel = () => {
  const branchId = localStorage.getItem('branchId')
  const rememberSort = localStorage.getItem(`${branchId}:controlPanelSort`)
  // const { checkPermission } = useCheckPermission();
  const { handleChangeSearch, query } = useSearchDebounce();
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [take, setTake] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [statistics, setStatistics] = useState(null);
  const [sort, setSort] = useState(rememberSort ? rememberSort : 'id:desc');
  const [filter, setFilter] = useState('');
  const requestPayload = useRef()

  const fetchData = useCallback(async(payload) => {
    // if (!checkPermission("KEY_TAG:READ")) return true;
    
    let data = { take, page };
    if (query) data.search = query;
    //**** */ let filter = {
    //   hideDisabled: false,
    //   hideDeleted: false,
    // }
    // data['filter'] = filter.slice(0, -1);
    data.limit = 300
    data.offset = 0
    data.sort= sort
    if(payload) {
      data = payload;
    }else{
      requestPayload.current = data;
    }
    try {
      const response = await adminService.getActiveKeyTags(data);
      setLoading(false);
      setListData(response.data.data);
      setTotalCount(response.data.pagination.total);
    } catch (err) {
      setLoading(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, take, query, sort, filter])


  const getStatistics = async() => {
    try {
      const response = await adminService.getControlPanelStatistics()
      setStatistics(response.data.data)
    }catch(err) {
      console.log(err)
    }
    
  }

  const handleRefreshList = () => {
    getStatistics();
    fetchData();
  };

  useLayoutEffect(() => {
    const id = setInterval(() => {
      fetchData(requestPayload.current)
      getStatistics();
    }, 10000);
    return () => clearInterval(id);
 }, []);


  const handleChangePage = (page) => {
    if (page >= 0) setPage(page);
  };

  useEffect(() => {
    fetchData();
    getStatistics();
  }, [fetchData]);

  const handleSetSort = (x) => {
    setSort(x)
    localStorage.setItem(`${branchId}:controlPanelSort`, x)
  }
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
          pageTitle="Control Panel"
          pageSubtitle=""
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
        <Grid item xs={12} md={12}>
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
              statistics={statistics}
              sort={sort}
              changeSort={(x) => handleSetSort(x)}
              changeFilter={(x) => setFilter(x)}
              pagination={{
                page,
                take,
                totalCount,
              }}
              actions={{
                changePage: (page) => handleChangePage(page),
                changeTake: (take) => setTake(take),
                handleSearchType: handleChangeSearch,
                handleRefreshList: handleRefreshList
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

export default ControlPanel;
