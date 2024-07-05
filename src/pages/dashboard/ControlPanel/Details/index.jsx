import { useState, useCallback, useEffect } from 'react';


import { Grid, CircularProgress} from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';
import PageHeader from './components/PageHeader';
import Details from './components/Details';
import AttributeList from './components/AttributeList';
import { adminService } from '../../../../api/services/admin';
import { useCheckPermission } from '../../../../hooks/useCheckPermission';

const DetailsMain = ({payload, onUpdateHandle,closeMe}) => {
  const { checkPermission } = useCheckPermission()
  // const { id } = useParams()
  const [activeTab, setActiveTab] = useSearchParams({tab: 'Details'})
  const [data, setdata] = useState(null)
  const [loading, setLoading] = useState(false)

  const getDetail = useCallback(async () => {
    try {
      // setLoading(true)
      const response = await adminService.getKeyTag(payload?.Bookings[0]?.keyTagId);
      setdata(response.data.data);
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.error(err);
    }
  }, [payload]);


  const renderBody = () => {
    switch (activeTab.get('tab')) {
      case 'Details':
        return payload?.Bookings[0] && <Details data={payload} onUpdateHandle={onUpdateHandle} closeMe={closeMe}/>
      default:
        return null
    }
  }

  useEffect(() => {
    getDetail()
  }, [getDetail])

    return (
      loading
        ? <Grid container marginTop={20} justifyContent='center' alignItems='center'><CircularProgress /></Grid>
        : <>
            <Grid
              sx={{
                px: 0
              }}
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={0}
            >
              <Grid item xs={12}>
                {renderBody()}
              </Grid>
            </Grid>
        </>
    );
}

export default DetailsMain;