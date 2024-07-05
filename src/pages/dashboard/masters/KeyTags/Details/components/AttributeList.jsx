import React, { useState, useEffect } from 'react'
import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableContainer,
    TableRow,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    TextField,
    Grid,
    Box,
    DialogTitle,
    Dialog,
    DialogContent,
    styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { attributeValueTypes } from '../constants'
import { adminService } from '../../../../../../api/services/admin';
import CustomButton from '../../../../../../components/CustomButton'
import { useCheckPermission } from '../../../../../../hooks/useCheckPermission';
import useToast from '../../../../../../hooks/useToast' 
import { errorMessage } from '../../../../../../utils/errorTypeDetector'

const AttributeList = ({ vehicleId }) => {
    const { toast } = useToast()
    const { checkPermission } = useCheckPermission()
    const [show, setShow] = useState(false)
    const [attributes, setAttributes] = useState([])

    const handleRefreshList = () => {
        setShow(false)
        getList()
    }

    const getList = async () => {
        try{
            let res = await adminService.getAttributes(vehicleId)
            setAttributes(res.data.data.items)
        }catch(error) {
            toast(errorMessage(error), 'error')
            console.log(error);
        }
    }

    useEffect(() => {
        getList()
    }, [])

    return (
        <>
            <Grid mb={3} container display='flex' justifyContent='flex-end'>
                <CustomButton
                    text='Add new'
                    onClick={() => setShow(true)}
                    disabled={!checkPermission('CREATE_VEHICLE_ATTRIBUTE')}
                />
            </Grid>
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{'Name'}</TableCell>
                                <TableCell>{'Name Arabic'}</TableCell>
                                <TableCell>{'Value Type'}</TableCell>
                                <TableCell>{'Value'}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{'Action'}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {attributes.map((attribute) =>
                                <CustomRow attribute={attribute} vehicleId={vehicleId} key={attribute.id} />
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <CreateNewAttribute show={show} onHide={() => setShow(false)} vehicleId={vehicleId} handleRefreshList={handleRefreshList}/>
            </Card>
        </>
    )
}

export default AttributeList

const CreateNewAttribute = ({ show, onHide, vehicleId, handleRefreshList }) => {
    return (
        <Dialog
            fullWidth
            maxWidth="md"
            open={show}
            onClose={onHide}
        >
            <DialogTitle style={{position: 'relative'}}>
                <Typography textAlign='center' variant='h4'>Create new attribute</Typography>
                <StyledCloseButton onClick={onHide}>
                    <CloseIcon color='#000' />
                </StyledCloseButton>
            </DialogTitle>
            <DialogContent style={{ padding: '10px', margin: '10px' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{'Name'}<span style={{color: 'red'}}>*</span></TableCell>
                                <TableCell>{'Name Arabic'}<span style={{color: 'red'}}>*</span></TableCell>
                                <TableCell>{'Value Type'}<span style={{color: 'red'}}>*</span></TableCell>
                                <TableCell>{'Value'}<span style={{color: 'red'}}>*</span></TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{'Action'}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <CustomRow vehicleId={vehicleId} handleRefreshList={handleRefreshList}/>
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
    )
}

const CustomRow = ({ attribute, vehicleId, handleRefreshList }) => {
    const { checkPermission } = useCheckPermission()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [, setErrors] = useState([])
    const [form, setForm] = useState({
        name: '',
        nameAr: '',
        valueType: '',
        value: ''
    })

    const handleChange = (e, formKey, boolean) => {
        let tempForm = { ...form }

        if (boolean) tempForm.value = !form.value
        else tempForm[formKey] = e.target.value

        setForm(tempForm)
    }

    const onChangeValueType = async e => {
        if (e.target.value === 'BOOLEAN') {
            handleChange(e, 'valueType')
            setForm(form => ({ ...form, value: false }))
        } else {
            handleChange(e, 'valueType')
            setForm(form => ({ ...form, value: '' }))
        }
    }

    const validateFields = () => {
        let tempErrors = []

        if(attribute) return true
        
        if(form.name === '') tempErrors.push('name')
        if(form.nameAr === '') tempErrors.push('nameAr')
        if(form.valueType === '') tempErrors.push('valueType')
        if(form.value === '') tempErrors.push('value')
        setErrors(tempErrors)
        
        return tempErrors.length <= 0
    }

    const handleSaveAttribute = async () => {
        if(!validateFields()) return 
        if(!checkPermission(attribute ? 'UPDATE_VEHICLE_ATTRIBUTE' : 'CREATE_VEHICLE_ATTRIBUTE')) return 
        
        try {
            const data = {
                name: form.name,
                nameAr: form.nameAr,
                value: form.value.toString(),
                valueType: form.valueType
            }
            setLoading(true)
            if(attribute) await adminService.updateAttribute(vehicleId, attribute.id, data)
            else {
                await adminService.createAttribute(vehicleId, data)
                handleRefreshList()
            } 
            setLoading(false)
            toast(`Attribute ${attribute ? 'Updated' : 'Created'} successfully!`, 'success')
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    const handleSetValuesOnLoad = () => {
        if (attribute.valueType === 'BOOLEAN') {
            let tempBoolean = false
            if (attribute.value === 'true') tempBoolean = true
            setForm({
                name: attribute.name,
                nameAr: attribute.nameAr,
                valueType: attribute.valueType,
                value: tempBoolean
            })
        }
        else setForm({
            name: attribute.name,
            nameAr: attribute.nameAr,
            valueType: attribute.valueType,
            value: attribute.value
        })
    }

    useEffect(() => {
        attribute && handleSetValuesOnLoad()
    }, [])

    const renderValueInput = () => {
        switch (form.valueType) {
            case 'BOOLEAN':
                return <Switch checked={form.value} onChange={() => handleChange("_", 'value', true)} color="primary" />
            case 'STRING':
                return <TextField value={form.value} onChange={e => handleChange(e, 'value')} />
            case 'NUMBER':
                return <TextField value={form.value} onChange={e => handleChange(e, 'value')} />
            default:
                return null;
        }
    }

    return (
        <>
            <TableRow hover>
                <TableCell>
                    <TextField onChange={e => handleChange(e, 'name')} value={form.name} />
                </TableCell>
                <TableCell>
                    <TextField onChange={e => handleChange(e, 'nameAr')} value={form.nameAr} />
                </TableCell>
                <TableCell>
                    <FormControl>
                        <InputLabel id="valueTypes">Types</InputLabel>
                        <Select
                            labelId="select-value-types"
                            id="select-gearbox"
                            value={form.valueType}
                            label={'valueTypes'}
                            style={{width: '130px'}}
                            name={form.valueType}
                            onChange={e => onChangeValueType(e)}
                            options={attributeValueTypes}
                        >
                            {
                                attributeValueTypes.map((gearbox, index) => <MenuItem key={index} value={gearbox}>{gearbox}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </TableCell>
                <TableCell>
                    {renderValueInput()}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                    <CustomButton
                        text='Save'
                        loading={loading}
                        disabled={ !checkPermission(attribute ? 'UPDATE_VEHICLE_ATTRIBUTE' : 'CREATE_VEHICLE_ATTRIBUTE') || loading}
                        style={{ width: '100px' }}
                        onClick={handleSaveAttribute}
                    />
                </TableCell>
            </TableRow>
        </>
    )
}

const StyledCloseButton = styled(Box)(
    () => `
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
  `
);