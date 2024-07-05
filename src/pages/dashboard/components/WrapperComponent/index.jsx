import React from 'react'
import { Outlet, 
} from 'react-router-dom'

const WrapperComponent = () => {
    return (
        <div>
            <Outlet />
        </div>
    )
}
export default WrapperComponent