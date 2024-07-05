import { Fragment } from 'react';

import {
  Box,
  ListItemAvatar,
  ListItemText,
  Divider,
  List,
  Card,
  alpha,
  IconButton,
  Typography,
  styled,
  ListItem,
  useTheme
} from '@mui/material';

import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import InsertDriveFileTwoToneIcon from '@mui/icons-material/InsertDriveFileTwoTone';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import { DownloadDoneOutlined, DownloadOutlined } from '@mui/icons-material';

const DividerWrapper = styled(Divider)(
  ({ theme }) => `
    background: ${theme.colors.alpha.trueWhite[10]};
  `
);

const ListItemWrapper = styled(ListItem)(
  ({ theme }) => `
    padding: ${theme.spacing(1.5, 2)};
    background: ${theme.colors.alpha.trueWhite[10]};
    margin-bottom: ${theme.spacing(2)};
    border-radius: ${theme.general.borderRadiusSm};
    color: ${theme.colors.alpha.trueWhite[100]};
    box-shadow: 
        0 0.56875rem 3.3rem rgba(0,0,0, .05),
        0 0.9975rem 2.4rem rgba(0,0,0, .07),
        0 0.35rem 1rem rgba(0,0,0, .1),
        0 0.225rem 0.8rem rgba(0,0,0, .15);

    &:last-of-type {
        margin-bottom: 0;
    }
  `
);

function ImageListForPicker({images}) {
  const theme = useTheme();


  return (
    <Card
      sx={{
        background: `${theme.colors.gradients.black2}`,
        color: `${theme.colors.alpha.trueWhite[100]}`
      }}
    >
      <Box dir={'rtl'}
        sx={{
          height: 'auto'
        }}
      >
          <List
            sx={{
              p: 2
            }}
          >
            {images.map((item) => (
              <Fragment key={item?.id}>
                <ListItemWrapper
                  secondaryAction={
                    item?.url?.startsWith('https://') ?
                    <a href={item?.url} target="_blank" rel="noreferrer"><IconButton
                      size="small"
                      sx={{
                        alignSelf: 'center',
                        fontWeight: 'normal',
                        backgroundColor: `${alpha(
                          theme.colors.alpha.trueWhite[100],
                          0
                        )}`,
                        color: `${theme.colors.alpha.trueWhite[70]}`,

                        '&:hover': {
                          backgroundColor: `${alpha(
                            theme.colors.alpha.trueWhite[100],
                            0.2
                          )}`,
                          color: `${theme.colors.alpha.trueWhite[100]}`
                        }
                      }}
                    >
                      <DownloadOutlined />
                    </IconButton></a>: <></>
                  }
                >
                  <ListItemAvatar
                    sx={{
                      color: `${theme.colors.alpha.trueWhite[50]}`,
                      minWidth: 0,
                      mr: 2
                    }}
                  >
                    <InsertDriveFileTwoToneIcon fontSize="large" />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{
                      flexGrow: 0,
                      maxWidth: '50%',
                      flexBasis: '50%'
                    }}
                    disableTypography
                    primary={
                      <Typography
                        noWrap
                        gutterBottom
                        sx={{
                          color: `${theme.colors.alpha.trueWhite[100]}`
                        }}
                        variant="h4"
                      >
                        {item?.url?.split('/')[item?.url.split('/')?.length -1]}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          sx={{
                            color: `${theme.colors.alpha.trueWhite[70]}`
                          }}
                          variant="body1"
                        >
                          type: {(item?.url?.split('.')[item?.url.split('.')?.length -1]) || 'unknown'}
                        </Typography>
                      </>
                    }
                  />
                </ListItemWrapper>
              </Fragment>
            ))}
          </List>
      </Box>
    </Card>
  );
}

export default ImageListForPicker;
