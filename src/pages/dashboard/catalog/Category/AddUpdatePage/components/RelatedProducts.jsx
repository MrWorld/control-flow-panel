import React, { useState, useEffect } from 'react'
import {
    Box,
    Card,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableContainer,
    TableRow,
    Tooltip,
    IconButton,
    styled,
    TablePagination,
} from '@mui/material';
import { imageURLCombiner } from 'src/utils/imageUrlCombiner'
import { useCheckPermission } from 'src/hooks/useCheckPermission'
import { useNavigate } from 'react-router-dom';
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { staticImages } from 'src/assets/images'
import { adminService } from 'src/api/services/admin';

const RelatedProducts = ({ targetId, filterType }) => {
    const { checkPermission } = useCheckPermission()
    const navigate = useNavigate();
    const [listData, setListData] = useState([])
    const [, setLoading] = useState(false)
    const [page, setPage] = useState(0)
    const [take, setTake] = useState(10)
    const [totalCount, setTotalCount] = useState(0)

    const getMyList = async () => {
        let data = { take, page }
        let filter = {}
        filter[filterType] = targetId
        data['filter'] = filter

        try {
            const response = await adminService.getProductList(data)
            setLoading(false)
            setListData(response.data.data.items)
            setTotalCount(response.data.data.pagination.total)
        } catch (err) {
            setLoading(false)
            console.error(err);
        }
    };

    const handleChangePage = page => {
        if (page >= 0) setPage(page)
    }

    useEffect(() => {
        getMyList();
    }, [page, take]);


    const handlePageChange = (_event, newPage) => {
        handleChangePage(newPage);
    };

    const handleLimitChange = (event) => {
        setTake(parseInt(event.target.value));
    }

    return (
        <div style={{ marginTop: '30px' }}>
            <Typography variant='subtitle2' marginBottom='20px'>
                Related products
            </Typography>
            <Card style={{ padding: '25px' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{'Id'}</TableCell>
                                <TableCell>{'Photo'}</TableCell>
                                <TableCell>{'Name'}</TableCell>
                                <TableCell>{'Price'}</TableCell>
                                <TableCell>{'Active'}</TableCell>
                            </TableRow>
                        </TableHead>
                        {listData.length > 0
                            ? <TableBody>
                                {listData.map((data) => {
                                    return (
                                        <TableRow hover key={data.id}>
                                            <TableCell style={{ width: '30px' }}>
                                                <Box dir={'rtl'}>
                                                    <Tooltip title={'View'} arrow>
                                                        <IconButton
                                                            disabled={!checkPermission(null)}
                                                            onClick={() => navigate(ROUTE_CONSTANTS.DASHBOARD.CATALOG.PRODUCT.GET_BY_DATA(data?.id).ABSOLUTE, { state: data })}
                                                            // to={checkPermission(null) && ROUTE_CONSTANTS.DASHBOARD.LOGISTICS.VENDORS.GET_BY_DATA(data.vendorId).GET_BY_DATA(data.id).ABSOLUTE}
                                                            // to={ROUTE_CONSTANTS.DASHBOARD.STORE_FRONT.APP_HOME.UPDATE.ROOT.ABSOLUTE, {state: data}}
                                                            color="primary"
                                                        >
                                                            <Typography fontWeight='800'>{data.id}</Typography>
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <StyledImage alt={`category-${data?.name}-photo`} src={imageURLCombiner(data?.medias[0]?.url) || staticImages.sampleProduct} />
                                            </TableCell>
                                            <TableCell style={{ maxWidth: '150px' }}>
                                                <Box dir={'rtl'}>
                                                    <Typography fontWeight='800'>{data?.name}</Typography>
                                                    <Typography fontWeight='600'>{data?.nameAr}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box dir={'rtl'}>
                                                    <Typography fontWeight='800'>KD {data?.price}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {!data.isDisabled ? <CheckIcon color='success' /> : <CloseIcon color='error' />}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                            : <Typography variant='h5' mt={2}>No related product exist</Typography>
                        }
                    </Table>
                </TableContainer>
            </Card>
            <Card
                sx={{
                    p: 2,
                    mt: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Box dir={'rtl'}>
                    <Typography component="span" variant="subtitle1">
                        {'Showing'}
                    </Typography>{' '}
                    <b>{totalCount < take ? totalCount : take}</b> {'of'} <b>{totalCount}</b>{' '}
                    <b>{'Products'}</b>
                </Box>
                <TablePagination
                    component="div"
                    count={totalCount}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={take}
                    labelRowsPerPage=""
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </Card>
        </div>
    )
}
export default RelatedProducts

const StyledImage = styled('img')`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
`