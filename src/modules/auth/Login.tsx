import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
  alpha,
  Box,
  Grid2,
  IconButton,
  styled,
  TextField,
} from "@mui/material";
import { common } from "@mui/material/colors";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";

import { useAuthStore } from "./store";
import { useAlert, useErrorHandler } from "../../hooks";
import { AppError } from "../../types";
import { Button, Typography } from "../../components/ui";
import { Layout } from "../../layouts";
import { color, VALID_EMAIL_REGEX } from "../../constants";
import { formatRules } from "../../utils/validation";

import { ErrorCode } from "../../enums";
import { Path } from "../../Router";

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
    width: "400px",
    margin: "auto",
  },
  [theme.breakpoints.down("mobile")]: {
    width: "250px",
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

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    actions: { login },
  } = useAuthStore();

  const form = useForm<LoginForm>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { control } = form;

  const { showErrorMessage } = useAlert();
  const { handleError } = useErrorHandler();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [executing, setExecuting] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const changedField = Object.keys(form.formState.dirtyFields).pop();

  const getErrorMessage = useCallback((fieldName: keyof LoginForm) => {
    const fieldState = form.getFieldState(fieldName);
    return errorMessage || t(`${fieldState.error?.message || ""}`);
  }, [changedField, errorMessage]);

  const handleLogin = form.handleSubmit(async ({ email, password }) => {
    if (VALID_EMAIL_REGEX.test(email) === false) {
      form.setError("email", {
        type: "manual",
        message: t("error.invalidEmail"),
      });
      showErrorMessage(t("error.invalidEmail"));
      return;
    }

    try {
      setErrorMessage("");
      setExecuting(true);
      await login(email, password);
      navigate(Path["Root"]);
    } catch (error) {
      const appError = error as AppError;

      if (appError.code === ErrorCode.INVALID_CREDENTIALS) {
        setErrorMessage(t("loginForm.invalidCredentials"));
      } else {
        handleError(error as Error);
      }
    } finally {
      setExecuting(false);
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
                  control={control}
                  rules={formatRules({ required: true, email: true })}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label={t("email")}
                      required
                      variant="outlined"
                      size="small"
                      fullWidth
                      helperText={
                        errorMessage || t(`${getErrorMessage("email")}`)
                      }
                      error={!!form.getFieldState("email").error}
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
                  control={control}
                  rules={formatRules({ required: true })}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label={t("password")}
                      required
                      variant="outlined"
                      size="small"
                      fullWidth
                      helperText={
                        errorMessage || t(`${getErrorMessage("password")}`)
                      }
                      error={!!form.getFieldState("password").error}
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
                <Link to={Path["Register"]} style={{ marginLeft: 4 }}>
                  <Typography
                    type="body-1"
                    color="primary"
                    translationKey="register"
                  />
                </Link>
              </Box>
            </LoginContent>
          </FormProvider>
        </LoginForm>
      </LoginContainer>
    </Layout>
  );
};

export default Login;
