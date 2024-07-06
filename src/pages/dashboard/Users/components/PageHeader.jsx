import { useNavigate } from "react-router-dom";
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";

import { Grid, Typography, Button } from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { useCheckPermission } from "src/hooks/useCheckPermission";

const PageHeader = ({ pageTitle, pageSubtitle, Icon }) => {
  const navigate = useNavigate();

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {pageTitle}
          </Typography>
          <Typography variant="subtitle2">{pageSubtitle}</Typography>
        </Grid>
        {
          <Grid item>
            <Button
              sx={{
                mt: { xs: 2, sm: 0 },
              }}
              onClick={() =>
                navigate(ROUTE_CONSTANTS.DASHBOARD.USER.ADD_NEW.ABSOLUTE)
              }
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
            >
              {"اضافه کردن"}
            </Button>
          </Grid>
        }
      </Grid>
    </>
  );
};

export default PageHeader;
