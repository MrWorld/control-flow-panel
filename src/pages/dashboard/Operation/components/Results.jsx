import React, { useEffect, useState } from "react";
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
  IconButton,
  Tooltip,
  Switch,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableSortLabel,
  Select,
  MenuItem,
  Grid,
  alpha,
} from "@mui/material";
import { useCheckPermission } from "src/hooks/useCheckPermission";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import DeleteTwoTone from "@mui/icons-material/DeleteTwoTone";
import { useNavigate } from "react-router-dom";
import { adminService } from "src/api/services/admin";
import useToast from "src/hooks/useToast";
import CustomButton from "src/components/CustomButton";
import { visuallyHidden } from "@mui/utils";
import OperationCard from "./OperationCards";
import { StationStatus, taskStatusWithPercentage } from "../constants";
import { Masonry } from "@mui/lab";

const Results = ({
  resultData,
  pagination,
  actions,
  orderBy,
  order,
  onRequestSort,
}) => {
  const { checkPermission } = useCheckPermission();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState(false);
  const [modalId, setModalId] = useState(null);
  const { toast } = useToast();
  const [stationList, setStationList] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stationDetail, setStationDetail] = useState();

  const getStations = async () => {
    try {
      const data = {
        page: 0,
        take: 10000,
      };
      const items = await adminService.getStations(data);
      setStationList(items.data.data.items);
    } catch (err) {
      toast("خطا در دریافت لیست دستگاه ها", "error");
    }
  };

  const getStationDetail = async (id) => {
    try {
      const items = await adminService.getStationDetail(id);
      setStationDetail(items.data.data);
    } catch (err) {
      toast("خطا در دریافت لیست دستگاه ها", "error");
    }
  };

  useEffect(() => {
    getStations();
  }, []);

  const changeStationStatus = async (status) => {
    const data = {
      status: status,
    };
    try {
      await adminService.updateStationStatus(stationDetail.id, data);
      getStationDetail(stationDetail.id);
    } catch (err) {
      toast("خطا در تغییر وضعیت دستگاه", "error");
    }
  };

  const handleChangeStation = (event) => {
    setSelectedStation(event.target.value);
    if (event.target.value) {
      getStationDetail(event.target.value);
    }
    actions.changeStation(parseInt(event.target.value));
  };
  const handleStationStatusChange = async (event) => {
    await changeStationStatus(event.target.value);
  };

  return (
    <>
      <Box
        dir={"rtl"}
        p={2}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography>دستگاه</Typography>
          <Select onChange={handleChangeStation} sx={{ width: "200px" }}>
            <MenuItem value={null} key={-1}>
              همه
            </MenuItem>
            {stationList.map((st) => {
              return (
                <MenuItem value={st.id} key={st.id}>
                  {st.name}
                </MenuItem>
              );
            })}
          </Select>
        </Box>
        {selectedStation ? (
          <Box>
            <Typography>تغییر وضعیت دستگاه</Typography>
            <Select
              sx={{
                width: "200px",
                background: alpha(
                  StatusMaker({ status: stationDetail?.status }).color,
                  0.3
                ),
              }}
              value={stationDetail?.status || ""}
              defaultValue={stationDetail?.status}
              onChange={handleStationStatusChange}
            >
              {Object.entries(StationStatus).map(([k, v]) => {
                return (
                  <MenuItem value={k} key={k}>
                    {v.name}
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
        ) : (
          <></>
        )}
      </Box>
      <Divider sx={{ mb: 2 }} />
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
            {"هیج رکوردی با مقادیر وارد شده وجود ندارد"}
          </Typography>
        </>
      ) : (
        <>
          <Masonry columns={5} spacing={2} padding={2}>
            {resultData.map((item, index) => {
              return (
                <>
                  <OperationCard data={item} />
                </>
              );
            })}
          </Masonry>
        </>
      )}
    </>
  );
};

const StatusMaker = ({ status }) => {
  const find = StationStatus[`${status}`];
  if (find?.name) {
    return find;
  } else {
    return {
      name: "وضعیت نا شناس",
      color: "#000000ff",
    };
  }
};

export default Results;
