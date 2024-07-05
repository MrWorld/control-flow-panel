import { useState, useCallback, useEffect } from 'react';

import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, CircularProgress } from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';
import PageHeader from './components/PageHeader';
import Details from './components/Details';
import StockManagement from './components/StockManagement';
import { adminService } from 'src/api/services/admin';
import { useCheckPermission } from 'src/hooks/useCheckPermission';

const ProductDetails = () => {
    const { checkPermission } = useCheckPermission()
    const { id } = useParams()
    const [activeTab, setActiveTab] = useSearchParams({ tab: 'Details' })
    const [details, setDetails] = useState(null)
    const [loading, setLoading] = useState(false)

    const getData = useCallback(async () => {
        if (!checkPermission('GET_PRODUCT_DETAIL')) return true;
        let response;

        try {
            response = await adminService.getProductDetails(id)
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
            case 'Details':
                return details && checkPermission('GET_PRODUCT_DETAIL') && <Details data={details} />
            case 'Stocks':
                return details && checkPermission('GET_INVENTORY_LIST') && <StockManagement data={details} />
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
                        setActiveTab={setActiveTab}
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

export default ProductDetails;
