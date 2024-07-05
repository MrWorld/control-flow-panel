import { Box, Grid } from "@mui/material"
import PageHeader from "./components/PageHeader"
import PageTitleWrapper from "src/components/PageTitleWrapper"


const GeneralConfigurations = () => {
    return (
        <>
            <Box dir={'rtl'}
      style={{
        display: "flex",
        flexDirection: "column",
        // justifyContent: "space-between",
        minHeight: "92vh",
      }}
    >
        <PageTitleWrapper>
            <PageHeader
            pageTitle="(Branch) Configurations"
            pageSubtitle="You can see list of configs here"
            />
        </PageTitleWrapper>
        <Grid
            sx={{
            px: 4,
            }}
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={4}
        >

        </Grid>
        </Box>
        </>
    )
}

export default GeneralConfigurations