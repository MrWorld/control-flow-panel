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

const AddUpdatePage = ({ addNew, formData }) => {
  const { checkPermission } = useCheckPermission();
  const details = useLocation().state;
  const theme = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"));
  const targetId = details?.id;
  const [position, setPosition] = useState(
    details?.latitude && details?.longitude
      ? { lat: details?.latitude, lng: details?.longitude }
      : null
  );
  const [positionError, setPositionError] = useState(false);
  const [phone, setPhone] = useState(details?.phone || "+965");
  const [enterances, setEnterances] = useState([]);
  const [readDetail, setRealDetail] = useState();
  const [branchPricingConfigs, setBranchPricingConfigs] = useState([]);
  const [tab, setTab] = useState("details");
  const [editorId, setEditorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settingLoading, setSettingLoading] = useState(false);
  const { id } = useParams();
  const positionValidator = () => {
    if (!position) return false;
    if (position.lat > 90 || position.lat < -90) return false;
    if (position.lng > 180 || position.lat < -180) return false;

    return true;
  };

  const onCreate = async (
    formData,
    resetForm,
    setErrors,
    setStatus,
    setSubmitting
  ) => {
    try {
      await adminService.addProduct(formData);
      toast("با موفقیت ساخته شد", "success");
      setSubmitting(false);
      resetForm();
      setStatus({ success: true });
      navigate(ROUTE_CONSTANTS.DASHBOARD.PRODUCTS.ROOT.ABSOLUTE, {
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
      await adminService.updateProduct(id, formData);
      toast("با موفقیت انجام شد", "success");
      setSubmitting(false);
      resetForm();
      setStatus({ success: true });
      navigate(ROUTE_CONSTANTS.DASHBOARD.PRODUCTS.ROOT.ABSOLUTE, {
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
      const response = await adminService.getProductDetail(id);
      setRealDetail(response.data.data.product);
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
            {addNew ? "ایجاد محصول جدید" : "ویرایش محصول"}
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
                  name: readDetail?.name || "",
                  barcode: readDetail?.barcode || "",
                  description: readDetail?.description || "",
                }}
                validationSchema={Yup.object().shape({
                  name: Yup.string().max(255).required("نام محصول اجباری است"),
                  barcode: Yup.string().max(255).required("بارکد اجباری است"),
                  description: Yup.string().required("توضیحات اجباری است"),
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
                          label={"نام محصول"}
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
                          error={Boolean(touched?.barcode && errors.barcode)}
                          fullWidth
                          helperText={touched?.barcode && errors.barcode}
                          label={"بارکد"}
                          name="barcode"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.barcode}
                          type="barcode"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <TextField
                          required
                          error={Boolean(
                            touched?.description && errors.description
                          )}
                          fullWidth
                          helperText={
                            touched?.description && errors.description
                          }
                          label={"توضیحات محصول"}
                          name="description"
                          multiline
                          rows={4}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.description}
                          variant="outlined"
                        />
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
