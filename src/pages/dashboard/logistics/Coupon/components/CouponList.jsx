import React, { useState, useEffect } from "react";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import PageHeader from "./PageHeader";
import {
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import useToast from "src/hooks/useToast";
import { errorMessage } from "src/utils/errorTypeDetector";
import Results from "./Results";
import Footer from "src/components/layouts/AccentSidebarLayout/Footer";
import { adminService } from "src/api/services/admin";
import { useCheckPermission } from "src/hooks/useCheckPermission";
import { useSearchDebounce } from "src/hooks/useSearchDebounce";

const CouponLists = () => {
  const { checkPermission } = useCheckPermission();
  const { handleChangeSearch, query } = useSearchDebounce();
  const { toast } = useToast();


  const [loading, setLoading] = useState(true);
  const [couponList, setCouponList] = useState([]);
  const [page, setPage] = useState(0);
  const [take, setTake] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const handleRefreshList = () => console.log("refresh");

  const handleChangePage = (page) => {
    if (page >= 0) setPage(page);
  };

  const onRowDeleteClicked = async (sender) => {
    if (!checkPermission("REVOKE_COUPON")) return true;
    try {
      await adminService.removeCoupon(sender.id);
      let copyCouponList = { ...couponList };
      const targetIndex = copyCouponList?.items.findIndex(
        (coupon) => coupon.id === sender.id
      );
      copyCouponList.items[targetIndex].isDisabled = true;
      copyCouponList.items[targetIndex].isDeleted = true;
      setCouponList(copyCouponList);
      toast("Coupon revoked successfully", "success");
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  };

  const getCouponList = async () => {
    if (!checkPermission("GET_COUPON_LIST")) return true;
    const data = {
      take,
      page,
    };
    if (query) data.search = query;
    else delete data.search;
    try {
      let res = await adminService.getCouponList(data);
      setLoading(false);
      setCouponList(res.data.data);
      setTotalCount(res?.data?.data?.pagination.total)
    } catch (error) {
      toast(errorMessage(error), "error");
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getCouponList();
  }, [page, take, query]);

  return (
    <Box dir={'rtl'}
      style={{
        minHeight: "92vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <PageTitleWrapper>
        <PageHeader
          pageTitle="Coupon list"
          pageSubtitle="You can see list of coupon here"
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
        marginBottom="auto"
      >
        {/* {(!isVendorAdmin) &&
                    <Grid item xs={12}>
                        <Box dir={'rtl'} style={{ width: '250px' }}>
                            {checkPermission('GET_VENDOR_LIST') && vendorListLoading ? <Box dir={'rtl'} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', marginBottom: 'auto' }}><CircularProgress /></Box> : (
                                <FormControl fullWidth style={{ width: '100%', marginRight: '10px' }}>
                                    <InputLabel id="select-shop-label">Select shop</InputLabel>
                                    <Select

                                        labelId="select-shop-label"
                                        id="select-shop"
                                        value={selectedShopId || ''}
                                        label="Select shop"
                                        defaultValue={searchParams?.get('id') ?? ''}
                                        name='vendorId'
                                        onChange={e => setSelectedShopId(e.target.value)}
                                    >
                                        {
                                            allShops?.length > 0 && allShops.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                                        }
                                    </Select>

                                </FormControl>
                            )}
                        </Box>
                    </Grid>
                } */}
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
              resultData={couponList || []}
              pagination={{
                page,
                take,
                totalCount,
              }}
              actions={{
                changePage: (page) => handleChangePage(page),
                changeTake: (take) => setTake(take),
                onDelete: onRowDeleteClicked,
                handleSearchCoupon: handleChangeSearch,
              }}
              itemPartitions={{
                toggle: true,
                image: false,
              }}
            />
          )}
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
};

export default CouponLists;
