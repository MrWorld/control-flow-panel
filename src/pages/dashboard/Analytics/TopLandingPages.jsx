import {
  CardHeader,
  Divider,
  CardContent,
  Avatar,
  Box,
  CardActions,
  Button,
  Typography,
  ListItemAvatar,
  Card,
  ListItemText,
  List,
  ListItem,
  styled
} from '@mui/material';

import Label from 'src/components/Label';

const AvatarLight = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[10]};
      color:  ${theme.colors.alpha.black[100]};
      font-weight: ${theme.typography.fontWeightBold};
      font-size: ${theme.typography.pxToRem(15)};
`
);

function TopLandingPages() {

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardHeader title={'Top Landing Pages'} />
      <Divider />
      <CardContent>
        <List component="div" disablePadding>
          <ListItem
            sx={{
              display: { xs: 'block', sm: 'flex' }
            }}
            disableGutters
            alignItems="flex-start"
            component="div"
          >
            <ListItemAvatar>
              <AvatarLight>1</AvatarLight>
            </ListItemAvatar>

            <ListItemText
              primary="/templates/react/react-free/"
              primaryTypographyProps={{
                variant: 'h6',
                sx: {
                  mt: 1
                },
                gutterBottom: true,
                noWrap: true
              }}
              secondaryTypographyProps={{ variant: 'h3', noWrap: true }}
              secondary={
                <Box dir={'rtl'}
                  sx={{
                    mt: 1,
                    flexDirection: 'row',
                    display: 'flex'
                  }}
                >
                  <Box dir={'rtl'}
                    sx={{
                      mr: 5
                    }}
                  >
                    <Typography
                      component="div"
                      variant="body2"
                      gutterBottom
                      color="text.secondary"
                    >
                      {'Impressions'}
                    </Typography>
                    <Box dir={'rtl'} display="flex" alignItems="center">
                      <Typography
                        component="div"
                        variant="h3"
                        sx={{
                          mr: 1
                        }}
                      >
                        84.873
                      </Typography>
                      <Label color="success">34.76%</Label>
                    </Box>
                  </Box>
                  <Box dir={'rtl'}>
                    <Typography
                      component="div"
                      variant="body2"
                      gutterBottom
                      color="text.secondary"
                    >
                      {'Clicks'}
                    </Typography>
                    <Box dir={'rtl'} display="flex" alignItems="center">
                      <Typography
                        component="div"
                        variant="h3"
                        sx={{
                          mr: 1
                        }}
                      >
                        15.594
                      </Typography>
                      <Label color="success">28.75%</Label>
                    </Box>
                  </Box>
                </Box>
              }
            />
            <Box dir={'rtl'}
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              alignSelf="center"
            >
              <Button size="small" href="#">
                {'Visit URL'}
              </Button>
            </Box>
          </ListItem>
          <Divider
            sx={{
              my: 1
            }}
          />
          <ListItem
            sx={{
              display: { xs: 'block', sm: 'flex' }
            }}
            disableGutters
            alignItems="flex-start"
            component="div"
          >
            <ListItemAvatar>
              <AvatarLight>2</AvatarLight>
            </ListItemAvatar>

            <ListItemText
              primary="/templates/react/react-free/"
              primaryTypographyProps={{
                variant: 'h6',
                sx: {
                  mt: 1
                },
                gutterBottom: true,
                noWrap: true
              }}
              secondaryTypographyProps={{ variant: 'h3', noWrap: true }}
              secondary={
                <Box dir={'rtl'}
                  sx={{
                    mt: 1,
                    flexDirection: 'row',
                    display: 'flex'
                  }}
                >
                  <Box dir={'rtl'}
                    sx={{
                      mr: 5
                    }}
                  >
                    <Typography
                      component="div"
                      variant="body2"
                      gutterBottom
                      color="text.secondary"
                    >
                      {'Impressions'}
                    </Typography>
                    <Box dir={'rtl'} display="flex" alignItems="center">
                      <Typography
                        component="div"
                        variant="h3"
                        sx={{
                          mr: 1
                        }}
                      >
                        84.873
                      </Typography>
                      <Label color="success">34.76%</Label>
                    </Box>
                  </Box>
                  <Box dir={'rtl'}>
                    <Typography
                      component="div"
                      variant="body2"
                      gutterBottom
                      color="text.secondary"
                    >
                      {'Clicks'}
                    </Typography>
                    <Box dir={'rtl'} display="flex" alignItems="center">
                      <Typography
                        component="div"
                        variant="h3"
                        sx={{
                          mr: 1
                        }}
                      >
                        15.594
                      </Typography>
                      <Label color="success">28.75%</Label>
                    </Box>
                  </Box>
                </Box>
              }
            />
            <Box dir={'rtl'}
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              alignSelf="center"
            >
              <Button size="small" href="#">
                {'Visit URL'}
              </Button>
            </Box>
          </ListItem>
          <Divider
            sx={{
              my: 1
            }}
          />
          <ListItem
            sx={{
              display: { xs: 'block', sm: 'flex' }
            }}
            disableGutters
            alignItems="flex-start"
            component="div"
          >
            <ListItemAvatar>
              <AvatarLight>3</AvatarLight>
            </ListItemAvatar>

            <ListItemText
              primary="/templates/react/react-free/"
              primaryTypographyProps={{
                variant: 'h6',
                sx: {
                  mt: 1
                },
                gutterBottom: true,
                noWrap: true
              }}
              secondaryTypographyProps={{ variant: 'h3', noWrap: true }}
              secondary={
                <Box dir={'rtl'}
                  sx={{
                    mt: 1,
                    flexDirection: 'row',
                    display: 'flex'
                  }}
                >
                  <Box dir={'rtl'}
                    sx={{
                      mr: 5
                    }}
                  >
                    <Typography
                      component="div"
                      variant="body2"
                      gutterBottom
                      color="text.secondary"
                    >
                      {'Impressions'}
                    </Typography>
                    <Box dir={'rtl'} display="flex" alignItems="center">
                      <Typography
                        component="div"
                        variant="h3"
                        sx={{
                          mr: 1
                        }}
                      >
                        84.873
                      </Typography>
                      <Label color="success">34.76%</Label>
                    </Box>
                  </Box>
                  <Box dir={'rtl'}>
                    <Typography
                      component="div"
                      variant="body2"
                      gutterBottom
                      color="text.secondary"
                    >
                      {'Clicks'}
                    </Typography>
                    <Box dir={'rtl'} display="flex" alignItems="center">
                      <Typography
                        component="div"
                        variant="h3"
                        sx={{
                          mr: 1
                        }}
                      >
                        15.594
                      </Typography>
                      <Label color="success">28.75%</Label>
                    </Box>
                  </Box>
                </Box>
              }
            />
            <Box dir={'rtl'}
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              alignSelf="center"
            >
              <Button size="small" href="#">
                {'Visit URL'}
              </Button>
            </Box>
          </ListItem>
        </List>
      </CardContent>
      <Divider />
      <CardActions
        sx={{
          py: 2,
          height: '100%',
          flex: 1,
          justifyContent: 'center'
        }}
      >
        <Button size="small" variant="contained" color="primary">
          {'Advanced View'}
        </Button>
      </CardActions>
    </Card>
  );
}

export default TopLandingPages;
