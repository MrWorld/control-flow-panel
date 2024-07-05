import {
  Tooltip,
  tooltipClasses,
  styled,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import { staticImages } from 'src/assets/images'


function ClientLogo() {

  return (
    <TooltipWrapper title={'Control Flow'} arrow>
      <LogoWrapper>
        <StyledImage src={staticImages.appLogo} />
      </LogoWrapper>
    </TooltipWrapper>
  );
}

export default ClientLogo;


const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        text-decoration: none;
        margin: 0 auto;
        font-weight: ${theme.typography.fontWeightBold};
`
);

const TooltipWrapper = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.colors.alpha.trueWhite[100],
    color: theme.palette.getContrastText(theme.colors.alpha.trueWhite[100]),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 'bold',
    borderRadius: theme.general.borderRadiusSm,
    boxShadow:
      '0 .2rem .8rem rgba(7,9,25,.18), 0 .08rem .15rem rgba(7,9,25,.15)'
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.colors.alpha.trueWhite[100]
  }
}));

const StyledImage = styled('img')(
  () => `
      width: 150px;
      height: 150px;
      object-fit: cover;
      border-radius: 9px
`
);
