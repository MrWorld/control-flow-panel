/* eslint-disable eqeqeq */
import React, { useState, useEffect, useCallback } from 'react'
import {
    Box,
    CircularProgress,
    styled,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableContainer,
    TableRow,
    Typography,
    TextField,
    Button
} from '@mui/material';
import { adminService } from 'src/api/services/admin';
import { emptyDaysBinder } from '../helper/emptyDaysBinder'
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import useToast from 'src/hooks/useToast'
import { errorMessage } from 'src/utils/errorTypeDetector';
import { useCheckPermission } from 'src/hooks/useCheckPermission';

const StockManagement = ({ data }) => {
    const { checkPermission } = useCheckPermission()
    const productId = data.id
    const [stocks, setStocks] = useState([])
    const [loading, setLoading] = useState(true)

    const getData = useCallback(async () => {
        if (!checkPermission('GET_INVENTORY_LIST')) return true;

        try {
            let res = await adminService.getProductStocks(productId)
            setLoading(false)
            handleInitiateStockList(res.data.data.items)
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }, [data.id])

    const handleInitiateStockList = items => {
        const manipulatedStocks = emptyDaysBinder(items)
        setStocks(manipulatedStocks)
    }

    useEffect(() => {
        getData()
    }, [])

    if (loading) return <Box dir={'rtl'} style={{ display: 'flex', justifyContent: 'center' }}><CircularProgress size='2rem' /></Box>

    return (
        <StyledStockWrapper>
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{'Date'}</TableCell>
                                <TableCell>{'Week day'}</TableCell>
                                <TableCell>{'stock number'}</TableCell>
                                <TableCell>{'Save'}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stocks.map((stockObj, index) => <CustomTableRow key={index} stockObj={stockObj} productId={productId} />)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </StyledStockWrapper>
    )
}

export default StockManagement

const CustomTableRow = ({ stockObj, productId }) => {
    const [unit, setUnit] = useState(stockObj.stock)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleSaveStocks = async () => {
        const data = {
            stocks: [
                {
                    date: stockObj.date,
                    stock: +unit
                }
            ]
        }
        try {
            setLoading(true)
            await adminService.initiateProductStocks(productId, data)
            toast('Stock unit updated!', 'success')
            setLoading(false)
        } catch (error) {
            toast(errorMessage(error), 'error')
            setLoading(false)
            console.log(error)
        }
    }

    return (
        <TableRow hover style={{ background: unit ? '#fff' : 'rgb(249 248 255)' }}>
            <TableCell>
                <Typography fontWeight='700' >{stockObj.date}</Typography>
            </TableCell>
            <TableCell>
                <Typography fontWeight='700' >{stockObj.weekDay}</Typography>
            </TableCell>
            <TableCell>
                <TextField
                    fullWidth
                    label={'Stock number'}
                    onChange={e => setUnit(e.target.value)}
                    value={unit}
                    type='number'
                    style={{ width: '250px' }}
                    InputProps={{ inputProps: { min: 0, step: "any" } }}
                />
            </TableCell>
            <TableCell>
                <Button
                    disabled={!unit || loading}
                    loading={loading}
                    onClick={handleSaveStocks}
                    variant="contained"
                    style={{ width: '150px' }}
                >
                    Save
                </Button>
            </TableCell>
        </TableRow>
    )
}

const StyledStockWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    padding-bottom: 50px;
    .add-button-wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
    }
`