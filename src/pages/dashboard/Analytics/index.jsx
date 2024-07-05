import Footer from "src/components/layouts/AccentSidebarLayout/Footer";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { Grid } from "@mui/material";

// import AudienceOverview from './AudienceOverview';
// import Conversions from './Conversions';
// import TopLandingPages from './TopLandingPages';
import PendingInvitations from "./Cards/PendingInvitations";
import BounceRate from "./Cards/BounceRate";
import ConversionsAlt from "./ConversionsAlt";
// import TrafficSources from './TrafficSources';
import PageHeader from "./PageHeader";
import { useReports, useSetReports } from "src/contexts/GlobalContext";
import { useEffect } from "react";
import useToast from "src/hooks/useToast";
import { ErrorMessage } from "formik";
import { adminService } from "src/api/services/admin";
import { useCheckPermission } from "src/hooks/useCheckPermission";
import TopLandingPages from "./TopLandingPages";
import AudienceOverview from "./AudienceOverview";
import TrafficSources from "./TrafficSources";
import Conversions from "./Cards/Conversions";
import Conversions2 from "./Cards/Conversions2";
import CarOnboarded from "./Cards/Cards";
import SmsIcon from '@mui/icons-material/Sms';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Cards from "./Cards/Cards";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import MoneyIcon from '@mui/icons-material/Money';
import PaymentIcon from '@mui/icons-material/Payment';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import StyleIcon from '@mui/icons-material/Style';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HourlyReports from "./Charts/HourlyReport";
import WeeklyReportVipVsGeneral from "./Charts/WeeklyReport";
import BookByCategory from "./Charts/ByCategory";
function DashboardAnalytics() {
  const { checkPermission } = useCheckPermission();
  const { toast } = useToast();
  const reports = useReports();
  const setReports = useSetReports();

  const reportCards = [
    {
      title: 'Available SMS',
      icon: SmsIcon,
      color: '#B4E16A',
      id: 'available_sms',
    },
    {
      title: 'Car Onboarded',
      icon: CarRepairIcon,
      color: '#5DAEE9',
      id: 'cars_onboard'
    },
    {
      title: 'Cars Check-In',
      icon: CheckBoxIcon,
      color: '#59D4BE',
      id: 'cars_in'
    },
    {
      title: 'Cars Check Out',
      icon: AssignmentTurnedInIcon,
      color: '#F4BC69',
      id: 'cars_out'
    },
    {
      title: 'Cash',
      icon: MoneyIcon,
      color: '#77D475',
      id: 'cash'
    },
    {
      title: 'Knet',
      icon: PaymentIcon,
      color: '#0872B9',
      id: 'knet'
    },
    {
      title: 'Unpaid',
      icon: MoneyOffIcon,
      color: '#F4856D',
      id: 'unpaid'
    },
    {
      title: 'Guest',
      icon: NoAccountsIcon,
      color: '#A6B0C8',
      id: 'guests'
    },
    {
      title: 'Validation',
      icon: VerifiedUserIcon,
      color: '#3D97EA',
      id: 'validation'
    },
    {
      title: 'Subscription',
      icon: LoyaltyIcon,
      color: '#8D6DE9',
      id: 'subscription'
    },
    {
      title: 'Voucher',
      icon: StyleIcon,
      color: '#FE72A5',
      id: 'voucher'
    },
    {
      title: 'Revenue',
      icon: MonetizationOnIcon,
      color: '#C19DD2',
      id: 'revenue'
    },
  ]

  const getReports = async () => {
    try {
      let res = await adminService.getReports();
      setReports(res.data.data);
    } catch (error) {
      toast(error.response.data.message, "error");
      console.log(error);
    }
  };

  useEffect(() => {
    // if (checkPermission) {
      // getReports(); //TODO : analytics reports are empty
    // }
  }, []);

  return (
    <>
      <Grid
        sx={{
          px: 4,
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
        style={{ marginBottom: 100 }}
        pt={2}
      >
        
        <Grid item lg={12} md={12} xs={12} >
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="center"
            alignItems="stretch"
          >
            {/* {
              reportCards.map((card, index) => {
                return <Grid item sm={12} xs={12} md={4} lg={3} xl={2} key={index}><Cards value={reports[card.id] || 0} Icon={card.icon} color={card.color} title={card.title} customColor={card.color}/></Grid>
              })
            } */}
          </Grid>
        </Grid>
        {/* <Grid  item lg={12} md={12} xs={12}>
          <HourlyReports />
        </Grid>
        <Grid  item lg={6} md={12} xs={12}>
          <WeeklyReportVipVsGeneral />
        </Grid>
        <Grid  item lg={6} md={12} xs={12}>
          <BookByCategory month={'October-2023'}/>
        </Grid>
        <Grid  item lg={6} md={12} xs={12}>
          <BookByCategory month={'September-2023'}/>
        </Grid>
        <Grid  item lg={6} md={12} xs={12}>
          <BookByCategory month={'August-2023'}/>
        </Grid>
        <Grid item xs={12}>
          <AudienceOverview />
        </Grid>
        <Grid item md={6} xs={12}>
          <Conversions />
        </Grid>
        <Grid item md={6} xs={12}>
          <Conversions2 />
        </Grid> */}
      </Grid>
    </>
  );
}

export default DashboardAnalytics;
