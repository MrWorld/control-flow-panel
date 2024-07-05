
import {
  Typography,
  Box,
  styled,
} from '@mui/material';

const FeaturedText = ({title, text, suffix, wrapperStyle, textStyle}) => {
    return (
      <StyledFeatureBox style={{...wrapperStyle}}>
        <Typography variant='caption'>{title}</Typography>
        <Typography style={{...textStyle}} display='flex' alignItems='center' marginTop='10px' variant='h5'>{text || '---'} {suffix}</Typography>
      </StyledFeatureBox>
    )
}
export default FeaturedText

const StyledFeatureBox = styled(Box)(
    () => `
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 150px;
        margin-top: 30px
  `
);