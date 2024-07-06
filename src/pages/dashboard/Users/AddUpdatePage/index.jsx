import React, { useEffect, useState } from "react";
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
  CardContent,
  CardHeader,
  Box,
  Input,
  Switch,
  Stack,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import useToast from "src/hooks/useToast";
import CustomButton from "src/components/CustomButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";
import { useCheckPermission } from "src/hooks/useCheckPermission";
import { MuiTelInput } from "mui-tel-input";
import styled from "@emotion/styled";
import SuspenseLoader from "src/components/layouts/SuspenseLoader";
import { UserType } from "../constants";

const AddUpdatePage = ({ addNew, formData }) => {
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

  const onCreate = async (
    formData,
    resetForm,
    setErrors,
    setStatus,
    setSubmitting
  ) => {
    try {
      await adminService.addUser(formData);
      toast("با موفقیت ساخته شد", "success");
      setSubmitting(false);
      resetForm();
      setStatus({ success: true });
      navigate(ROUTE_CONSTANTS.DASHBOARD.USER.ROOT.ABSOLUTE, {
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
      await adminService.updateUser(id, formData);
      toast("با موفقیت انجام شد", "success");
      setSubmitting(false);
      resetForm();
      setStatus({ success: true });
      navigate(ROUTE_CONSTANTS.DASHBOARD.USER.ROOT.ABSOLUTE, {
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
      const response = await adminService.getUserDetail(id);
      setRealDetail(response.data.data.user);
      setLoading(false);
    } catch (err) {
      toast("خطا در دریافت اطلاعات!", "error");
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
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
            {addNew ? "ایجاد کاربر جدید" : "ویرایش کاربر"}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        p={1}
        md={12}
        direction={!isMediumScreen ? "row" : "column"}
      >
        {loading ? (
          <SuspenseLoader />
        ) : tab == "details" ? (
          <Grid p={1} xs={12} sm={12} md={8} lg={6} xl={6} item>
            <Card style={{ padding: "25px" }}>
              <Formik
                initialValues={{
                  username: readDetail?.username || "",
                  password: readDetail?.password || "",
                  firstName: readDetail?.firstName || "",
                  lastName: readDetail?.lastName || "",
                  userType: readDetail?.userType || null,
                }}
                validationSchema={Yup.object().shape({
                  firstName: Yup.string().max(255).required("نام اجباری است"),
                  lastName: Yup.string()
                    .max(255)
                    .required("نام خانوادگی اجباری است"),
                  username: Yup.string().required("شماره کاربری اجباری است"),
                  userType: Yup.string().required("سطح دسترسی اجباری است"),
                  password: Yup.string()
                    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
                    .required("رمز عبور اجباری است"),
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
                          error={Boolean(touched?.username && errors.username)}
                          fullWidth
                          helperText={touched?.username && errors.username}
                          label={"شماره کاربری"}
                          name="username"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.username}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          required
                          type={"password"}
                          error={Boolean(touched?.password && errors.password)}
                          fullWidth
                          helperText={touched?.password && errors.password}
                          label={"رمز عبور"}
                          name="password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.password}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          required
                          error={Boolean(
                            touched?.firstName && errors.firstName
                          )}
                          fullWidth
                          helperText={touched?.firstName && errors.firstName}
                          label={"نام"}
                          name="firstName"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.firstName}
                          type="firstName"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          required
                          error={Boolean(touched?.lastName && errors.lastName)}
                          fullWidth
                          helperText={touched?.lastName && errors.lastName}
                          label={"نام خانوادگی"}
                          name="lastName"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.lastName}
                          type="lastName"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel id="userType">سطح دسترسی</InputLabel>
                          <Select
                            required
                            fullWidth
                            id="userType"
                            labelId="userType"
                            value={values.userType}
                            label={"سطح دسترسی"}
                            name="userType"
                            onChange={handleChange}
                            variant="outlined"
                          >
                            {Object.entries(UserType).map(([k, v]) => (
                              <MenuItem key={k} value={k}>
                                {v.name}
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
      </Grid>
    </>
  );
};

export default AddUpdatePage;
