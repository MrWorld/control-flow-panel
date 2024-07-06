import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { adminService } from "src/api/services/admin";
import {
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  TextField,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Chip,
  alpha,
  Tooltip,
} from "@mui/material";
import * as moment from "moment";

import { Formik } from "formik";
import * as Yup from "yup";
import useToast from "src/hooks/useToast";

import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";
import { useCheckPermission } from "src/hooks/useCheckPermission";

import SuspenseLoader from "src/components/layouts/SuspenseLoader";
import { taskStatus } from "../constant/status";

const AddUpdatePage = ({ addNew, formData }) => {
  const { checkPermission } = useCheckPermission();
  const details = useLocation().state;
  const theme = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"));
  const [readDetail, setRealDetail] = useState();
  const [tab, setTab] = useState("details");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [manufactoringList, setManufactoringList] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [files, setFiles] = useState([]);

  const onCreate = async (
    formData,
    resetForm,
    setErrors,
    setStatus,
    setSubmitting
  ) => {
    try {
      await adminService.addTask(formData);
      toast("با موفقیت ساخته شد", "success");
      setSubmitting(false);
      resetForm();
      setStatus({ success: true });
      navigate(ROUTE_CONSTANTS.DASHBOARD.TASK.ROOT.ABSOLUTE, {
        replace: true,
      });
    } catch (err) {
      toast(err?.response?.data?.message || "خطایی رخ داده است", "error");
      setSubmitting(false);
      console.log(err);
    }
  };

  const onUpdate = async (
    formData,
    resetForm,
    setErrors,
    setStatus,
    setSubmitting
  ) => {
    try {
      await adminService.updateTask(id, formData);
      toast("با موفقیت انجام شد", "success");
      setSubmitting(false);
      resetForm();
      setStatus({ success: true });
      navigate(ROUTE_CONSTANTS.DASHBOARD.TASK.ROOT.ABSOLUTE, {
        replace: true,
      });
    } catch (err) {
      toast(err?.response?.data?.message || "خطای اینترنت!", "error");
      setSubmitting(false);
      console.log(err);
    }
  };

  const getDetail = async () => {
    try {
      console.log("here");
      setLoading(true);
      const response = await adminService.getTaskDetail(id);
      setRealDetail(response.data.data.task);
      setLoading(false);
    } catch (err) {
      toast("خطا در دریافت اطلاعات!", "error");
      console.log(err);
      setLoading(false);
    }
  };

  const getManufactoringList = async () => {
    try {
      const data = {
        page: 0,
        take: 10000,
      };
      const items = await adminService.getManufactorings(data);
      setManufactoringList(items.data.data.items);
    } catch (err) {
      toast("خطا در دریافت لیست دستور ساخت", "error");
    }
  };
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

  const changeSubTaskStatus = async (id, value) => {
    try {
      const data = {
        status: value,
      };

      await adminService.updateSubTaskStatus(id, data);
      getDetail();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getManufactoringList();
    getStations();
    if (!addNew) {
      getDetail();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Grid
        container
        padding={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {addNew ? "ایجاد وظیفه جدید" : "ویرایش وظیفه"}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        p={1}
        md={12}
        spacing={2}
        direction={!isMediumScreen ? "row" : "column"}
      >
        {loading ? (
          <SuspenseLoader />
        ) : tab == "details" ? (
          <Grid p={1} xs={12} sm={12} md={8} lg={6} xl={6} item>
            <Card style={{ padding: "25px" }}>
              <Formik
                initialValues={{
                  name: readDetail?.name || "",
                  quantity: readDetail?.quantity || 0,
                  manufacturingSchemaId:
                    readDetail?.manufacturingSchemaId || null,
                  stationId: readDetail?.stationId || null,
                }}
                validationSchema={Yup.object().shape({
                  name: Yup.string()
                    .max(255)
                    .required("نام دستور تولید اجباری است"),
                  quantity: Yup.number()
                    .min(1)
                    .max(255)
                    .required("تعداد اجباری است"),
                  manufacturingSchemaId: Yup.number().required(
                    "انتخاب دستور کار اجباری است"
                  ),
                  stationId: Yup.number().required(" انتخاب دستگاه اجباری است"),
                })}
                onSubmit={async (
                  _values,
                  { resetForm, setErrors, setStatus, setSubmitting }
                ) =>
                  addNew
                    ? onCreate(
                        _values,
                        resetForm,
                        setErrors,
                        setStatus,
                        setSubmitting
                      )
                    : onUpdate(
                        _values,
                        resetForm,
                        setErrors,
                        setStatus,
                        setSubmitting
                      )
                }
              >
                {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3} marginBottom={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          required
                          error={Boolean(touched?.name && errors.name)}
                          fullWidth
                          helperText={touched?.name && errors.name}
                          label={"نام وظیفه"}
                          name="name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.name}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          required
                          error={Boolean(touched?.quantity && errors.quantity)}
                          fullWidth
                          disabled={!addNew}
                          helperText={touched?.quantity && errors.quantity}
                          label={"تعداد"}
                          name="quantity"
                          type="number"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.quantity}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel id="manufacturingSchemaId">
                            دستور ساخت
                          </InputLabel>
                          <Select
                            required
                            disabled={!addNew}
                            fullWidth
                            id="manufacturingSchemaId"
                            labelId="manufacturingSchemaId"
                            value={values.manufacturingSchemaId}
                            label={"دستور ساخت"}
                            name="manufacturingSchemaId"
                            onChange={handleChange}
                            variant="outlined"
                          >
                            {manufactoringList.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel id="stationId">دستگاه</InputLabel>
                          <Select
                            required
                            disabled={!addNew}
                            fullWidth
                            id="stationId"
                            labelId="stationId"
                            value={values.stationId}
                            label={"دستگاه"}
                            name="stationId"
                            onChange={handleChange}
                            variant="outlined"
                          >
                            {stationList.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Divider />
                    <Grid
                      container
                      style={{ margin: "20px 0px" }}
                      direction={!is_small_screen ? "row" : "column-reverse"}
                      alignItems="center"
                    >
                      <Button color="secondary" onClick={() => navigate(-1)}>
                        {"کنسل"}
                      </Button>
                      <Button
                        type="submit"
                        startIcon={
                          isSubmitting ? <CircularProgress size="1rem" /> : null
                        }
                        disabled={Boolean(errors.submit) || isSubmitting}
                        variant="contained"
                        style={{ width: is_small_screen && "100%" }}
                      >
                        ذخیره
                      </Button>
                    </Grid>
                  </form>
                )}
              </Formik>
            </Card>
          </Grid>
        ) : (
          <></>
        )}
        <Grid item md={6} xs={12}>
          {!addNew ? (
            <>
              <Grid container spacing={2}>
                <Card sx={{ width: "100%", padding: 2 }}>
                  {readDetail?.TaskUnitManufacturing?.map((t, index) => {
                    return (
                      <Grid item xs={12} key={index}>
                        <Box
                          sx={{
                            width: "100%",
                            margin: 1,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography>شماره: {t.id}</Typography>
                          <Tooltip
                            title={
                              <>
                                <Card sx={{ width: "500px" }}>
                                  {t?.TaskUnitStatusHistory?.map((uhistory) => {
                                    return (
                                      <>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            width: "100%",
                                            p: 2,
                                          }}
                                        >
                                          <Typography sx={{ marginRight: 4 }}>
                                            توسط :{" "}
                                            {uhistory?.statusChangeBy?.username}
                                          </Typography>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexDirection: "row",
                                            }}
                                          >
                                            <Typography>از : </Typography>
                                            <Chip
                                              label={
                                                StatusMaker({
                                                  status: uhistory.fromStatus,
                                                }).name
                                              }
                                              style={{
                                                background: StatusMaker({
                                                  status: uhistory.fromStatus,
                                                }).color,
                                                color: "white",
                                              }}
                                            ></Chip>
                                          </Box>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexDirection: "row",
                                            }}
                                          >
                                            <Typography>به : </Typography>
                                            <Chip
                                              label={
                                                StatusMaker({
                                                  status: uhistory.toStatus,
                                                }).name
                                              }
                                              style={{
                                                background: StatusMaker({
                                                  status: uhistory.toStatus,
                                                }).color,
                                                color: "white",
                                              }}
                                            ></Chip>
                                          </Box>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexDirection: "row",
                                            }}
                                          >
                                            <Typography>در : </Typography>
                                            {moment(uhistory.createdAt).format(
                                              "YYYY-MM-DD HH:mm:ss"
                                            )}
                                          </Box>
                                        </Box>
                                      </>
                                    );
                                  })}
                                </Card>
                              </>
                            }
                            arrow
                          >
                            <Button>سابقه</Button>
                          </Tooltip>
                          <Chip
                            label={
                              `وضعیت فعلی‌: ` +
                              StatusMaker({ status: t.status }).name
                            }
                            style={{
                              background: StatusMaker({ status: t.status })
                                .color,
                              color: "white",
                            }}
                          ></Chip>
                          <Select
                            sx={{
                              minWidth: "200px",
                              background: alpha(
                                StatusMaker({ status: t.status }).color,
                                0.3
                              ),
                            }}
                            defaultValue={t.status}
                            onChange={(e) =>
                              changeSubTaskStatus(t.id, e.target.value)
                            }
                          >
                            {Object.entries(taskStatus).map(([k, v]) => {
                              return (
                                <MenuItem key={v.name} value={k}>
                                  {v.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </Box>
                      </Grid>
                    );
                  })}
                </Card>
              </Grid>
            </>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </>
  );
};

const StatusMaker = ({ status }) => {
  const find = taskStatus[`${status}`];
  if (find.name) {
    return find;
  } else {
    return {
      name: "وضعیت نا شناس",
      color: "#ffffff",
    };
  }
};

export default AddUpdatePage;
