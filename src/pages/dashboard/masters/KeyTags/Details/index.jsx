import { useState, useCallback, useEffect } from 'react';

import PageTitleWrapper from '../../../../../components/PageTitleWrapper';

import { Grid, CircularProgress} from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';
import PageHeader from './components/PageHeader';
import Details from './components/Details';
import AttributeList from './components/AttributeList';
import { adminService } from '../../../../../api/services/admin';
import { useCheckPermission } from '../../../../../hooks/useCheckPermission';

const DetailsMain = () => {
  const { checkPermission } = useCheckPermission()
  const { id } = useParams()
  const [activeTab, setActiveTab] = useSearchParams({tab: 'Details'})
  const [data, setdata] = useState(null)
  const [loading, setLoading] = useState(false)

  const getDetail = useCallback(async () => {
    try {
      setLoading(true)
      const response = await adminService.getKeyTag(id);
      setdata(response.data.data);
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.error(err);
    }
  }, [id]);


  const renderBody = () => {
    switch (activeTab.get('tab')) {
      case 'Details':
        return data && <Details data={data} />
      case 'Attribute':
        return data && checkPermission('GET_VEHICLE_ATTRIBUTE_LIST') && <AttributeList vehicleId={data.id}/>
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
            <PageTitleWrapper>
              {data && <PageHeader data={data} activeTab={activeTab.get('tab')} setActiveTab={setActiveTab}/>}
            </PageTitleWrapper>
            <Grid
              sx={{
                px: 4
              }}
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={4}
            >
              <Grid item xs={12}>
                {renderBody()}
              </Grid>
            </Grid>
        </>
    );
}

export default DetailsMain;