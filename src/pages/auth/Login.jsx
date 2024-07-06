import * as Yup from "yup";

import { Formik } from "formik";
import { Link as RouterLink, Navigate, useLocation } from "react-router-dom";
import { authService } from "src/api/services/auth";
import {
  useSetUser,
  useUser,
  useSetTokens,
  useSetPermission,
  useMenu,
} from "src/contexts/GlobalContext";
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";
import useToast from "src/hooks/useToast";
import Logo from "./components/Logo";

import {
  Box,
  Button,
  TextField,
  Link,
  CircularProgress,
  Typography,
} from "@mui/material";
import useRefMounted from "../../hooks/useRefMounted";

const Login = () => {
  const location = useLocation();
  const setUser = useSetUser();
  const setMenu = useMenu();
  const setPermission = useSetPermission();
  const setTokens = useSetTokens();
  const user = useUser();
  const { toast } = useToast();
  const isMountedRef = useRefMounted();

  if (user) {
    if (location.state?.previousPath)
      return <Navigate to={location.state.previousPath} replace />;
    //**** redirect user to path entered before login
    else
      return (
        <Navigate to={ROUTE_CONSTANTS.DASHBOARD.OPERATION.ABSOLUTE} replace />
      );
  }
  return (
    <Box
      dir={"rtl"}
      sx={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        dir={"rtl"}
        style={{
          maxWidth: "100%",
          width: 400,
        }}
      >
        <Logo />
        <Typography
          variant="h4"
          style={{ marginBottom: "20px", textAlign: "center" }}
        >
          ورود به پنل
        </Typography>
        <Formik
          initialValues={{
            username: "",
            password: "",
            submit: null,
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string()
              .max(255)
              .required("شماره کاربری اجباری است"),
            password: Yup.string()
              .min(6)
              .max(255)
              .required("رمز عبور اجباری است"),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              const res = await authService.login(
                values.username,
                values.password
              );
              console.log("login res", res);
              setTokens(
                res.data.data.access_token,
                res.data.data.refresh_token
              );
              setUser(res.data.data.user);
              //   toast("login success!", "success");
              //   if (isMountedRef.current) {
              //     setStatus({ success: true });
              //     setSubmitting(false);
              //   }
            } catch (err) {
              if (isMountedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
                toast(err.response.data.message, "error");
              }
            }
          }}
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
            <form noValidate onSubmit={handleSubmit}>
              <div dir="rtl">
                <TextField
                  error={Boolean(touched?.username && errors.username)}
                  fullWidth
                  margin="normal"
                  autoFocus
                  helperText={touched?.username && errors.username}
                  label={"شماره کاربری"}
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  variant="outlined"
                />
              </div>

              <TextField
                error={Boolean(touched?.password && errors.password)}
                fullWidth
                margin="normal"
                helperText={touched?.password && errors.password}
                label={"رمز عبور"}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
                variant="outlined"
              />

              <Button
                sx={{
                  mt: 3,
                }}
                color="primary"
                startIcon={
                  isSubmitting ? <CircularProgress size="1rem" /> : null
                }
                disabled={isSubmitting}
                type="submit"
                fullWidth
                size="large"
                variant="contained"
              >
                {"ورود"}
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Login;
