import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
  alpha,
  Box,
  Divider,
  Grid2,
  IconButton,
  styled,
  TextField,
} from "@mui/material";
import { common } from "@mui/material/colors";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { IoLogoMicrosoft } from "react-icons/io5";

import { useAuthStore } from "./store";
import { useErrorHandler } from "../../hooks";
import { AppError } from "../../types";
import { Button, Typography } from "../../components/ui";
import { Layout } from "../../layouts";
import { color } from "../../constants";
import { formatRules } from "../../utils/validation";
import { useGlobalStore } from "../../store";

type LoginForm = {
  email: string;
  password: string;
};

const LoginContainer = styled(Grid2)({
  display: "flex",
  width: "100%",
  height: "100vh",
  padding: "20px",
  justifyContent: "center",
  alignItems: "center",
});

const LoginForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  borderRadius: 8,
  border: `1px solid ${color.ZINC[300]}`,
  boxShadow: "0px 2px 6px 0px rgba(97, 110, 124, 0.20)",
  padding: 20,
  "& .MuiTextField-root": {
    marginBottom: 10,
  },
  "& .MuiButton-root": {
    marginTop: 10,
  },
});

const LoginContent = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("laptop")]: {
    width: "400px",
  },
  [theme.breakpoints.between("tablet", "laptop")]: {
    width: "250px",
    margin: "auto",
  },
  [theme.breakpoints.down("tablet")]: {
    width: "80%",
    margin: "auto",
  },
}));

const Title = styled(Typography)({
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
});

const InputGroup = styled("div")({
  "& .MuiTextField-root": {
    marginBottom: "16px",
  },
  "& .MuiButton-root": {
    marginTop: "16px",
  },
});

const TextInput = styled(TextField)({
  ".MuiInputBase-root": {
    borderRadius: 8,
    "&.Mui-disabled": {
      backgroundColor: alpha(common.black, 0.1),
    },
  },
  "& label.Mui-focused": {
    color: color.ZINC[600],
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: alpha(common.black, 0.1),
    },
    "&.Mui-focused fieldset": {
      borderColor: color.ZINC[600],
    },
    "&:hover fieldset": {
      borderColor: color.ZINC[400],
    },
  },
  ".MuiFormHelperText-root": {
    marginLeft: 0,
  },
});

const SubmitButton = styled(Button)({
  padding: "10px 100px",
  backgroundColor: color.ZINC[800],
  border: `1px solid ${color.ZINC[600]}`,
  color: color.DEFAULT_SECONDARY_TEXT_COLOR,
  "&:hover": {
    backgroundColor: color.ZINC[700],
  },
});

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

  [theme.breakpoints.between("tablet", "laptop")]: {
    padding: "10px 15px",
  },
}));

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    actions: { login },
  } = useAuthStore();

  const {
    actions: { fetchCurrentUser },
  } = useGlobalStore();

  const form = useForm<LoginForm>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleError } = useErrorHandler();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [executing, setExecuting] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = form.handleSubmit(async ({ email, password }) => {
    try {
      setErrorMessage("");
      setExecuting(true);
      await login(email, password);
      await fetchCurrentUser();
      navigate("/");
    } catch (error) {
      const appError = error as AppError;

      if (appError.code === "INVALID_CREDENTIALS") {
        setErrorMessage(t("loginForm.invalidCredentials"));
      } else {
        handleError(error as Error);
      }
    }
  });

  return (
    <Layout>
      <LoginContainer
        container
        spacing={{
          mobile: 4,
          laptop: 8,
        }}
      >
        <LoginForm onSubmit={handleLogin}>
          <FormProvider {...form}>
            <Title type="heading-3">{t("mainTitle")}</Title>
            <LoginContent>
              <InputGroup>
                <Controller
                  name="email"
                  control={form.control}
                  rules={formatRules({ required: true, email: true })}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label={t("email")}
                      required
                      variant="outlined"
                      size="small"
                      fullWidth
                      helperText={errorMessage}
                      error={!!errorMessage}
                      sx={{
                        "& .MuiInputBase-root": {
                          color: "black",
                          "&:focus": {
                            color: "black",
                          },
                        },
                      }}
                    />
                  )}
                />
              </InputGroup>
              <InputGroup>
                <Controller
                  name="password"
                  control={form.control}
                  rules={formatRules({ required: true })}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label={t("password")}
                      required
                      variant="outlined"
                      size="small"
                      fullWidth
                      helperText={errorMessage}
                      error={!!errorMessage}
                      sx={{
                        "& .MuiInputBase-root": {
                          color: "black",
                          "&:focus": {
                            color: "black",
                          },
                        },

                        '& input[type="password"]::-ms-reveal': {
                          display: "none",
                        },
                        '& input[type="password"]::-ms-clear': {
                          display: "none",
                        },
                      }}
                      slotProps={{
                        input: {
                          type: showPassword ? "text" : "password",
                          endAdornment: (
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOutlined />
                              ) : (
                                <VisibilityOffOutlined />
                              )}
                            </IconButton>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </InputGroup>
              <SubmitButton
                size="large"
                type="submit"
                variant="contained"
                fullWidth
                disabled={executing}
                text={t("login")}
              />
              <Box
                display="flex"
                flexGrow={1}
                marginTop={2}
                justifyContent="center"
                alignItems="center"
              >
                <Typography
                  type="body-1"
                  color="textSecondary"
                  translationKey="registerQuestion"
                />
                <Link to="/auth/register" style={{ marginLeft: 4 }}>
                  <Typography
                    type="body-1"
                    color="primary"
                    translationKey="register"
                  />
                </Link>
              </Box>
              <Divider
                sx={{ margin: "20px 0" }}
                variant="middle"
                children={
                  <Typography
                    type="body-1"
                    color="textSecondary"
                    translationKey="or"
                  />
                }
              />
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
                onClick={() => {
                  alert("Google login is not supported yet.");
                }}
              />
              <ThirdPartyLoginButton
                size="large"
                variant="contained"
                fullWidth
                text={t("loginWithMicrosoft")}
                textType="body-2"
                startIcon={
                  <IoLogoMicrosoft size={24} style={{ marginRight: 10 }} />
                }
                onClick={() => {
                  alert("Microsoft login is not supported yet.");
                }}
              />
            </LoginContent>
          </FormProvider>
        </LoginForm>
      </LoginContainer>
    </Layout>
  );
};

export default Login;
