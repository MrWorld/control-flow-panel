import { usePermission } from 'src/contexts/GlobalContext'


//check permission has a very bad performance and re-rendered to many times. logic needs a refactor 
export const useCheckPermission = () => {
    const permissions = usePermission()


    const checkPermission = permissionKey => {
        if (permissionKey === null) return true // ***** this for routes that permission is not set for theme

        let isPermissionGranted = false
        if (permissions.length > 0) isPermissionGranted = permissions.includes(permissionKey)
        return isPermissionGranted
    }

    return {
        checkPermission: checkPermission
    }
}