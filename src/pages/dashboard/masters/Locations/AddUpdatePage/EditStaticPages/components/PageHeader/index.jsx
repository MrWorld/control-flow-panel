import {
    Grid,
    Typography,
    styled,
    Box,
    Tab,
    Tabs
} from '@mui/material';
import { useStaticPages } from '../../EditStaticPagesContext';

const PageHeader = () => {
    const { changeActivePage, activePage, pages } = useStaticPages();

    const onChangeTabClicked = (e, value) => {
        changeActivePage(value);
    }

    return <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
                Edit static pages
            </Typography>
            <Typography variant="subtitle2">
                You can edit your static pages here
            </Typography>
        </Grid>
        <StyledTabsWrapper>
            <TabsWrapper
                onChange={onChangeTabClicked}
                scrollButtons="auto"
                textColor="secondary"
                value={activePage.slug}
                variant="scrollable"
            >
                {pages.map((page) => (
                    <Tab key={page.slug} value={page.slug} label={page.slug} />
                ))}
            </TabsWrapper>
        </StyledTabsWrapper>
    </Grid>
}

export default PageHeader;

const StyledTabsWrapper = styled(Box)(
    () => `
        display: flex;
        justify-content: flex-end;
    `
);

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