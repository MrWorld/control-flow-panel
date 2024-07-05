import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import useToast from "src/hooks/useToast";
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";
import { useCheckPermission } from "src/hooks/useCheckPermission";

const AddUpdatePage = ({ addNew }) => {
  const { checkPermission } = useCheckPermission();
  const details = useLocation().state;
  const theme = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"));
  const targetId = details?.id;
  const [carManufacturers, setCarManufacturers] = useState([]);

  const onCreate = async (
    formData,
    resetForm,
    setErrors,
    setStatus,
    setSubmitting
  ) => {
    if (!checkPermission("CAR_MODEL:CREATE")) return true;
    try {
      await adminService.addCarModel(formData);
      toast("Car Model create successful!", "success");
      setSubmitting(false);
      resetForm();
      setStatus({ success: true });
      navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.CAR_MODEL.ROOT.ABSOLUTE, {
        replace: true,
      });
    } catch (err) {
      toast(err?.response?.data?.message || "Network Error!", "error");
      // toast('err in Creating Car Model!', 'err')
      setSubmitting(false);
      console.log(err);
    }
  };

  const getCareManufacturers = async () => {
    try {
      const response = await adminService.getCarManufacturers({
        page: 1,
        take: 10000,
      });
      setCarManufacturers(response.data.data);
    } catch (err) {
      toast(err?.response?.data?.message || "Network Error!", "error");
      // toast('Error on get car manufacturers', 'error')
      console.log(err);
    }
  };

  useEffect(() => {
    getCareManufacturers();
  }, []);

  const onUpdate = async (
    formData,
    resetForm,
    setErrors,
    setStatus,
    setSubmitting
  ) => {
    if (!checkPermission("CAR_MODEL:UPDATE")) return true;
    try {
      await adminService.updateCarModel(targetId, formData);
      toast("Car Model update successful!", "success");
      setSubmitting(false);
      resetForm();
      setStatus({ success: true });
      navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.CAR_MODEL.ROOT.ABSOLUTE, {
        replace: true,
      });
    } catch (err) {
      toast(err?.response?.data?.message || "Network Error!", "error");
      // toast('Error in updating Car Model!', 'error')
      setSubmitting(false);
      console.log(err);
    }
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
            {addNew ? "Add new Car Model" : "Update Car Model"}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        p={2}
        direction={!isMediumScreen ? "row" : "column-reverse"}
      >
        <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
          <Typography variant="subtitle2" marginBottom="20px">
            {addNew
              ? "Fill out form below to add your Car Model"
              : "Fill out form below to update your Car Model"}
          </Typography>
          <Card style={{ padding: "25px" }}>
            <Formik
              initialValues={{
                name: details?.name || "",
                description: details?.description || "",
                vehicleManufacturerId: details?.vehicleManufacturer?.id || "",
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string()
                  .max(255)
                  .required("The name field is required"),
                description: Yup.string().optional(),
                vehicleManufacturerId: Yup.number().required(
                  "Car Manufacturer field is required"
                ),
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
                      <FormControl fullWidth>
                        <InputLabel id="vehicleManufacturerId">
                          Manufacturer
                        </InputLabel>
                        <Select
                          fullWidth
                          id="vehicleManufacturerId"
                          labelId="vehicleManufacturerId"
                          value={values.vehicleManufacturerId}
                          label={"Car Manufacturer"}
                          name="vehicleManufacturerId"
                          onChange={handleChange}
                          variant="outlined"
                        >
                          {carManufacturers.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        error={Boolean(touched?.name && errors.name)}
                        fullWidth
                        helperText={touched?.name && errors.name}
                        label={"Name"}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        error={Boolean(
                          touched?.description && errors.description
                        )}
                        fullWidth
                        helperText={touched?.description && errors.description}
                        label={"Description"}
                        name="description"
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

export default AddUpdatePage;
