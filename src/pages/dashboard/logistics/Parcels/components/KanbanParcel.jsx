/* eslint-disable no-undef */
import React from "react";
import {
  Typography,
  styled,
  Tooltip,
  IconButton,
  Avatar,
  Card,
  Box,
} from "@mui/material";
// import useToast from '../../../../../hooks/useToast'
import { Link as RouterLink } from "react-router-dom";
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";
import dayjs from "dayjs";
import { parcelKanbanColumns } from "../constants";
import { imageURLCombiner } from "src/utils/imageUrlCombiner";
import { staticImages } from "src/assets/images";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import OrderStatusSelector from "../../../logistics/Orders/components/OrderStatusSelector";

const duration = require("dayjs/plugin/duration");
const relativeTime = require("dayjs/plugin/relativeTime");
const isBetween = require("dayjs/plugin/isBetween");

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(isBetween);

const KanbanParcels = ({ parcels, update, setter }) => {
  const handleInfinitScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      console.log("handle get new items here");
    }
  };

  return (
    <StyledKanbanWrapper>
      {Object.entries(parcelKanbanColumns).map(([columnKey, columnValue]) => {
        return (
          <StyledKanbanBox key={columnKey}>
            <Typography className="card-title">{columnValue.title}</Typography>
            <Card className="card-body" onScroll={handleInfinitScroll}>
              {parcels
                .filter((p) => p.parcelStatus === columnValue.slug)
                .map((parcel, index) => (
                  <KanbanParcelCard
                    key={index}
                    parcel={parcel}
                    update={update}
                    setter={setter}
                    parcels={parcels}
                  />
                ))}
            </Card>
          </StyledKanbanBox>
        );
      })}
    </StyledKanbanWrapper>
  );
};

export default KanbanParcels;

const KanbanParcelCard = ({ parcel, update, setter, parcels }) => {
  const onSelectedStattus = (caller) => {
    // console.log('caller',caller)
    // let tempParcels = [...parcels];
    // const findedParcelIndex = tempParcels.findIndex(
    //   (item) => item.id === caller.id
    // );
    // tempParcels[findedParcelIndex].parcelStatus = caller.status;
    // setter([...tempParcels]);
  };

  return (
    <StyledKanbanCard color={parcel?.statusColor || "#fff"}>
      <Box dir={'rtl'} className="border-raight" />
      <Box dir={'rtl'} className="parcel-card-body">
        <Box dir={'rtl'} className="parcel-card-row">
          <Box dir={'rtl'}>
            <Typography className="pcl-id">PCL_{parcel.id}</Typography>
          </Box>
          <Box dir={'rtl'} className="details-icon">
            <Typography noWrap>
              <Tooltip title={"View"} arrow>
                <IconButton
                  component={RouterLink}
                  // disabled={!checkPermission('GET_VENDOR_DETAIL')}
                  // to={checkPermission('GET_VENDOR_DETAIL') && ROUTE_CONSTANTS.DASHBOARD.LOGISTICS.VENDORS.GET_BY_DATA(data.id).ABSOLUTE}
                  to={
                    ROUTE_CONSTANTS.DASHBOARD.LOGISTICS.PARCELS.GET_BY_DATA(
                      parcel.id
                    ).ABSOLUTE
                  }
                  style={{ color: "#dbdbdb" }}
                >
                  <LaunchTwoToneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
          </Box>
        </Box>
        <Box dir={'rtl'} className="parcel-card-row">
          <Typography>{dayjs(parcel.deliveryStart).format("HH:mm")}</Typography>
          <Typography>{parcel.deliveryType}</Typography>
        </Box>
        <Box dir={'rtl'}
          className="parcel-card-row"
          style={{ borderBottom: "1px solid #dbdbdb60", marginTop: "10px" }}
        />
        <Box dir={'rtl'}
          className="parcel-card-row"
          style={{ marginTop: "9px", alignItems: "center" }}
        >
          <OrderStatusSelector
            listOrder={parcel?.id}
            status={parcel?.parcelStatus}
            style={{
              height: "30px",
              backgroundColor: parcel?.statusColor,
              color: parcel?.textColor,
            }}
            onUpdateStatus={update}
            from="parcelDetail"
            onSelected={onSelectedStattus}
          />
          <Box dir={'rtl'}
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              position: "relative",
            }}
          >
            {parcel.soldItems.length > 0 &&
              parcel.soldItems.map((p, index) => (
                <Avatar
                  key={index}
                  alt="product-images"
                  src={
                    imageURLCombiner(p.product?.medias[0]?.url) ||
                    staticImages.sampleWorld
                  }
                  sx={{ width: 35, height: 35 }}
                  className="product-item"
                />
              ))}
          </Box>
        </Box>
      </Box>
    </StyledKanbanCard>
  );
};

const StyledKanbanCard = styled(Box)`
  height: 130px;
  margin-top: 10px;
  border-radius: 15px;
  display: flex;
  flex-direction: row;
  border: 1px solid #3b4c62;
  background-color: rgb(36, 55, 80);
  .border-raight {
    height: 80%;
    width: 5px;
    background-color: ${(p) => p.color};
    display: flex;
    align-self: center;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    margin-left: 0px;
    box-shadow: -0px 0px 8px 0px ${(p) => p.color};
  }
  .parcel-card-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 8px;
    .parcel-card-row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      color: #dbdbdb;
      .pcl-id {
        color: #dbdbdb;
        margin-top: 5px;
        font-weight: 600;
      }
      .details-icon {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .product-item {
        margin-left: -20px;
        border: 2px solid #243750;
      }
      .divider {
        width: 3px;
        color: red;
        height: 3px;
      }
      .status-box {
        width: auto;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #427899;
        padding: 0px 20px;
        border-radius: 8px;
      }
    }
  }
`;
const StyledKanbanWrapper = styled(Box)`
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap:
    width: 100%;
    height: 65.7vh;
    overFlow-x: scroll;
    margin-left: 10px;
    padding: 20px;
`;
const StyledKanbanBox = styled(Box)`
  .card-title {
    font-size: 15px;
    font-weight: 700;
  }
  .card-body {
    width: 350px;
    height: calc(100% - 20px);
    margin-right: 10px;
    flex-shrink: 0;
    padding: 8px;
    overflow-y: scroll;
  }
`;
