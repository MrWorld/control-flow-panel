import { useNavigate } from 'react-router-dom';

import {
  Box,
  Grid,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';

const PageHeader = () => {
  const navigate = useNavigate();

  const handleBack = () => {  
    navigate(-1)
  }

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Box dir={'rtl'} display="flex" alignItems="center" justifyContent="space-between">
          <Tooltip arrow placement="top" title={'Go back'}>
            <IconButton
              onClick={handleBack}
              color="primary"
              sx={{
                p: 2,
                mr: 2
              }}
            >
              <ArrowBackTwoToneIcon />
            </IconButton>
          </Tooltip>
          <Box dir={'rtl'}>
            <Typography variant="h3" component="h3" gutterBottom>
              {}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default PageHeader;