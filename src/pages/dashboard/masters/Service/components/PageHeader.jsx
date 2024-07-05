import { useNavigate } from 'react-router-dom';
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'

import {
  Grid,
  Typography,
  Button,
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useCheckPermission } from 'src/hooks/useCheckPermission'


const PageHeader = ({ pageTitle, pageSubtitle, Icon }) => {
  const { checkPermission } = useCheckPermission()
  const navigate = useNavigate();

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center" >
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {pageTitle}
          </Typography>
          <Typography variant="subtitle2">
            {pageSubtitle}
          </Typography>
        </Grid>
        {checkPermission('SERVICE:CREATE') && //NEED_PERMISSION_KEY
          <Grid item>
            <Button
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              onClick={() => navigate(ROUTE_CONSTANTS.DASHBOARD.MASTERS.SERVICE.ADD_NEW.ROOT.ABSOLUTE)}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
            >
              {'Create'}
            </Button>
          </Grid>
        }
      </Grid>
    </>
  );
}

export default PageHeader;