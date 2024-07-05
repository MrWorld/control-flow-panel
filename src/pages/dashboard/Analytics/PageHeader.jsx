import { Grid, Typography, Avatar, useTheme } from '@mui/material';
import { useUser } from "src/contexts/GlobalContext";
import { format } from 'date-fns';

function PageHeader() {
  const user = useUser();
  const theme = useTheme();

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Avatar
          sx={{
            mr: 2,
            width: theme.spacing(8),
            height: theme.spacing(8)
          }}
          variant="rounded"
          alt={user.name}
          src={user.medias?.url}
        />
      </Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {'Welcome'}, {user.name}!
        </Typography>
        <Typography variant="subtitle2">
          {'These are your analytics stats for today'},{' '}
          <b>{format(new Date(), 'MMMM dd yyyy')}</b>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
