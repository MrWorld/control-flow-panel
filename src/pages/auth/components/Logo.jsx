import React from 'react'
import {
    Box,
    styled,
} from '@mui/material'
import { staticImages } from 'src/assets/images'


const Logo = ({ wrapperStyle, imageStyle }) => {
    return (
        <LogoWrapper style={{ ...wrapperStyle }}>
            <StyledImage style={{ ...imageStyle }} src={staticImages.appLogo} />
        </LogoWrapper>
    )
}
export default Logo

const LogoWrapper = styled(Box)(
    ({ theme }) => `
          color: ${theme.palette.text.primary};
          display: flex;
          text-decoration: none;
          justify-content:center;
          margin-bottom: 30px;
          font-weight: ${theme.typography.fontWeightBold};
  `
);

const StyledImage = styled('img')(
    () => `
        width: 300px;
        height: 300px;
        object-fit: cover;
        border-radius: 9px
  `
);