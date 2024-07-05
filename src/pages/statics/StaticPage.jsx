import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { adminService } from "src/api/services/admin";
import { Grid, Card, Typography, useMediaQuery, useTheme } from "@mui/material";
import useToast from "src/hooks/useToast";
import { errorMessage } from "src/utils/errorTypeDetector";

const StaticPage = () => {
  const { toast } = useToast();
  const location = useLocation();
  const parameters = location.pathname.split("/");
  const theme = useTheme();
  const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"));
  const staticPageType = parameters[parameters.length - 2];
  let language = parameters[parameters.length - 1];
  language = language.toUpperCase();

  const [html, setHtml] = useState({ __html: "" });
  const [title, setTitle] = useState("");

  const getData = async () => {
    try {
      let res = await adminService.getStaticPage(staticPageType, language);
      setTitle(res.data.data.title);
      setHtml({ __html: res.data.data.html });
    } catch (error) {
      toast(errorMessage(error), "error");
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <Grid container display="flex" justifyContent="center">
      <Grid
        item
        xl={10}
        lg={10}
        md={10}
        sm={12}
        xs={12}
        mt={is_small_screen ? 2 : 10}
        mr={is_small_screen ? 2 : 1}
        ml={is_small_screen ? 2 : 1}
      >
        <Typography variant="h3" textAlign={language === "AR" && "right"}>
          {title}
        </Typography>
        <Card
          style={{ marginTop: "1rem", minHeight: "200px", padding: "20px" }}
        >
          <div
            dangerouslySetInnerHTML={html}
            style={{
              direction: language === "AR" ? "rtl" : "ltr",
              unicodeBidi: "plaintext",
            }}
          />
        </Card>
      </Grid>
    </Grid>
  );
};
export default StaticPage;
