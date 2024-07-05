import { useNavigate } from 'react-router-dom';
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'

import {
  Grid,
  Typography,
  Button,
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useCheckPermission } from 'src/hooks/useCheckPermission'
import ClientLogo from 'src/components/LogoSign/clientLogo';
import Logo from 'src/components/LogoSign';


const PageHeader = ({ pageTitle, pageSubtitle, Icon }) => {
  const { checkPermission } = useCheckPermission()
  const navigate = useNavigate();

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center" >
        <Grid item>
          <Logo />
          <Typography variant="subtitle2">
            {pageSubtitle}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}

export default PageHeader;