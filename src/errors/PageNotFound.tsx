import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button, Typography } from "../components/ui";
import { color } from "../constants";

const PageNotFoundContainer = styled(Box)(() => ({
  textAlign: "center",
  padding: 50,
  "& .MuiButton-root": {
    marginTop: 20,
  },
  "& button": {
    padding: "10px 100px",
    backgroundColor: color.ZINC[800],
    border: `1px solid ${color.ZINC[600]}`,
    color: color.DEFAULT_SECONDARY_TEXT_COLOR,
    "&:hover": {
      backgroundColor: color.DEFAULT_PRIMARY_COLOR,
      color: color.DEFAULT_TEXT_COLOR,
    },
  },
}));

export const PageNotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const prevRoutePathname = location.state?.prevRoute?.pathname;

  if (prevRoutePathname) {
    window.history.replaceState(
      {},
      "Page Not Found",
      location.state.prevRoute.pathname
    );
  }

  return (
    <PageNotFoundContainer>
      <Typography type="heading-1">404</Typography>
      <Typography type="title-1">{t("error.pageNotFound")}</Typography>
      <Link to="/auth/login">
        <Button variant="contained" text={t("backToLogin")} />
      </Link>
    </PageNotFoundContainer>
  );
};
