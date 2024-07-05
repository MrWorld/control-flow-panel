import {
  Link,
  CardContent,
  Avatar,
  Box,
  Typography,
  ListItemAvatar,
  Card,
  ListItemText,
  ListItem,
  styled,
  alpha
} from '@mui/material';

import AssessmentTwoToneIcon from '@mui/icons-material/AssessmentTwoTone';

const AvatarPrimary = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.primary.light};
      color: ${theme.palette.primary.contrastText};
      width: ${theme.spacing(5)};
      height: ${theme.spacing(5)};
      box-shadow: ${theme.colors.shadows.primary};
`
);

const CardContentWrapper = styled(CardContent)(
  ({ theme }) => `
     padding: ${theme.spacing(1, 2)};
     justify-content: center;
      display: flex;
      flex-direction: column;
      align-content: space-around;
      align-items: center;
      flex-wrap: nowrap;
`
);

const AvatarInfo = styled(Avatar)(
  ({ theme }) => `
		background-color: ${theme.colors.info.light};
		color: ${theme.palette.info.contrastText};
		width: ${theme.spacing(5)};
		height: ${theme.spacing(5)};
		box-shadow: ${theme.colors.shadows.info};
`);
const AvatarDanger = styled(Avatar)(
  ({ theme }) => `
		background-color: ${theme.colors.error.light};
		color: ${theme.palette.error.contrastText};
		width: ${theme.spacing(5)};
		height: ${theme.spacing(5)};
		box-shadow: ${theme.colors.shadows.error};
`);
const AvatarWarning = styled(Avatar)(
  ({ theme }) => `
		background-color: ${theme.colors.warning.light};
		color: ${theme.palette.warning.contrastText};
		width: ${theme.spacing(5)};
		height: ${theme.spacing(5)};
		box-shadow: ${theme.colors.shadows.warning};
`);
const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
		background-color: ${theme.colors.success.light};
		color: ${theme.palette.success.contrastText};
		width: ${theme.spacing(5)};
		height: ${theme.spacing(5)};
		box-shadow: ${theme.colors.shadows.success};
`);
const AvatarSecondary = styled(Avatar)(
  ({ theme }) => `
		background-color: ${theme.colors.secondary.light};
		color: ${theme.palette.secondary.contrastText};
		width: ${theme.spacing(5)};
		height: ${theme.spacing(5)};
		box-shadow: ${theme.colors.shadows.secondary};
`);

const CustomColored = styled(Avatar)(
  ({ theme, customColor }) => `
		background-color: ${customColor};
		color: ${theme.palette.secondary.contrastText};
		width: ${theme.spacing(5)};
		height: ${theme.spacing(5)};
		box-shadow: ${customColor};
`);

function Cards({ value, Icon, title, color = "primary" }) {
  let CustomAvatar = AvatarPrimary;
  switch (color) {
    case "success":
      CustomAvatar = AvatarSuccess;
      break;
    case "warning":
      CustomAvatar = AvatarWarning;
      break;
    case "danger":
      CustomAvatar = AvatarDanger;
      break;
    case "info":
      CustomAvatar = AvatarInfo;
      break;
    case "secondary":
      CustomAvatar = AvatarSecondary;
      break;
    default:
      CustomAvatar = CustomColored;
      break;
  }
  return (
    <Card sx={{background: alpha(color, 0.1)}}>
      <CardContentWrapper>
        <Typography variant="overline" fontWeight={700} color="text.primary">
          {title || ''}
        </Typography>

        <ListItem
          disableGutters
          sx={{
            my: 1
          }}
          component="div"
        >
          <ListItemAvatar>
            <CustomAvatar variant="rounded" customColor={color}>
              <Icon fontSize="medium" />
            </CustomAvatar>
          </ListItemAvatar>

          <ListItemText
            primary={value}
            
            primaryTypographyProps={{
              variant: 'h3',
              sx: {
                display: 'flex',
                ml: 1,
                textOverflow: 'unset',
                flexDirection: 'row-reverse',
              },
              noWrap: true
            }}
          />
        </ListItem>
      </CardContentWrapper>
    </Card>
  );
}

export default Cards;
