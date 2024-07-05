import React from 'react'
import {
    Outlet,
} from "react-router-dom";

import GeneralLayoutWrapper from './GeneralLayoutWrapper'

const GeneralLayout = () => {
    return (
        <GeneralLayoutWrapper>
            <Outlet />
        </GeneralLayoutWrapper>
    )
}
export default GeneralLayout