
import {
    Typography,
    Box,
    styled,
} from '@mui/material';

const GridedFeaturedText = ({ title, text, prefix, suffix, wrapperStyle, textStyle }) => {
    return (
        <StyledFeatureBox style={{ ...wrapperStyle }}>
            <Typography variant='caption'>{title}</Typography>
            <Typography style={{ ...textStyle }} display='flex' alignItems='center' variant='h5'>{prefix} {text || '---'} {suffix}</Typography>
        </StyledFeatureBox>
    )
}
export default GridedFeaturedText

const StyledFeatureBox = styled(Box)(
    () => `
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;
          margin: 10px 0px;
          padding: 0 10px;
    `
);