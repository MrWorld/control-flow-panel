import {
    Grid,
  } from '@mui/material';
import PersonalDetails from './PersonalDetails'
import RoleManagement from './RoleManagement'
import EmailManagement from './EmailManagement'
import BranchManagement from './BranchManagement';
import BookingManagement from './BookingsList';
import CustomerPersonalDetails from './CustomerPersonalDetails';
import BookingActivities from './BookingActivities';
  
  const Profile = ({user, handleRefreshData, isCustomer = false}) => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {!isCustomer ? <PersonalDetails user={user} handleRefreshData={handleRefreshData}/>: <CustomerPersonalDetails user={user} handleRefreshData={handleRefreshData} />}
        </Grid>
        {!isCustomer ? <><Grid item xs={12}>
          <RoleManagement user={user} handleRefreshData={handleRefreshData}/> 
        </Grid>
        <Grid item xs={12}>
          <BookingActivities user={user} handleRefreshData={handleRefreshData}/> 
        </Grid>
        <Grid item xs={12}>
          <BranchManagement user={user} handleRefreshData={handleRefreshData}/> 
        </Grid></> : <></>}
        {isCustomer ? <Grid item xs={12}>
          <BookingManagement user={user} handleRefreshData={handleRefreshData}/>
        </Grid> : <></>}
      </Grid>
    );
  }
  
  export default Profile;

  