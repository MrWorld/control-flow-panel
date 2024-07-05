import {
    Divider,
    Box,
    Card,
    Typography,
    LinearProgress,
    alpha,
    Grid,
    Button,
    IconButton,
    styled,
    useTheme,
    linearProgressClasses
} from '@mui/material';

import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import CountUp from 'react-countup';
import Chart from 'react-apexcharts';
import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone';
import { useEffect, useState } from 'react';
import { adminService } from 'src/api/services/admin';
import useToast from 'src/hooks/useToast';

const LinearProgressError = styled(LinearProgress)(
    ({ theme }) => `
          height: 10px;
          border-radius: ${theme.general.borderRadiusLg};
  
          &.${linearProgressClasses.colorPrimary} {
              background-color: ${alpha(theme.colors.error.main, 0.1)};
          }
          
          & .${linearProgressClasses.bar} {
              border-radius: ${theme.general.borderRadiusLg};
              background-color: ${theme.colors.error.main};
          }
      `
);

const LinearProgressSuccess = styled(LinearProgress)(
    ({ theme }) => `
          height: 10px;
          border-radius: ${theme.general.borderRadiusLg};
  
          &.${linearProgressClasses.colorPrimary} {
              background-color: ${alpha(theme.colors.success.main, 0.1)};
          }
          
          & .${linearProgressClasses.bar} {
              border-radius: ${theme.general.borderRadiusLg};
              background-color: ${theme.colors.success.main};
          }
      `
);

const LinearProgressWarning = styled(LinearProgress)(
    ({ theme }) => `
          height: 10px;
          border-radius: ${theme.general.borderRadiusLg};
  
          &.${linearProgressClasses.colorPrimary} {
              background-color: ${alpha(theme.colors.warning.main, 0.1)};
          }
          
          & .${linearProgressClasses.bar} {
              border-radius: ${theme.general.borderRadiusLg};
              background-color: ${theme.colors.warning.main};
          }
      `
);

function HourlyReports() {
    const theme = useTheme();
    const [report, setReport] = useState(null)
    const {toast} = useToast()

    const gerReport = async() => {
        try {
            const response = await adminService.getHourlyGraph()
            console.log('hourly graph data',response)
        }catch(err) {
            toast(err.response.data.message)
        }
    }

    useEffect(() => {
        gerReport()
    }, [])

    const Box1Options = {
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
        colors: [theme.colors.warning.main],
        dataLabels: {
            enabled: false
        },
        theme: {
            mode: theme.palette.mode
        },
        fill: {
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.4,
                inverseColors: false,
                opacityFrom: 0.9,
                opacityTo: 0,
                stops: [0, 100]
            }
        },
        stroke: {
            show: true,
            colors: [theme.colors.warning.main],
            curve: 'smooth',
            width: 2
        },
        legend: {
            show: false
        },
        labels: [
            '00:00',
            '01:00',
            '02:00',
            '03:00',
            '04:00',
            '05:00',
            '06:00',
            '07:00',
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
            '20:00',
            '21:00',
            '22:00',
            '23:00',
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
    const Box1Data = [
        {
            name: 'Checked in',
            color: 'green',
            data: [32, 52, 45, 32, 54, 56, 28, 25, 36, 62, 56, 28, 25, 36, 62, 56, 28, 25, 36, 62, 56, 28, 25]
        },
        {
            name: 'Checked out',
            color: 'red',
            data: [9, 52, 45, 3, 54, 5, 33, 25, 1, 88, 8, 2, 25, 3, 6, 3, 28, 33, 12, 2, 6, 2, 100]
        }
    ];

    return (
        <Card>
            <Box dir={'rtl'}
                px={2}
                py={1.8}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Box dir={'rtl'}>
                    <Typography
                        gutterBottom
                        sx={{
                            fontSize: `${theme.typography.pxToRem(16)}`
                        }}
                        variant="h4"
                    >
                        {'Hourly Report'}
                    </Typography>
                    <Typography variant="subtitle2">
                        {'hourly check-in check-out'}
                    </Typography>
                </Box>
                <IconButton color="primary">
                    <MoreVertTwoToneIcon />
                </IconButton>
            </Box>
            <Divider />
            <Box dir={'rtl'} px={5} pt={4}>
                <Typography
                    component="h3"
                    fontWeight="bold"
                    sx={{
                        mb: 4,
                        fontSize: `${theme.typography.pxToRem(45)}`
                    }}
                >
                    <CountUp
                        start={0}
                        end={487.385}
                        duration={2}
                        separator=""
                        delay={1}
                        decimals={3}
                        decimal=","
                        prefix="KD "
                        suffix=""
                    />
                </Typography>

                <Grid container spacing={6}>
                    <Grid item xs={12} md={4} sm={6}>
                        <Typography variant="h3">14%</Typography>
                        <LinearProgressError
                            sx={{
                                my: 1
                            }}
                            variant="determinate"
                            value={12}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {'Generals'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} sm={6}>
                        <Typography variant="h3">46%</Typography>
                        <LinearProgressSuccess
                            sx={{
                                my: 1
                            }}
                            variant="determinate"
                            value={46}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {'Vips'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} sm={12}>
                        <Typography variant="h3">40%</Typography>
                        <LinearProgressWarning
                            sx={{
                                my: 1
                            }}
                            variant="determinate"
                            value={40}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {'Guests'}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <Chart options={Box1Options} series={Box1Data} type="area" height={221} />
            <Box dir={'rtl'}
                p={3}
                sx={{
                    textAlign: 'center'
                }}
            >
                <Button variant="outlined" endIcon={<ArrowForwardTwoToneIcon />}>
                    {'View complete report'}
                </Button>
            </Box>
        </Card>
    );
}

export default HourlyReports;
