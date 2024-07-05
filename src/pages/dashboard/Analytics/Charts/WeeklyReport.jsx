import {
    Box,
    Card,
    CardHeader,
    Typography,
    Button,
    alpha,
    Divider,
    Avatar,
    useTheme,
  } from '@mui/material';
  
  import Chart from 'react-apexcharts';
  import Text from 'src/components/Text';
  import EmojiObjectsTwoToneIcon from '@mui/icons-material/EmojiObjectsTwoTone';
  import ArrowUpwardTwoToneIcon from '@mui/icons-material/ArrowUpwardTwoTone';
  
  function WeeklyReportVipVsGeneral() {
    const theme = useTheme();
  
  
    const Box2Options = {
      chart: {
        background: 'transparent',
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        },
        zoom: {
          enabled: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 5,
          columnWidth: '50%'
        }
      },
      colors: [theme.colors.primary.main, theme.colors.error.light],
      dataLabels: {
        enabled: false
      },
      theme: {
        mode: theme.palette.mode
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      legend: {
        show: false
      },
      labels: [
        'Week 1',
        'Week 2',
        'Week 3',
        'Week 4',
        'Week 5',
        'Week 6',
        'Week 7',
      ],
      xaxis: {
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        show: false,
        min: 0
      }
    };
    const Box2Data = [
      {
        name: 'General',
        data: [150, 334, 55, 222, 140, 231, 211]
      },
      {
        name: 'Vip',
        data: [11, 30, 55, 33, 82, 91, 12]
      }
    ];
  
    return (
      <Card>
        <CardHeader
          sx={{
            p: 2
          }}
          titleTypographyProps={{
            component: 'h4',
            variant: 'h3'
          }}
        //   action={
        //     // <Button size="small" variant="text">
        //     //   {'View all'}
        //     // </Button>
        //   }
          title={'Top sellers'}
        />
        <Divider />
        <Box dir={'rtl'}
          sx={{
            background: `${alpha(theme.colors.alpha.black[10], 0.05)}`
          }}
        >
          <Box dir={'rtl'}
            p={3}
            display="flex"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Box dir={'rtl'}>
              <Typography
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontSize: `${theme.typography.pxToRem(12)}`
                }}
                component="h6"
                variant="caption"
              >
                {'This week'}
              </Typography>
              <Typography
                gutterBottom
                sx={{
                  py: 0.5
                }}
                variant="h2"
              >
                KD 8,489
              </Typography>
              <Box dir={'rtl'} display="flex" alignItems="center">
                <Text flex color="success">
                  <ArrowUpwardTwoToneIcon fontSize="small" />
                </Text>
                <Typography
                  sx={{
                    pl: 0.2
                  }}
                  variant="subtitle2"
                >
                  <Text color="success">15.4%</Text> {'increase this week'}
                </Typography>
              </Box>
            </Box>
            {/* <Avatar
              sx={{
                width: 54,
                height: 54,
                background: `${theme.colors.alpha.white[100]}`,
                color: `${theme.colors.primary.main}`
              }}
            >
              <EmojiObjectsTwoToneIcon />
            </Avatar> */}
          </Box>
          <Box dir={'rtl'} px={2}>
            <Chart
              options={Box2Options}
              series={Box2Data}
              type="bar"
              height={148}
            />
          </Box>
        </Box>
      </Card>
    );
  }
  
  export default WeeklyReportVipVsGeneral;
  