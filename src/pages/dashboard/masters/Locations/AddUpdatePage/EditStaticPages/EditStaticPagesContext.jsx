import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { adminService } from "src/api/services/admin";
import useToast from "src/hooks/useToast";
import { errorMessage } from "src/utils/errorTypeDetector";
import {
    Box,
    CircularProgress,
} from '@mui/material';
import { useCheckPermission } from "src/hooks/useCheckPermission";

const StaticPagesContext = createContext({});

export const StaticPagesProvider = ({ children, data }) => {
    const { checkPermission } = useCheckPermission();
    const { toast } = useToast()
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activePage, setActivePage] = useState({});

    const getPages = useCallback(async () => {
        try {
            setPages(data);
            setActivePage(data);
        } catch (err) {
            console.log(err);
            toast(errorMessage(err), 'error')
        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        getPages();
    }, [getPages]);


    const changeActivePage = (sender) => {
        const targetPage = pages.find(p => p.slug === sender);
        setActivePage(targetPage);
    }

    return <StaticPagesContext.Provider value={{
        pages, setPages, activePage, changeActivePage, setActivePage
    }}>
        {
            loading ?
                <Box dir={'rtl'} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}><CircularProgress /></Box> :
                <Box dir={'rtl'} sx={{width: '100%'}}>
                    {children}
                </Box>
        }
    </StaticPagesContext.Provider>
}

export const useStaticPages = () => {
    const staticPagesContext = useContext(StaticPagesContext);
    if (!staticPagesContext) {
        throw "useStaticPages should be inside StaticPagesProvider";
    }
    return staticPagesContext;
}

