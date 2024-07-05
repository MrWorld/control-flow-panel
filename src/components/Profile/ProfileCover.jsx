import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Card,
  Tooltip,
  Avatar,
  // CardMedia,
  IconButton,
  styled,
  CircularProgress
} from '@mui/material';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { useNavigate } from 'react-router-dom';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
// import CoverImage from 'src/assets/images/profile-cover.jpeg'
import { useImagePicker } from 'src/hooks/useImagePicker'
import useToast from 'src/hooks/useToast'
import { adminService } from 'src/api/services/admin';
import { errorMessage } from 'src/utils/errorTypeDetector'
import { useCheckPermission } from 'src/hooks/useCheckPermission'


const ProfileCover = ({ user }) => {
  const isOwnProfile = user.ownProfile
  const { checkPermission } = useCheckPermission()
  const {
    images,
    imagePickerRef,
    imageId,
    imagePickerLoading,
    handleSelectImage,
    handleSetImage,
    onDeleteImage
  } = useImagePicker()
  const { toast } = useToast()
  const navigate = useNavigate();
  const [selectedImageId, setSelectedImageId] = useState(null)


  const handleBack = () => {
    return navigate(-1);
  };

  const onSelectImage = e => {
    e.preventDefault()
    if (images.length >= 1) {
      handleDeleteImage(images[0].id)
      handleSelectImage(e.target.files[0])
    }
    else handleSelectImage(e.target.files[0])
  }

  const handleDeleteImage = id => {
    onDeleteImage(id)
    setSelectedImageId(null)
  }

  const updateProfileImage = async () => {
    if (!checkPermission('ADMIN:UPDATE')) return true;
    const data = { image: images[0]?.id }

    try {
      if (isOwnProfile) await adminService.updateProfileDetails(data)
      else await adminService.updateAdminDetails(user.id, data)
      toast('Profile image updated', 'success')
    } catch (error) {
      toast(errorMessage(error), 'error')
      console.log(error)
    }
  }

  useEffect(() => {
    if (selectedImageId) updateProfileImage()
  }, [selectedImageId])

  useEffect(() => {
    if (user.medias) handleSetImage(user.medias)
  }, [])

  useEffect(() => {
    //***** detect which api should call. either update admins or my own profile two api that give image ID. 

    if (imageId) setSelectedImageId(imageId)
  }, [imageId])

  return (
    <>
      <Box dir={'rtl'} display="flex" mb={3}>
        <Tooltip arrow placement="top" title={'Go back'}>
          <IconButton
            onClick={handleBack}
            color="primary"
            sx={{
              p: 2,
              mr: 2
            }}
          >
            <ArrowBackTwoToneIcon />
          </IconButton>
        </Tooltip>
        <Box dir={'rtl'} sx={{ p: 2 }}>
          <Typography variant="h3" component="h3" gutterBottom>
            {'Profile for'} {user.name}
          </Typography>
        </Box>
      </Box>
      {/* <CardCover>
        <CardMedia image={CoverImage} />
      </CardCover> */}
      <AvatarWrapper style={{ marginTop: '10px' }}>
        <Avatar variant="rounded" alt={user.name} src={images[0] && images[0].url} />
        {isOwnProfile ? true : checkPermission('ADMIN:UPDATE') &&
          <ButtonUploadWrapper onClick={() => imagePickerRef.current.click()}>
            <Input
              accept="image/*"
              onChange={e => onSelectImage(e)}
              multiple
              ref={imagePickerRef}
              // onClick={e => e.target.value = null} 
              type="file"
              style={{ display: 'none' }}
            />
            {/* <label htmlFor="icon-button-file">
              <IconButton component="span" color="primary">
                {imagePickerLoading ? <CircularProgress style={{ color: '#fff' }} size={'20px'} disableShrink thickness={3} /> : <UploadTwoToneIcon />}
              </IconButton>
            </label> */}
          </ButtonUploadWrapper>
        }
      </AvatarWrapper>
      <Box dir={'rtl'} py={2} pl={2} mb={3}>
        <Typography gutterBottom variant="h4">
          {user.name}
        </Typography>
        <Typography variant="subtitle2">{user.description}</Typography>
      </Box>
    </>
  );
};

ProfileCover.propTypes = {
  user: PropTypes.object.isRequired
};

export default ProfileCover;


const Input = styled('input')({
  display: 'none'
});

const AvatarWrapper = styled(Card)(
  ({ theme }) => `

    position: relative;
    overflow: visible;
    display: inline-block;
    margin-top: -${theme.spacing(9)};
    margin-left: ${theme.spacing(2)};

    .MuiAvatar-root {
      width: ${theme.spacing(16)};
      height: ${theme.spacing(16)};
    }
`
);

const ButtonUploadWrapper = styled(Box)(
  ({ theme }) => `
    position: absolute;
    width: ${theme.spacing(4)};
    height: ${theme.spacing(4)};
    bottom: -${theme.spacing(1)};
    right: -${theme.spacing(1)};

    .MuiIconButton-root {
      border-radius: 100%;
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      box-shadow: ${theme.colors.shadows.primary};
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      padding: 0;
  
      &:hover {
        background: ${theme.colors.primary.dark};
      }
    }د بریم یه هوا
`
);

// const CardCover = styled(Card)(
//   ({ theme }) => `
//     position: relative;

//     .MuiCardMedia-root {
//       height: ${theme.spacing(26)};
//     }
// `
// );