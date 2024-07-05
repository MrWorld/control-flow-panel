import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ThemeProviderWrapper from "./theme/ThemeProvider";
import AppRouter from "./router";
import CustomSnackbarProvider from "./components/SnackbarProvider";
import "./globalStyles.css";
import "swiper/css";
import "swiper/css/navigation";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import "swiper/css/pagination";
import { useLayoutEffect } from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import "./assets/fonts/BYekan+.ttf";
import "./assets/fonts/BYekan+ Bold.ttf";

const cacheRtl = createCache({
  key: "muirtl",
  // prefixer is the only stylis plugin by default, so when
  // overriding the plugins you need to include it explicitly
  // if you want to retain the auto-prefixing behavior.
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
  useLayoutEffect(() => {
    document.body.setAttribute("dir", "rtl");
  }, []);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CacheProvider value={cacheRtl}>
        <ThemeProviderWrapper>
          <CustomSnackbarProvider>
            <CssBaseline />
            <AppRouter />
          </CustomSnackbarProvider>
        </ThemeProviderWrapper>
      </CacheProvider>
    </LocalizationProvider>
  );
}

export default App;
