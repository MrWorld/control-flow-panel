import { useState, useEffect } from "react";
import { adminService } from "src/api/services/admin";
import { Box, CircularProgress, Typography } from "@mui/material";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import Footer from "src/components/layouts/AccentSidebarLayout/Footer";
import PageHeader from "./components/PageHeader";
import KanbanParcel from "./components/KanbanParcel";
import ParcelTimeLineView from "./components/ParcelTimeLineView";
import { useUser } from "src/contexts/GlobalContext";
import { useSearchParams } from "react-router-dom";
import { useCheckPermission } from "src/hooks/useCheckPermission";

const Parcels = () => {
  const { checkPermission } = useCheckPermission();
  const { role, vendorId } = useUser();
  const isVendorAdmin = role === "VENDORADMIN";
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, setTotalCount] = useState(0);
  const [params, setParams] = useSearchParams({
    tab: "KANBAN_VIEW",
    shopId: 0,
  });
  const shopId = params.get("shopId");

  const getData = async () => {
    if (!checkPermission("GET_PARCEL_LIST")) return true;
    try {
      setLoading(true);
      const response = await adminService.getParcels(
        isVendorAdmin && vendorId ? vendorId : shopId
      );
      setLoading(false);
      setParcels(response.data.data.items);
      setTotalCount(response.data.data.pagination.total);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const renderBody = () => {
    switch (params.get("tab")) {
      case "KANBAN_VIEW":
        return (
          <KanbanParcel
            update={getData}
            parcels={parcels}
            setter={setParcels}
          />
        );
      case "TIME_LINE_RANEG":
        return (
          <ParcelTimeLineView
            update={getData}
            parcelsList={parcels.filter(
              (parcel) => parcel.deliveryType === "TIMERANGE"
            )}
            rangeView={true}
          />
        );
      case "TIME_LINE_ASAP":
        return (
          <ParcelTimeLineView
            update={getData}
            parcelsList={parcels.filter(
              (parcel) => parcel.deliveryType === "ASAP"
            )}
            rangeView={false}
          />
        );
      default:
        break;
    }
  };

  const handleRefreshList = () => getData();

  const checkIsShowingValid = () => {
    if (isVendorAdmin) return true;
    else if (!isNaN(shopId)) return true;
    else return false;
  };

  useEffect(() => {
    if (checkIsShowingValid()) getData();
  }, [shopId]);

  return (
    <Box dir={'rtl'}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "92vh",
      }}
    >
      <PageTitleWrapper>
        <PageHeader
          pageTitle="Parcel Management"
          pageSubtitle="You can manage parcels here"
          handleRefreshList={handleRefreshList}
          activeTab={params.get("tab")}
          changeActiveTab={(currentTab) =>
            setParams((prev) => ({
              shopId: prev.get("shopId"),
              tab: currentTab,
            }))
          }
          shopManagement={{
            selectedShopId: shopId === "undefined" ? undefined : shopId,
            setSelectedShopId: (id) =>
              setParams((prev) => ({ shopId: id, tab: prev.get("tab") })),
          }}
          showParcels={isVendorAdmin ? false : true}
        />
      </PageTitleWrapper>
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
      ) : checkIsShowingValid() ? (
        renderBody()
      ) : (
        <Box dir={'rtl'}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <Typography variant="h4">You did not select a shop yet!</Typography>
        </Box>
      )}
      <Footer />
    </Box>
  );
};

export default Parcels;
