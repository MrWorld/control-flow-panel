import {
  Grid,
  Box,
  CardActionArea,
  Card,
  Typography,
  styled,
  useTheme,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  useMediaQuery,
  alpha,
  Tooltip,
} from "@mui/material";

import Text from "src/components/Text";
import LabelIcon from "@mui/icons-material/Label";
import dayjs from "dayjs";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DetailsMain from "../Details";
import { BookingStatuses } from "../Details/constants";
import { useCountUp } from "src/hooks/useCountupTimer";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

import * as moment from "moment";

import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";
import { useNavigate } from "react-router-dom";
const CardBorderBottom = styled(Card)(
  () => `
      border-bottom: transparent 5px solid;
      border-top: transparent 1px solid;
    `
);
const CardActionAreaWrapper = styled(CardActionArea)(
  ({ theme }) => `
      // padding: ${theme.spacing(8, 2, 3, 3)};
      display: flex;
      align-items: center;
      justify-content: space-between;
  
      .MuiTouchRipple-root {
          opacity: .3;
      }
  
      &:hover {
          .MuiCardActionArea-focusHighlight {
              opacity: .05;
          }
      }
    `
);

function KeyTagCards({ data, handleRefresh, isKanban = false }) {
  const theme = useTheme();
  // const [days, hours, minutes, seconds] = useCountUp(dayjs(data?.status.creationTime));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const onUpdateHandle = (payload) => {
    handleRefresh();
  };

  return (
    <Grid
      item
      width={isKanban ? "100%" : "100px"}
      marginBottom={isKanban ? "4px" : "0"}
    >
      <CardBorderBottom
        sx={{
          boxShadow: `${data?.status?.color}`,
          borderBottomColor: `${data?.status?.color}`,
          borderTopColor: `${data?.status?.color}`,
          background: alpha(data?.status?.color || "#fffffff", 0.1),
        }}
        onClick={() => setIsModalOpen(true)}
      >
        <CardActionAreaWrapper>
          <Grid container>
            <Grid item xs={12} height={40}>
              {!data?.paymentStatus ? (
                <Box dir={'rtl'}
                  sx={{
                    height: "20px",
                    width: "20px",
                    position: "absolute",
                    borderRadius: 5,
                    left: 0,
                    top: 0,
                  }}
                >
                  <Tooltip title={"Payment is Pending"}>
                    <ReportProblemIcon
                      sx={{
                        marginLeft: "3px",
                        marginTop: "1px",
                        fontSize: "14px",
                        color: "orange",
                      }}
                    />
                  </Tooltip>
                </Box>
              ) : (
                <></>
              )}
              <Typography
                component="span"
                sx={{
                  opacity: 1,
                  display: "flex",
                  fontWeight: 900,
                  width: "100%",
                  lineHeight: "32px",
                  fontSize: (data?.code + "").length > 3 ? "14px" : 28,
                  justifyContent: "center",
                }}
              >
                {data?.code}
              </Typography>
            </Grid>
            <Grid item xs={12} height={36}>
              <Typography
                sx={{
                  opacity: 1,
                  fontSize: 10,
                  display: "flex",
                  fontWeight: 300,
                  width: "100%",
                  textAlign: "center",
                  lineHeight: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {data?.customerType}
              </Typography>
              <Typography
                component="span"
                color={data?.status?.color}
                sx={{
                  opacity: 1,
                  fontSize: 12,
                  display: "flex",
                  fontWeight: 900,
                  width: "100%",
                  textAlign: "center",
                  lineHeight: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {data?.status?.title}
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Typography
                component="span"
                color="black"
                sx={{
                  opacity: 0.5,
                  flex: 1,
                  display: "flex",
                  width: "100%",
                  fontWeight: "900",
                  justifyContent: "center",
                }}
              >
                {/* {`${hours}:${minutes}:${seconds}`} */}
                {/* {dayjs(dayjs() - dayjs(data?.status?.creationTime)).format('HH:mm:ss')} */}
                {/* {dayjs(dayjs() - dayjs.utc(data?.status?.creationTime.substring(0, 23))).format('HH:mm:ss')} */}
                {moment().diff(data?.status?.creationTime, "hours")}:
                {/* {moment().diff(data?.status?.creationTime, 'minutes')}:
                {moment().diff(data?.status?.creationTime, 'seconds')}: */}
                {moment(
                  moment() - moment(data?.status?.creationTime).utc(true)
                ).format("mm:ss")}
              </Typography>
            </Grid>
          </Grid>
        </CardActionAreaWrapper>
      </CardBorderBottom>
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth={"100vw"}
        fullScreen={isMediumScreen ? true : false}
        fullWidth={isMediumScreen ? false : true}
      >
        <DialogContent
          style={{ borderTop: `2px solid ${data?.status?.color}` }}
        >
          <Button
            style={{
              position: "absolute",
              right: 70,
              top: 0,
              zIndex: 100,
            }}
            onClick={() =>
              navigate(
                ROUTE_CONSTANTS.DASHBOARD.MASTERS.BOOKING.GET_BY_DATA(
                  data?.Bookings[0]?.id
                ).ABSOLUTE
              )
            }
          >
            <OpenInNewIcon />
          </Button>
          <Box dir={'rtl'}
            style={{
              position: "absolute",
              left: -10,
              top: -80,
            }}
          >
            <Text style={{ color: data?.status?.color }}>
              <LabelIcon style={{ fontSize: 150 }} />
            </Text>
            <Box dir={'rtl'} mt={0.5}>
              <Typography
                component="span"
                variant="h5"
                style={{
                  position: "absolute",
                  marginTop: -75,
                  marginLeft: 25,
                  color: "white",
                  fontWeight: 900,
                  fontSize: 22,
                }}
              >
                {data.code}
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={() => setIsModalOpen(false)}
            style={{ position: "absolute", right: 0, top: 0 }}
            variant="text"
          >
            <CloseIcon />
          </Button>
          <DetailsMain
            payload={data}
            onUpdateHandle={onUpdateHandle}
            closeMe={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Grid>
  );
}

export default KeyTagCards;
