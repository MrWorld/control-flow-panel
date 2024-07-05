import React, { useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { adminService } from "src/api/services/admin";
import {
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  TextField,
  Divider,
  Button,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
  CardContent,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { makeStyles } from "@mui/styles";
import { Formik } from "formik";
import * as Yup from "yup";
import useToast from "src/hooks/useToast";
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";
import { useCheckPermission } from "src/hooks/useCheckPermission";
import { errorMessage } from "src/utils/errorTypeDetector";

const CouponForms = () => {
  const { checkPermission } = useCheckPermission();
  const classes = useStyles();
  const theme = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [codeType, setCodeType] = useState("singleCode");
  const [fWhenEver, setFWhenEver] = useState(false);
  const [tWhenEver, setTWhenEver] = useState(false);
  const [orderType, setOrderType] = useState("AllOrders");
  const [limitCode, setLimitCode] = useState(false);
  const [limitUser, setLimitUser] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"));

  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const onCreate = async (
    formData,
    resetForm,
    setErrors,
    setStatus,
    setSubmitting
  ) => {
    if (!checkPermission("CREATE_COUPON")) return true;
    if (formData.fromDateWhenever) delete formData.fromDate;
    if (formData.toDateWhenever) delete formData.toDate;
    if (formData.multiCreate) delete formData.code;
    if (formData.code) delete formData.multiCreate;
    if (formData.userLimitUnlimited) delete formData.userLimit;
    if (formData.limitCountUnlimited) delete formData.limitCount;
    try {
      if (formData.multiCreate) {
        const res = await adminService.createCoupon(formData);
        const codes = res.data.data.created.map((item) => {
          return item.code + "\n";
        });
        var dataStr =
          "data:text/json;charset=utf-8," +
          encodeURIComponent(`${codes}`.replaceAll(",", ""));
        var dlAnchorElem = document.getElementById("downloadAnchorElem");
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "coupons.txt");
        dlAnchorElem.click();
      } else {
        await adminService.createCoupon(formData);
      }
      toast("Address type create successful!", "success");
      setSubmitting(false);
      resetForm();
      setStatus({ success: true });
      navigate({
        pathname: ROUTE_CONSTANTS.DASHBOARD.LOGISTICS.COUPON.ROOT.ABSOLUTE,
        search: `?${createSearchParams({ id: formData.vendorId })}`,
      });
    } catch (error) {
      toast(errorMessage(error),'error');
    }
  };
  const generateCode = async (setter) => {
    setCodeLoading(true);
    try {
      let res = await adminService.getRandomCode();
      setter("code", res?.data?.data);
      setCodeLoading(false);
    } catch (err) {
      setCodeLoading(false);
      toast(errorMessage(err), "error");
    }
  };
  const handleChangeCodeType = (e) => {
    setCodeType(e.target.value);
  };
  const handleChangeFrom = (setFieldValue) => {
    setFWhenEver((prev) => !prev);
    setFieldValue("fromDateWhenever", !fWhenEver);
  };
  const handleChangeTo = (setFieldValue) => {
    setTWhenEver((prev) => !prev);
    setFieldValue("toDateWhenever", !tWhenEver);
  };
  const handleChangeLimitCount = (setFieldValue) => {
    setLimitCode((prev) => !prev);
    setFieldValue("limitCountUnlimited", !limitCode);
  };
  const handleChangeUserLimit = (setFieldValue) => {
    setLimitUser((prev) => !prev);
    setFieldValue("userLimitUnlimited", !limitUser);
  };

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
            Add new Coupon
          </Typography>
        </Grid>
        <a id="downloadAnchorElem" style={{ display: "none" }}></a>
      </Grid>
      <Grid
        container
        p={2}
        direction={!isMediumScreen ? "row" : "column-reverse"}
      >
        <Grid xs={12} sm={12} md={10} lg={9} xl={10} item>
          <Typography variant="subtitle2" marginBottom="20px">
            {"Fill out form below to create coupon"}
          </Typography>
          <Card style={{ padding: "25px" }}>
            <Formik
              initialValues={{
                code: "",
                fromDateWhenever: false,
                toDateWhenever: false,
                userLimitUnlimited: false,
                limitCountUnlimited: false,
                firstOrder: false,
                minOrder: 0,
                multiCreate: 0,
                amount: "",
                type: "",
                fromDate: "",
                toDate: "",
                limitCount: 1,
                userLimit: 1,
              }}
              validationSchema={Yup.object().shape(
                {
                  amount: Yup.number().when("type", {
                    is: (type) => type === "PERCENTAGE",
                    then: Yup.number()
                      .required()
                      .min(1, "must be more than 0")
                      .max(100, "you can choose percentage between 1 till 100"),
                    otherwise: Yup.number()
                      .required("the amount field is required")
                      .min(1, "must be more than 0")
                      .positive(),
                  }),
                  limitCount:
                    limitCode === "UNLIMITED"
                      ? Yup.number().positive('only use posotive numbers.').required("the limit field is required")
                      : Yup.number().positive('only use posotive numbers.').required("the limit field is required"),
                  userLimit:
                    limitUser === "UNLIMITED"
                      ? Yup.number().positive('only use posotive numbers.').required("the limit field is required")
                      : Yup.number().positive('only use posotive numbers.').required("the limit field is required"),
                  code: Yup.string().when("multiCreate", {
                    is: (multiCreate) => multiCreate > 0,
                    then: Yup.string(),
                    otherwise: Yup.string().required(
                      "the code field is required"
                    ),
                  }),
                  multiCreate: Yup.number().when("code", {
                    is: (code) => code && code.length > 0,
                    then: Yup.number(),
                    otherwise: Yup.number()
                      .min(1)
                      .required("the limit field is required"),
                  }),
                  type: Yup.string().required("the type field is required"),
                  fromDate: Yup.string().when("fromDateWhenever", {
                    is: (fromDateWhenever) => fromDateWhenever === true,
                    then: Yup.string(),
                    otherwise: Yup.string().required(
                      "the fromDate feild is required"
                    ),
                  }),
                  toDate: Yup.string().when("toDateWhenever", {
                    is: (toDateWhenever) => toDateWhenever === true,
                    then: Yup.string(),
                    otherwise: Yup.string().required(
                      "the toDate feild is required"
                    ),
                  }),
                  minOrder: Yup.number().required(
                    "the limit field is required"
                  ),
                },
                [["code", "multiCreate"]]
              )}
              onSubmit={async (
                _values,
                { resetForm, setErrors, setStatus, setSubmitting }
              ) =>
                onCreate(
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
                setFieldValue,
              }) => (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3} marginBottom={2} marginTop={1}>
                    <Grid xs={12} alignContent="center" ml={3}>
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6} xl={6} lg={6}>
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <Card className={classes.codeCard}>
                                    <FormControlLabel
                                      checked={codeType === "singleCode"}
                                      value="singleCode"
                                      control={<Radio />}
                                      label="Single Code"
                                      onChange={handleChangeCodeType}
                                    />
                                    <CardContent>
                                      Keep in mind that you still can create
                                      codes with multiple usage limits in one
                                      single code.
                                    </CardContent>
                                  </Card>
                                </Grid>
                                {codeType === "singleCode" && (
                                  <>
                                    <Grid xs={8} item>
                                      <TextField
                                        error={Boolean(
                                          touched?.code && errors.code
                                        )}
                                        fullWidth
                                        helperText={
                                          touched?.code && errors.code
                                        }
                                        label={"Code"}
                                        name="code"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.code}
                                        variant="outlined"
                                      />
                                    </Grid>
                                    <Grid
                                      xs={4}
                                      item
                                      display="flex"
                                      flexDirection="row"
                                      alignItems="center"
                                      style={{ paddingLeft: "0" }}
                                    >
                                      <Button
                                        className={classes.whenever}
                                        startIcon={
                                          codeLoading ? (
                                            <CircularProgress size="1rem" />
                                          ) : null
                                        }
                                        onClick={() =>
                                          generateCode(setFieldValue)
                                        }
                                        type="button"
                                        variant="contained"
                                      >
                                        Random Code
                                      </Button>
                                    </Grid>
                                  </>
                                )}
                              </Grid>
                            </Grid>
                            <Grid item xs={12} md={6} xl={6} lg={6}>
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <Card className={classes.codeCard}>
                                    <FormControlLabel
                                      checked={codeType === "MultipleCodes"}
                                      value="MultipleCodes"
                                      control={<Radio />}
                                      label="Multiple Codes"
                                      onChange={handleChangeCodeType}
                                    />
                                    <CardContent>
                                      You will receive a txt file, containing
                                      all the random codes generated one in a
                                      new line.
                                    </CardContent>
                                  </Card>
                                </Grid>
                                {codeType === "MultipleCodes" && (
                                  <Grid item xs={12}>
                                    <TextField
                                      type="number"
                                      error={Boolean(
                                        touched?.multiCreate &&
                                          errors.multiCreate
                                      )}
                                      fullWidth
                                      helperText={
                                        touched?.multiCreate &&
                                        errors.multiCreate
                                      }
                                      label={"multi create"}
                                      name="multiCreate"
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      value={values.multiCreate}
                                      variant="outlined"
                                    />
                                  </Grid>
                                )}
                              </Grid>
                            </Grid>
                          </Grid>
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <FormControl
                            fullWidth
                            style={{ width: "100%", marginRight: "10px" }}
                          >
                            <InputLabel id="select-type-label">
                              Select Type
                            </InputLabel>
                            <Select
                              error={Boolean(touched?.type && errors.type)}
                              labelId="select-type-label"
                              id="select-type"
                              defaultValue="PERCENTAGE"
                              value={values.type}
                              label="Select type"
                              name="type"
                              onChange={(e) =>
                                setFieldValue("type", e.target.value)
                              }
                            >
                              <MenuItem key="AMOUNT" value="AMOUNT">
                                Amount
                              </MenuItem>
                              <MenuItem key="PERCENTAGE" value="PERCENTAGE">
                                Percentage
                              </MenuItem>
                            </Select>
                            {touched?.type && errors?.type && (
                              <FormHelperText className={classes.hinter}>
                                {errors?.type}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            type="number"
                            error={Boolean(touched?.amount && errors.amount)}
                            fullWidth
                            helperText={touched?.amount && errors.amount}
                            label={"Amount"}
                            name="amount"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.amount}
                            variant="outlined"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  {values?.type === "PERCENTAGE" ? "%" : ""}
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Grid container>
                        <Grid item xs={9}>
                          {!fWhenEver ? (
                            <DatePicker
                              className={classes.datePicker}
                              label="Select From Date"
                              name="fromDate"
                              minDate={new Date()}
                              maxDate={
                                values?.toDate && new Date(values?.toDate)
                              }
                              value={values.fromDate}
                              onChange={(newValue) => {
                                setFieldValue(
                                  "fromDate",
                                  formatDate(newValue.$d)
                                );
                              }}
                              format="yyyy-MM-dd"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  error={Boolean(
                                    touched?.fromDate && errors.fromDate
                                  )}
                                  helperText={
                                    touched?.fromDate && errors.fromDate
                                  }
                                />
                              )}
                            />
                          ) : (
                            <Typography className={classes.unlimited}>
                              WHENEVER
                            </Typography>
                          )}
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                        >
                          <Button
                            className={classes.whenever}
                            onClick={() => handleChangeFrom(setFieldValue)}
                            type="button"
                            variant="contained"
                          >
                            WHENEVER
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Grid container>
                        <Grid item xs={9}>
                          {!tWhenEver ? (
                            <DatePicker
                              className={classes.datePicker}
                              label="Select To Date"
                              name="toDate"
                              value={values.toDate}
                              minDate={
                                values?.fromDate
                                  ? new Date(values?.fromDate)
                                  : new Date()
                              }
                              onChange={(newValue) => {
                                setFieldValue(
                                  "toDate",
                                  formatDate(newValue.$d)
                                );
                              }}
                              format="yyyy-MM-dd"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  error={Boolean(
                                    touched?.toDate && errors.toDate
                                  )}
                                  helperText={touched?.toDate && errors.toDate}
                                />
                              )}
                            />
                          ) : (
                            <Typography className={classes.unlimited}>
                              WHENEVER
                            </Typography>
                          )}
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                        >
                          <Button
                            className={classes.whenever}
                            onClick={() => handleChangeTo(setFieldValue)}
                            type="button"
                            variant="contained"
                          >
                            WHENEVER
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Grid container>
                        <Grid item xs={9}>
                          {!limitCode ? (
                            <TextField
                              disabled={limitCode}
                              type="number"
                              error={Boolean(
                                touched?.limitCount && errors.limitCount
                              )}
                              fullWidth
                              helperText={
                                touched?.limitCount && errors.limitCount
                              }
                              label={"Use Limit (Per Code)"}
                              name="limitCount"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.limitCount}
                              variant="outlined"
                            />
                          ) : (
                            <Typography className={classes.unlimited}>
                              UNLIMITED
                            </Typography>
                          )}
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                        >
                          <Button
                            variant="contained"
                            className={classes.whenever}
                            onClick={() =>
                              handleChangeLimitCount(setFieldValue)
                            }
                          >
                            UnLimited
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Grid container>
                        <Grid item xs={9}>
                          {!limitUser ? (
                            <TextField
                              type="number"
                              error={Boolean(
                                touched?.userLimit && errors.userLimit
                              )}
                              fullWidth
                              helperText={
                                touched?.userLimit && errors.userLimit
                              }
                              label={"Use Limit (Per User)"}
                              name="userLimit"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.userLimit}
                              variant="outlined"
                            />
                          ) : (
                            <Typography className={classes.unlimited}>
                              UNLIMITED
                            </Typography>
                          )}
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                        >
                          <Button
                            variant="contained"
                            className={classes.whenever}
                            onClick={() => handleChangeUserLimit(setFieldValue)}
                          >
                            UnLimited
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        type="number"
                        error={Boolean(touched?.minOrder && errors.minOrder)}
                        fullWidth
                        helperText={touched?.minOrder && errors.minOrder}
                        label={"Minimum Order Amount"}
                        name="minOrder"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.minOrder}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Typography variant="body2">Order</Typography>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setOrderType("AllOrders");
                          setFieldValue("firstOrder", false);
                        }}
                        style={{ marginRight: "5px" }}
                      >
                        {orderType === "AllOrders"
                          ? "✓All Orders"
                          : "All Orders"}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setOrderType("FirstOrders");
                          setFieldValue("firstOrder", true);
                        }}
                      >
                        {orderType === "FirstOrders"
                          ? "✓First Orders"
                          : "First Orders"}
                      </Button>
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
                      {"Cancel"}
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
                      Save
                    </Button>
                  </Grid>
                </form>
              )}
            </Formik>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

const useStyles = makeStyles({
  boxContainer: {},
  datePicker: {
    width: "100%",
    borderTopRightRadius: "0 !important",
    borderBottomRightRadius: "0 !important",
  },
  hinter: {
    color: "red !important",
  },
  codeCard: {
    boxShadow: "0 2px 4px rgb(126 142 177 / 12%) !important",
    padding: "10px !important",
    border: "1px solid #d3e0e9 !important",
  },
  whenever: {
    marginLeft: "3px !important",
    padding: "13px !important",
    width: "100% !important",
    fontSize: "13px !important",
  },
  unlimited: {
    border: "1px solid rgba(0, 0, 0, 0.23) !important",
    height: "inherit !important",
    padding: "15px 14px",
    borderRadius: "10px",
  },
});

export default CouponForms;
