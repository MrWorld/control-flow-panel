import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Grid,
    Divider,
    Box,
    useTheme,
    styled
} from '@mui/material';
import Chart from 'react-apexcharts';

const DotLegend = styled('span')(
    ({ theme }) => `
      border-radius: 22px;
      width: ${theme.spacing(1.5)};
      height: ${theme.spacing(1.5)};
      display: inline-block;
      margin-right: ${theme.spacing(0.5)};
  `
);

function BookByCategory({month}) {
    const theme = useTheme();

    const sales = {
        datasets: [
            {
                backgroundColor: [
                    theme.palette.primary.main,
                    theme.palette.success.main,
                    theme.palette.warning.main,
                    theme.palette.info.main
                ]
            }
        ],
        labels: ['VIP Cash', 'VIP Knet', 'Subscription Cash', 'Subscription Knet', 'General Cash', 'General Knet']
    };

    const chartOptions = {
        chart: {
            background: 'transparent',
            stacked: false,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '55%'
                }
            }
        },
        colors: [
            theme.palette.primary.main,
            theme.palette.success.main,
            theme.palette.warning.main,
            theme.palette.info.main,
            theme.colors.alpha.black[50],
            theme.colors.alpha.black[10]
        ],
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val + '%';
            },
            dropShadow: {
                enabled: true,
                top: 1,
                left: 1,
                blur: 1,
                color: theme.colors.alpha.black[50],
                opacity: 0.5
            }
        },
        fill: {
            opacity: 1
        },
        labels: sales.labels,
        legend: {
            labels: {
                colors: theme.colors.alpha.trueWhite[100]
            },
            show: false
        },
        stroke: {
            width: 0
        },
        theme: {
            mode: theme.palette.mode
        }
    };

    const chartSeries = [15, 45, 25, 14, 1, 0];

    return (
        <Card>
            <CardHeader title={`Income ( ${month} )`} />
            <Divider />
            <CardContent>
                <Grid container spacing={3}>
                    <Grid
                        md={6}
                        item
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Chart
                            height={228}
                            options={chartOptions}
                            series={chartSeries}
                            type="donut"
                        />
                    </Grid>
                    <Grid md={6} item display="flex" alignItems="center">
                        <Box dir={'rtl'}>
                            {sales.labels.map((label, i) => (
                                <Typography
                                    key={label}
                                    variant="body2"
                                    sx={{
                                        py: 0.8,
                                        display: 'flex',
                                        alignItems: 'center',
                                        mr: 2
                                    }}
                                >
                                    <DotLegend
                                        style={{
                                            background: `${sales.datasets[0].backgroundColor[i]}`
                                        }}
                                    />
                                    <span
                                        style={{
                                            paddingRight: 10,
                                            color: `${sales.datasets[0].backgroundColor[i]}`
                                        }}
                                    >
                                        {chartSeries[i]}%
                                    </span>
                                    {label}
                                </Typography>
                            ))}
                        </Box>

                    </Grid>
                </Grid>
                <Box dir={'rtl'}
                    sx={{
                        height: 53
                    }}
                >
                </Box>
            </CardContent>
        </Card>
    );
}

export default BookByCategory;
