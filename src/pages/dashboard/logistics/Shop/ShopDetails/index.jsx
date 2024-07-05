import { useState, useCallback, useEffect } from 'react';

import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid, CircularProgress } from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';
import PageHeader from './components/PageHeader';
import Details from './components/Details';
import ShopTiming from './components/ShopTiming';
import ShopAreas from './components/ShopAreas';
import { adminService } from 'src/api/services/admin';
import { useCheckPermission } from 'src/hooks/useCheckPermission';

const ShopDetails = () => {
    const { id } = useParams();
    const { checkPermission } = useCheckPermission()
    const [details, setDetails] = useState(null)
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useSearchParams({ tab: 'details' });

    const getData = useCallback(async () => {
        if (!checkPermission('GET_VENDOR_DETAIL')) return true;
        let response;

        try {
            response = await adminService.getVendorDetails(id)
            setDetails(response.data.data);
            setLoading(false)
        } catch (err) {
            setLoading(false)
            console.error(err);
        }
    }, [id]);

    useEffect(() => {
        getData()
    }, [getData])

    const renderBody = () => {
        switch (activeTab.get('tab')) {
            case 'details':
                return (
                    details && checkPermission('GET_VENDOR_DETAIL') && <Details data={details} />
                )
            case 'timing':
                return (
                    details && checkPermission('GET_VENDOR_TIMINGS') && <ShopTiming data={details} />
                )
            case 'areas':
                return (
                    details && checkPermission('GET_VENDOR_AREAS') && <ShopAreas data={details} />
                )
            default:
                return null
        }
    }

    return (
        loading
            ? <Grid container marginTop={20} justifyContent='center' alignItems='center'><CircularProgress /></Grid>
            : <>
                <PageTitleWrapper>
                    <PageHeader
                        data={details}
                        activeTab={activeTab.get('tab')}
                        changeActiveTab={currentTab => setActiveTab({ tab: currentTab.value })}
                    />
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

export default ShopDetails;
