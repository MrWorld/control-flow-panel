import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Typography,
  styled,
  Switch
} from '@mui/material';
import { imageURLCombiner } from 'src/utils/imageUrlCombiner'
import { staticImages } from 'src/assets/images'
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import { adminService } from 'src/api/services/admin';
import useToast from 'src/hooks/useToast'
import { useCheckPermission } from 'src/hooks/useCheckPermission'
import EditButton from 'src/components/EditButton'
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';

const ItemCard = ({ data, itemPartitions }) => {
  const { checkPermission } = useCheckPermission()
  const { toast } = useToast()
  const navigate = useNavigate();

  const [isItemDisabled, setIsItemDisabled] = useState(data.isDisabled)
  const [, setLoading] = useState(false)

  const handleToggle = async () => {
    if (!checkPermission('TOGGLE_PRODUCT')) return  //NEED_PERMISSION_KEY toggle address type
    const tempData = {
      isDisabled: !isItemDisabled
    }

    try {
      setLoading(true)
      await adminService.productToggle(data.id, tempData)
      toast(`${data.name.toUpperCase()} ${isItemDisabled ? 'Activate' : 'Deactivate'} successful!`, 'success')
      setIsItemDisabled(toggle => !toggle)
      setLoading(false)
    } catch (error) {
      toast(`Error happened in toggle class`, 'error')
      console.log(error);
      setLoading(false)
    }
  }

  const onDetailClick = () => {
    if (!checkPermission('GET_PRODUCT_DETAIL')) return  //NEED_PERMISSION_KEY edit address type

    navigate(ROUTE_CONSTANTS.DASHBOARD.CATALOG.PRODUCT.GET_BY_DATA(data?.id).ABSOLUTE, { state: data })
  }

  return (
    <CardWrapper>
      {itemPartitions?.image &&
        <Box dir={'rtl'} className='image-wrapper'>
          {data.medias
            ? <img className='image' alt={'product-image'} src={imageURLCombiner(data.medias[0]?.url)} />
            : <img className='image' alt={'product-sample-image'} src={staticImages.sampleProduct} />
          }
        </Box>
      }
      <Box dir={'rtl'} className='body'>
        <Typography className='name'>{data.name}</Typography>
        <Typography className='price'>KD {data.price}</Typography>
      </Box>
      <Box dir={'rtl'} className='footer'>
        <EditButton
          onClick={onDetailClick}
          size={30}
          disabled={!checkPermission('UPDATE_PRODUCT')} //NEED_PERMISSION_KEY update address type
        >
          <LaunchTwoToneIcon style={{ color: '#fff', fontSize: '17px' }} />
        </EditButton>
        {itemPartitions?.toggle &&
          <Switch
            checked={!isItemDisabled}
            onChange={e => handleToggle(e)}
            inputProps={{ 'aria-label': 'controlled' }}
            disabled={!checkPermission('TOGGLE_PRODUCT')} //NEED_PERMISSION_KEY toggle address type
          />
        }
      </Box>
    </CardWrapper>
  )
}

export default ItemCard

const CardWrapper = styled(Card)(
  () => `
      min-height: 100px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: visible;
      .image-wrapper{
        width: 100%;
        padding: 5px;
        .image{
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 9px
         }
      }
      .body{
        width: 100%;
        padding: 10px 7px 10px 7px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .name{
          font-size: 14px;
          font-weight: 700;
        };
        .price{
          font-size: 11px;
          font-weight: 600;
          margin-top: 10px;
        };
      };
      .footer{
        width: 100%;
        padding: 8px;
        display: flex;
        flex-diredcton: row;
        justify-content: space-between;
        align-items: center;
      }
    `
);