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
  CardContent,
  CardHeader,
  Box,
  Input,
  Switch,
  Stack,
  List,
  Alert,
  Avatar,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
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
import {
  CheckCircleOutline,
  DeleteForeverOutlined,
  DownloadDoneOutlined,
  DownloadOutlined,
  UploadFileOutlined,
} from "@mui/icons-material";
import axios, { Axios } from "axios";
import { AxiosInstance } from "src/api";
import { getAuthorization } from "src/utils/getAuthorization";
import { baseURL } from "src/constants/apiBaseUrl";

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
  const [productList, setProductList] = useState([]);
  const [files, setFiles] = useState([]);

  const onCreate = async (
    formData,
    resetForm,
    setErrors,
    setStatus,
    setSubmitting
  ) => {
    try {
      if (files.length) {
        formData["medias"] = files;
      }

      await adminService.addManufactoring(formData);
      toast("با موفقیت ساخته شد", "success");
      setSubmitting(false);
      resetForm();
      setStatus({ success: true });
      navigate(ROUTE_CONSTANTS.DASHBOARD.MANUFACTORING.ROOT.ABSOLUTE, {
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
      if (files.length) {
        formData["medias"] = files;
      }
      await adminService.updateManufactoring(id, formData);
      toast("با موفقیت انجام شد", "success");
      setSubmitting(false);
      resetForm();
      setStatus({ success: true });
      navigate(ROUTE_CONSTANTS.DASHBOARD.MANUFACTORING.ROOT.ABSOLUTE, {
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
      const response = await adminService.getManufactoringDetail(id);
      setRealDetail(response.data.data.product);
      setLoading(false);
    } catch (err) {
      toast("خطا در دریافت اطلاعات!", "error");
      console.log(err);
      setLoading(false);
    }
  };

  const getProductList = async () => {
    try {
      const data = {
        page: 0,
        take: 10000,
      };
      const products = await adminService.getProducts(data);
      setProductList(products.data.data.items);
    } catch (err) {
      toast("خطا در دریافت لیست محصولات", "error");
    }
  };
  const handleAttachFile = (file) => {
    if (file.url && file.id) {
      const tmp = structuredClone(files);
      tmp.push({
        id: file.id,
        url: file.url,
      });
      setFiles(tmp);
    }
  };

  const unbindMedia = async (id) => {
    try {
      await adminService.unBindManufactoringMedia(id);
      getDetail();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProductList();
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
            {addNew ? "ایجاد دستور تولید جدید" : "ویرایش دستور تولید"}
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
                  productId: readDetail?.productId || null,
                }}
                validationSchema={Yup.object().shape({
                  name: Yup.string()
                    .max(255)
                    .required("نام دستور تولید اجباری است"),
                  barcode: Yup.string().max(255).required("بارکد اجباری است"),
                  description: Yup.string().required("توضیحات اجباری است"),
                  productId: Yup.number().required(
                    "انتخاب دستور تولید اجباری است"
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
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel id="productId">محصول</InputLabel>
                          <Select
                            required
                            disabled={!addNew}
                            fullWidth
                            id="productId"
                            labelId="productId"
                            value={values.productId}
                            label={"Car Manufacturer"}
                            name="productId"
                            onChange={handleChange}
                            variant="outlined"
                          >
                            {productList.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
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
                          label={"توضیحات تولید"}
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

        <Grid item>
          <UploadButton onUploadComplete={handleAttachFile} />
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h4">فایل های موجود</Typography>
            {!addNew ? (
              <>
                {readDetail?.Medias?.length ? (
                  <>
                    <List>
                      {readDetail?.Medias.map((md) => {
                        return (
                          <ListItem
                            sx={{
                              maxHeight: "80px",
                              width: "100%",
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                            key={md.id}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignContent: "center",
                              }}
                            >
                              {String(md?.url).endsWith(".png") ||
                              String(md?.url).endsWith(".jpg") ||
                              String(md?.url).endsWith(".jpeg") ? (
                                <img style={{ height: "50px" }} src={md.url} />
                              ) : (
                                <></>
                              )}
                              <Typography>
                                {md.orginalName || "no name"}
                              </Typography>
                            </Box>

                            <Box>
                              <a href={md.url} target="_blank" rel="noreferrer">
                                <Button variant="outlined">
                                  <DownloadOutlined /> دانلود
                                </Button>
                              </a>
                              <Button
                                sx={{ color: "red" }}
                                onClick={() => unbindMedia(md.id)}
                              >
                                <DeleteForeverOutlined />
                                حذف
                              </Button>
                            </Box>
                          </ListItem>
                        );
                      })}
                    </List>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        width: "100%",
                        p: 4,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="h2" sx={{ width: "100%" }}>
                        هیج فایلی یافت نشد! در صورت نیاز میتوانید فاید آپلود
                        کنید
                      </Typography>
                    </Box>
                  </>
                )}
              </>
            ) : (
              <></>
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

function UploadButton({ onUploadComplete }) {
  const [mediaLoading, setMediaLoading] = useState(false);
  const [process, setProcess] = useState(0);
  const toast = useToast();
  const theme = useTheme();
  const [fileList, setFileList] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(async (file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = async () => {
        //******** handle send image file to server after upload finished and wait till it give you an ID of the image
        const authorization = getAuthorization("token");
        const config = {
          onUploadProgress: function (e) {
            console.log(e);
            setProcess(Math.round((e.loaded * 100) / e.total));
          },
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: authorization,
          },
        };

        const imageFile = file;
        const imageURL = URL.createObjectURL(imageFile);
        const formData = new FormData();
        formData.set("file", imageFile);

        try {
          setMediaLoading(true);
          const res = await axios.post(baseURL + "media", formData, config);
          console.log(res);
          if (res?.data?.data?.url) {
            setFileList([...fileList, res.data.data.url]);
            onUploadComplete(res.data.data);
          }
          setMediaLoading(false);
        } catch (error) {
          console.log(error);
          setMediaLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const {
    acceptedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps,
  } = useDropzone({
    onDrop,
    accept: {
      "doc/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg"],
    },
  });
  const files = acceptedFiles.map((file, index) => (
    <ListItem disableGutters component="div" key={index}>
      <ListItemText primary={file.name} />
      <b>{file.size} bytes</b>
      <DividerContrast />
    </ListItem>
  ));
  const mediaList = fileList.map((file, index) => (
    <ListItem disableGutters component="div" key={index}>
      <img src={file} style={{ width: "100px" }} />
      <DividerContrast />
    </ListItem>
  ));
  return (
    <UploadBox>
      {mediaLoading ? <SuspenseLoader></SuspenseLoader> : <></>}
      <Typography variant="h4" gutterBottom>
        {"آپلود فایل"}
      </Typography>
      <Typography variant="body1">
        {"فایل دستور کار را در این قسمت آپلود کنید"}
      </Typography>

      <BoxUploadWrapper {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragAccept && (
          <>
            <AvatarSuccess variant="rounded">
              <CheckCircleOutline />
            </AvatarSuccess>
            <TypographyPrimary
              sx={{
                mt: 2,
              }}
            >
              {"Drop the files to start uploading"}
            </TypographyPrimary>
          </>
        )}
        {isDragReject && (
          <>
            <AvatarDanger variant="rounded">
              <CheckCircleOutline />
            </AvatarDanger>
            <TypographyPrimary
              sx={{
                mt: 2,
              }}
            >
              {"You cannot upload these file types"}
            </TypographyPrimary>
          </>
        )}
        {!isDragActive && (
          <>
            <AvatarWrapper variant="rounded">
              <CheckCircleOutline />
            </AvatarWrapper>
            <Typography
              sx={{
                mt: 2,
              }}
            >
              {"در اینجا فایل را انتخاب یا درگ کنید"}
            </Typography>
          </>
        )}
      </BoxUploadWrapper>
      {files.length > 0 && (
        <>
          <Alert
            sx={{
              py: 0,
              mt: 2,
            }}
            severity="success"
          >
            <b>{files.length}</b> {"فایل آپلود کردید"}!
          </Alert>
          <Divider
            sx={{
              mt: 2,
            }}
          />
          <List disablePadding component="div">
            {mediaList}
          </List>
        </>
      )}
    </UploadBox>
  );
}

const BoxUploadWrapper = styled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    padding: ${theme.spacing(2)};
    margin-top: ${theme.spacing(2)};
    background: rgba(1,1,1,0.2);
    border: 1px dashed gray;
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: ${theme.transitions.create(["border", "background"])};

    &:hover {
      background: ${theme.colors.alpha.trueWhite[5]};
      border-color: ${theme.colors.alpha.trueWhite[70]};
    }
`
);

const UploadBox = styled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    padding: ${theme.spacing(2)};
    background: ${theme.colors.alpha.trueWhite[10]};
`
);

const TypographyPrimary = styled(Typography)(
  ({ theme }) => `
    color: ${theme.colors.alpha.trueWhite[100]};
  `
);

const TypographySecondary = styled(Typography)(
  ({ theme }) => `
    color: ${theme.colors.alpha.trueWhite[70]};
  `
);

const DividerContrast = styled(Divider)(
  ({ theme }) => `
    background: ${theme.colors.alpha.trueWhite[10]};
  `
);

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.alpha.trueWhite[10]};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarDanger = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.error.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const BoxUpgrade = styled(Box)(
  ({ theme }) => `
    background: ${theme.colors.gradients.purple1};
    position: relative;
    border-radius: ${theme.general.borderRadius};
    
    img {
      position: absolute;
      top: 0;
      right: 0;
    }
`
);
export default AddUpdatePage;
