import { Tooltip, tooltipClasses, styled } from "@mui/material";
import { Link } from "react-router-dom";
import { ROUTE_CONSTANTS } from "src/constants/AppRoutes";
import { staticImages } from "src/assets/images";
import { useUser } from "src/contexts/GlobalContext";

function Logo({ title }) {
  const user = useUser();
  return (
    <TooltipWrapper title={title || "Control Flow Panel"} arrow>
      <LogoWrapper
        to={
          user?.userType == "ADMIN"
            ? ROUTE_CONSTANTS.DASHBOARD.OPERATION.ABSOLUTE
            : ROUTE_CONSTANTS.DASHBOARD.OPERATION.ABSOLUTE
        }
      >
        <StyledImage src={staticImages.appLogo} />
      </LogoWrapper>
    </TooltipWrapper>
  );
}

export default Logo;

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        display: flex;
        text-decoration: none;
        width: 53px;
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
    fontWeight: "bold",
    borderRadius: theme.general.borderRadiusSm,
    boxShadow:
      "0 .2rem .8rem rgba(7,9,25,.18), 0 .08rem .15rem rgba(7,9,25,.15)",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.colors.alpha.trueWhite[100],
  },
}));

const StyledImage = styled("img")(
  () => `
      width: 150px;
      height: 150px;
      object-fit: cover;
      border-radius: 9px
`
);
