import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
} from "@mui/material";
import { TypographyOptions } from "@mui/material/styles/createTypography";
import { useEffect, useState } from "react";

import { color } from "./constants";
import { common } from "@mui/material/colors";
import { typography } from "./components/types";
import { useGlobalStore } from "./store";
import { Theme } from "./enums";

type Props = {
  children: React.ReactElement;
};

declare module "@mui/material/styles" {
  interface Theme {
    customTheme: {
      primaryColor: string;
      secondaryColor: string;
      textColor: string;
      secondaryTextColor: string;
    };
  }

  interface ThemeOptions {
    customTheme: {
      primaryColor: string;
      secondaryColor: string;
      textColor: string;
      secondaryTextColor: string;
    };
  }

  interface BreakpointOverrides {
    xs: false;
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true;
    tablet: true;
    laptop: true;
    desktop: true;
  }
}

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const {
    state: { theme },
  } = useGlobalStore();
  const [muiThem, setMuiTheme] = useState(
    createTheme({
      typography: {
        fontFamily: "Montserrat, sans-serif",
        htmlFontSize: 16,
        fontWeightRegular: 500,
        ...(typography as unknown as TypographyOptions),
      },
      customTheme: {
        primaryColor: color.DEFAULT_PRIMARY_COLOR,
        secondaryColor: color.DEFAULT_SECONDARY_COLOR,
        textColor: color.DEFAULT_TEXT_COLOR,
        secondaryTextColor: color.DEFAULT_SECONDARY_TEXT_COLOR,
      },
      palette: {
        background: {
          default: color.DEFAULT_PRIMARY_COLOR,
        },
        text: {
          primary: color.DEFAULT_TEXT_COLOR,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              backgroundColor: color.DEFAULT_PRIMARY_COLOR,
              "&:hover": {
                backgroundColor: color.DEFAULT_PRIMARY_COLOR,
              },
            },
            outlinedPrimary: {
              color: color.DEFAULT_PRIMARY_COLOR,
              backgroundColor: common.white,
              borderColor: color.DEFAULT_BORDER_COLOR,
              "&:hover": {
                backgroundColor: common.white,
                borderColor: color.DEFAULT_BORDER_COLOR,
              },
            },
          },
        },
      },
      breakpoints: {
        keys: ["mobile", "tablet", "laptop", "desktop"],
        values: {
          mobile: 0,
          tablet: 640,
          laptop: 1200,
          desktop: 1920,
        },
      },
    }),
  );

  useEffect(() => {
    setMuiTheme((prevMuiTheme) => {
      if (theme === Theme.DARK) {
        return {
          ...prevMuiTheme,
          customTheme: {
            primaryColor: color.DARK_THEME.DEFAULT_PRIMARY_COLOR,
            secondaryColor: color.DARK_THEME.DEFAULT_SECONDARY_COLOR,
            textColor: color.DARK_THEME.DEFAULT_TEXT_COLOR,
            secondaryTextColor: color.DARK_THEME.DEFAULT_SECONDARY_TEXT_COLOR,
          },
          background: {
            default: color.DARK_THEME.DEFAULT_PRIMARY_COLOR,
          },
        };
      }

      return {
        ...prevMuiTheme,
      };
    });
  }, [theme]);

  return (
    <MuiThemeProvider theme={muiThem}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
