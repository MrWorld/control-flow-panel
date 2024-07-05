import React, { Suspense, lazy } from 'react'
import {
    Routes as RoutesWrapper,
    Route,
    Navigate,
} from "react-router-dom"
import Login from 'src/pages/auth/Login'
import ResetPassword from 'src/pages/auth/ResetPassword'
import ForgotPassword from 'src/pages/auth/ForgotPassword'
import NotFound from 'src/pages/404'
import NotPermitted from 'src/pages/NotPermitted'
import StaticPage from 'src/pages/statics/StaticPage'


import AccentSidebarLayout from 'src/components/layouts/AccentSidebarLayout'
import GeneralLayout from 'src/components/layouts/GeneralLayout'
import DashboardLayout from 'src/components/layouts/DashboardLayout'
import SuspenseLoader from 'src/components/layouts/SuspenseLoader'
import WrapperComponent from 'src/pages/dashboard/components/WrapperComponent'
import { ROUTE_CONSTANTS } from 'src/constants/AppRoutes'
import ProtectedRoutes from './ProtectedRoutes';
import * as Permission from './roles.enum'


const Analytics = Loader(lazy(() => import('src/pages/dashboard/Analytics')))

// **** user pages ***** 
const MyProfile = Loader(lazy(() => import('src/pages/dashboard/masters/MyProfile')))




const Stations = Loader(lazy(() => import('src/pages/dashboard/Stations')))
const AddUpdateStation = Loader(lazy(() => import('src/pages/dashboard/Stations/AddUpdatePage')))

const Products = Loader(lazy(() => import('src/pages/dashboard/Products')))
const AddUpdateProduct = Loader(lazy(() => import('src/pages/dashboard/Products/AddUpdatePage')))

const Manufactorings = Loader(lazy(() => import('src/pages/dashboard/ManufactoringSchema')))
const AddUpdatemanufactoring = Loader(lazy(() => import('src/pages/dashboard/ManufactoringSchema/AddUpdatePage')))

const ControlPanel = Loader(lazy(() => import('src/pages/dashboard/ControlPanel')))



function Loader(Component) {
    return (props) =>
    (
        <Suspense fallback={<SuspenseLoader />}>
            <Component {...props} />
        </Suspense>
    )
}

const AppRouter = () => {
    return (
        <RoutesWrapper>
            <Route path={ROUTE_CONSTANTS.ROOT.ABSOLUTE} element={<GeneralLayout />}>
                <Route path="" element={<Login />} />
            </Route>
            <Route path={ROUTE_CONSTANTS.ROOT_STAR.ABSOLUTE} element={<NotFound />} />
            <Route path={ROUTE_CONSTANTS.PUBLIC_ROUTES.NOT_PERMITTED.ABSOLUTE} element={<NotPermitted />} />
            <Route path={ROUTE_CONSTANTS.AUTH.ROOT.RELATIVE} element={<GeneralLayout />} >
                <Route path="" element={<Navigate to={ROUTE_CONSTANTS.AUTH.LOGIN.RELATIVE} />} />
                <Route path={ROUTE_CONSTANTS.AUTH.LOGIN.RELATIVE} element={<Login />} />
            </Route>
            <Route path={""} element={<DashboardLayout />} >
                <Route path={ROUTE_CONSTANTS.DASHBOARD.ROOT.RELATIVE} element={<AccentSidebarLayout />}>
                    <Route path={ROUTE_CONSTANTS.DASHBOARD.ANALYTICS.RELATIVE} element={<Analytics />} />
                    <Route path={ROUTE_CONSTANTS.DASHBOARD.USERS.PROFILE.ROOT.RELATIVE} element={<MyProfile />} />


                    <Route path={ROUTE_CONSTANTS.DASHBOARD.STATIONS.ROOT.RELATIVE} element={<Stations />} />
                    <Route path={ROUTE_CONSTANTS.DASHBOARD.STATIONS.DETAILS.RELATIVE} element={<AddUpdateStation />} />
                    <Route path={ROUTE_CONSTANTS.DASHBOARD.STATIONS.ADD_NEW.RELATIVE} element={<AddUpdateStation addNew={true} />} />

                    <Route path={ROUTE_CONSTANTS.DASHBOARD.PRODUCTS.ROOT.RELATIVE} element={<Products />} />
                    <Route path={ROUTE_CONSTANTS.DASHBOARD.PRODUCTS.DETAILS.RELATIVE} element={<AddUpdateProduct />} />
                    <Route path={ROUTE_CONSTANTS.DASHBOARD.PRODUCTS.ADD_NEW.RELATIVE} element={<AddUpdateProduct addNew={true} />} />

                    <Route path={ROUTE_CONSTANTS.DASHBOARD.MANUFACTORING.ROOT.RELATIVE} element={<Manufactorings />} />
                    <Route path={ROUTE_CONSTANTS.DASHBOARD.MANUFACTORING.DETAILS.RELATIVE} element={<AddUpdatemanufactoring />} />
                    <Route path={ROUTE_CONSTANTS.DASHBOARD.MANUFACTORING.ADD_NEW.RELATIVE} element={<AddUpdatemanufactoring addNew={true} />} />


                    <Route path={ROUTE_CONSTANTS.DASHBOARD.MASTERS.ROOT.RELATIVE} element={<WrapperComponent category='masters' />}>
                        
                    </Route>
                    <Route path={ROUTE_CONSTANTS.DASHBOARD.ROOT.ABSOLUTE} element={<WrapperComponent category='dashboards' />}>
                        <Route path={ROUTE_CONSTANTS.DASHBOARD.CONTROL_PANEL.ROOT.RELATIVE} element={<ProtectedRoutes role='CONFIGURATION:CONTROLPANEL'><ControlPanel /></ProtectedRoutes>} />
                    </Route>
                </Route>
            </Route>
        </RoutesWrapper>
    )

}
export default AppRouter
