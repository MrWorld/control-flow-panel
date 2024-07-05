import { useState } from 'react';
import {
    Typography,
    Box,
    Grid,
    styled,
    Tabs,
    Tab,
} from '@mui/material';

const GeneralInfo = ({ name, description }) => {

    let tabs = [{ label: 'English', value: 'en' }, { label: 'Arabic', value: 'ar' }]
    const [activeTab, setActiveTab] = useState({ label: 'English', value: 'en' })

    const handleChangeLanguage = (e, val) => {
        let selected = tabs.find(tab => tab.value === val)

        setActiveTab(selected)
    }


    return (
        <>
            <Grid container>
                <Grid item style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                    <Typography variant={'overline'} fontSize={'17px'}>General</Typography>
                    <Box dir={'rtl'}
                        display="flex"
                        alignItems="center"
                        flexDirection={{ xs: 'column', sm: 'row' }}
                        justifyContent={{ xs: 'center', sm: 'space-between' }}
                        pb={3}
                    >
                        {/* <TabsWrapper
                            onChange={handleChangeLanguage}
                            scrollButtons="auto"
                            textColor="secondary"
                            value={activeTab.value || 'Details'}
                            variant="scrollable"
                        >
                        </TabsWrapper> */}
                    </Box>
                </Grid>
            </Grid>
            <Typography
                variant={'h5'}
                sx={{
                    pb: 2,
                    pt: 1
                }}
                style={{ direction: activeTab.value === 'ar' && 'rtl' }}
                component="h3"
            >
                {name}
            </Typography>
            <Typography variant="body1" >
                {description}
            </Typography>
        </>
    )
}

export default GeneralInfo

const TabsWrapper = styled(Tabs)(
    ({ theme }) => `
      @media (max-width: ${theme.breakpoints.values.md}px) {
        .MuiTabs-scrollableX {
          overflow-x: auto !important;
        }
  
        .MuiTabs-indicator {
            box-shadow: none;
        }
      }
      `
);