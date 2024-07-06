import {
  Box,
  Button,
  Card,
  Chip,
  Collapse,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  Typography,
  alpha,
} from "@mui/material";
import { taskStatusWithPercentage } from "../constants";
import { DownloadDoneOutlined } from "@mui/icons-material";
import { Masonry } from "@mui/lab";

const OperationCard = ({ data }) => {
  return (
    <>
      <Card sx={{ padding: 2, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography>نام :‌ {data?.name}</Typography>
            <Typography>تعداد :‌ {data?.quantity}</Typography>
          </Box>
          <Box>
            <Typography>
              دستور ساخت :‌ {data?.manufacturingSchema?.name}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <List sx={{ width: "100%" }}>
          {data?.manufacturingSchema?.Medias?.map((mMedia) => {
            return (
              <ListItem key={mMedia.id} sx={{ width: "100%" }}>
                <a href={mMedia?.url} target="_blank" rel="noreferrer">
                  <Button variant="outlined" fullWidth>
                    <DownloadDoneOutlined />
                    <Typography>{mMedia.orginalName}</Typography>
                  </Button>
                </a>
              </ListItem>
            );
          })}
        </List>
        {data?.manufacturingSchema?.Medias?.length == 0 ? (
          <Typography sx={{ color: "orange" }}>
            فایل ای برای این وظیفه وجود ندارد
          </Typography>
        ) : (
          <></>
        )}
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Typography variant="h5" sx={{}}>
          توضیحات
        </Typography>
        <Typography sx={{ color: "#282828" }}>
          {data?.manufacturingSchema?.description}
        </Typography>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Box>
          {data?.TaskUnitManufacturing?.map((units) => {
            return (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ mt: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>{units.id}</Typography>
                        <Chip
                          label={StatusMaker({ status: units.status }).name}
                          sx={{
                            mb: 1,
                            background: alpha(
                              StatusMaker({ status: units.status }).color,
                              0.3
                            ),
                          }}
                        ></Chip>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        sx={{
                          color: StatusMaker({ status: units.status }).color,
                        }}
                        value={StatusMaker({ status: units.status }).percentage}
                        color="inherit"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </>
            );
          })}
        </Box>
      </Card>
    </>
  );
};

const StatusMaker = ({ status }) => {
  const find = taskStatusWithPercentage[`${status}`];
  if (find?.name) {
    return find;
  } else {
    return {
      name: "وضعیت نا شناس",
      color: "#000000ff",
      percentage: 0,
    };
  }
};

export default OperationCard;
