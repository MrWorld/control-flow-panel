import {
    useNavigate,
} from "react-router-dom"
import { ROUTE_CONSTANTS } from '../constants/AppRoutes'
import { useCheckPermission } from '../hooks/useCheckPermission'
import { usePermission } from '../contexts/GlobalContext'

const ProtectedRoutes = ({ children, role }) => {
    const { checkPermission } = useCheckPermission()
    const permissions = usePermission()
    const navigate = useNavigate()
    
    if (permissions?.length > 0) {
        if (!checkPermission(role)) navigate(ROUTE_CONSTANTS.PUBLIC_ROUTES.NOT_PERMITTED.ABSOLUTE, { replace: true })
        else return children
    } else return null
}
export default ProtectedRoutes