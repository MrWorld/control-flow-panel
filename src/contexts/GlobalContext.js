import { getAuthorization } from "src/utils/getAuthorization";
import create from "zustand";

// ****** lets check if any user data exist in localStorage or not. if yes set into state manager ******
const { localStorage } = window

const myUserInfo = () => {
    const myStoredUserInfo = localStorage.getItem('user')
    if (myStoredUserInfo) {
        const branch = localStorage.getItem('branchId')
        if (!branch) {
            if (JSON.parse(myStoredUserInfo)?.AssignedBranches?.length) {
                localStorage.setItem('branchId', JSON.parse(myStoredUserInfo)?.AssignedBranches[0]?.branchId)
            }
        }
        return JSON.parse(myStoredUserInfo)
    }
    else return undefined
}

const useStore = create((set) => ({
    // ****** user management ******
    user: myUserInfo(),
    myPermissions: [],
    menus: [],

    setMenu: (menu) => {
        set(() => ({ menus: menu }))
    },

    setUser: (user) => {
        set(() => ({ user }))
        localStorage.setItem('user', JSON.stringify(user))
    },
    setPermission: (permissions) => {
        set(() => ({ myPermissions: permissions }))
    },
    setTokens: (access_token, refresh_token) => {
        localStorage.setItem('token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
    },
    purgeUser: () => {
        set(() => ({ user: undefined }))
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user')
        localStorage.removeItem('perms')
    },

    // ****** general loading management ******
    generalLoading: !!getAuthorization(),
    setGeneralLoading: (value) => set(() => ({ generalLoading: value })),

    // ****** sidebar management ******
    sidebarToggle: false,
    setSidebarToggle: () => set((state) => ({ sidebarToggle: !state.sidebarToggle })),
    sideBarClose: () => set(() => ({ sidebarToggle: false })),

    exchangeRates: [],
    setExchangeRate: (rates) => set(() => ({ exchangeRates: rates })),

    notifications: [],
    setNotifications: (newNotifications) => set(() => ({ notifications: newNotifications })),

    reports: [],
    setReports: (data) => set(() => ({ reports: data })),
}));



// ***** exposing states & handlers all over app ***** 

export const useSetMenu = () => useStore((state) => state.setMenu);
export const useMenu = () => useStore((state) => state.menus);
export const useUser = () => useStore((state) => state.user);
export const useSetUser = () => useStore((state) => state.setUser);
export const usePermission = () => useStore((state) => state.myPermissions);
export const useSetPermission = () => useStore((state) => state.setPermission);
export const useSetTokens = () => useStore((state) => state.setTokens);
export const usePurgeUser = () => useStore((state) => state.purgeUser);
export const useGeneralLoading = () => useStore((state) => state.generalLoading);
export const useSetGeneralLoading = () => useStore((state) => state.setGeneralLoading);
export const useSidebarShow = () => useStore((state) => state.sidebarToggle);
export const useSidebarToggle = () => useStore((state) => state.setSidebarToggle);
export const useSidebarClose = () => useStore((state) => state.sideBarClose);
export const useSetExchangeRate = () => useStore((state) => state.setExchangeRate);
export const useExchangeRate = () => useStore((state) => state.exchangeRates);
export const useSetNotifications = () => useStore((state) => state.setNotifications);
export const useNotifications = () => useStore((state) => state.notifications);
export const useSetReports = () => useStore((state) => state.setReports);
export const useReports = () => useStore((state) => state.reports);

