import { FC } from "react";
import { styled } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { IoLogoMicrosoft } from "react-icons/io5";

import { Button } from "../../components/ui";
import { color } from "../../constants";
import { axiosClient } from "../../utils";

const ThirdPartyLoginButton = styled(Button)(({ theme }) => ({
  padding: "10px 80px",
  backgroundColor: color.DEFAULT_PRIMARY_COLOR,
  border: `1px solid ${color.ZINC[600]}`,
  color: color.DEFAULT_TEXT_COLOR,
  justifyContent: "flex-start",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: color.ZINC[200],
  },

  [theme.breakpoints.down("tablet")]: {
    padding: "10px 15px",
  },
}));

const ThirdPartyAuth: FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <ThirdPartyLoginButton
        size="large"
        variant="contained"
        fullWidth
        text={t("loginWithFacebook")}
        textType="body-2"
        startIcon={<FaFacebook size={24} style={{ marginRight: 10 }} />}
        onClick={() => {
          alert("Facebook login is not supported yet.");
        }}
      />
      <ThirdPartyLoginButton
        size="large"
        variant="contained"
        fullWidth
        text={t("loginWithGoogle")}
        textType="body-2"
        startIcon={<FaGoogle size={24} style={{ marginRight: 10 }} />}
        onClick={async () => {
          const response = await axiosClient.get("/auth/google")
          window.location.href = response.data
        }}
      />
      <ThirdPartyLoginButton
        size="large"
        variant="contained"
        fullWidth
        text={t("loginWithMicrosoft")}
        textType="body-2"
        startIcon={<IoLogoMicrosoft size={24} style={{ marginRight: 10 }} />}
        onClick={() => {
          alert("Microsoft login is not supported yet.");
        }}
      />
    </div>
  );
};

export default ThirdPartyAuth;
