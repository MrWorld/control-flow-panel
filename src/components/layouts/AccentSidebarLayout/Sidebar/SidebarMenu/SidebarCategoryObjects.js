import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes';
import { CarRepairOutlined, DashboardRounded, MessageOutlined, PeopleAltOutlined, PrecisionManufacturingOutlined, ProductionQuantityLimitsOutlined, RecentActorsOutlined } from '@mui/icons-material';

const stations = {
    name: 'دستگاه ها',
    slug: 'دستگاه ها',
    badgeTooltip: 'دستگاه ها',
    icon: CarRepairOutlined,
    isParent: false,
    route: {
        name: 'دستگاه ها',
        icon: CarRepairOutlined,
        badgeTooltip: 'دستگاه ها',
        isParent: false,
        isMain: true,
        link: ROUTE_CONSTANTS.DASHBOARD.STATIONS.ROOT.ABSOLUTE,
    }
}

const products = {
    name: 'محصولات',
    slug: 'محصولات',
    badgeTooltip: 'محصولات',
    icon: ProductionQuantityLimitsOutlined,
    isParent: false,
    route: {
        name: 'محصولات',
        icon: ProductionQuantityLimitsOutlined,
        badgeTooltip: 'محصولات',
        isParent: false,
        isMain: true,
        link: ROUTE_CONSTANTS.DASHBOARD.PRODUCTS.ROOT.ABSOLUTE,
    }
}
const manufactoring = {
    name: 'دستور تولید',
    slug: 'دستور تولید',
    badgeTooltip: 'دستور تولید',
    icon: PrecisionManufacturingOutlined,
    isParent: false,
    route: {
        name: 'دستور تولید',
        icon: PrecisionManufacturingOutlined,
        badgeTooltip: 'دستور تولید',
        isParent: false,
        isMain: true,
        link: ROUTE_CONSTANTS.DASHBOARD.MANUFACTORING.ROOT.ABSOLUTE,
    }
}
const tasks = {
    name: 'وظایف',
    slug: 'وظایف',
    badgeTooltip: 'وظایف',
    icon: PrecisionManufacturingOutlined,
    isParent: false,
    route: {
        name: 'وظایف',
        icon: PrecisionManufacturingOutlined,
        badgeTooltip: 'وظایف',
        isParent: false,
        isMain: true,
        link: ROUTE_CONSTANTS.DASHBOARD.TASK.ROOT.ABSOLUTE,
    }
}

const users = {
    name: 'کاربران',
    slug: 'کاربران',
    badgeTooltip: 'کاربران',
    icon: RecentActorsOutlined,
    isParent: false,
    route: {
        name: 'کاربران',
        icon: RecentActorsOutlined,
        badgeTooltip: 'کاربران',
        isParent: false,
        isMain: true,
        link: ROUTE_CONSTANTS.DASHBOARD.USER.ROOT.ABSOLUTE,
    }
}


export const sidebarCategoryObjects = {
    stations,
    products,
    manufactoring,
    tasks,
    users
}