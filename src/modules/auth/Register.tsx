import {
  alpha,
  Box,
  Divider,
  Grid2,
  IconButton,
  styled,
  TextField,
} from "@mui/material";
import { FC, useState } from "react";
import { common } from "@mui/material/colors";

import { Button, Typography } from "../../components/ui";
import { color } from "../../constants";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useAlert, useErrorHandler } from "../../hooks";
import { AppError } from "../../types";
import { ErrorCode } from "../../enums";
import { Layout } from "../../layouts";
import { formatRules } from "../../utils/validation";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import ThirdPartyAuth from "./ThirdPartyAuth";
import { useAuthStore } from "./store";

type RegisterForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterContainer = styled(Grid2)({
  display: "flex",
  width: "100%",
  height: "100vh",
  padding: "20px",
  justifyContent: "center",
  alignItems: "center",
});

const RegisterForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  borderRadius: 8,
  border: "1px solid #e0e0e0",
  boxShadow: "0px 2px 6px 0px rgba(97, 110, 124, 0.20)",
  padding: 20,
  "& .MuiTextField-root": {
    marginBottom: 10,
  },
  "& .MuiButton-root": {
    marginTop: 10,
  },
});

const RegisterContent = styled(Box)(({ theme }) => ({
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

const Register: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    actions: { register },
  } = useAuthStore();
  const { showSuccessMessage } = useAlert();
  const { handleError } = useErrorHandler();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [executing, setExecuting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterForm>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = form.handleSubmit(async ({ email, password }) => {
    try {
      setExecuting(true);
      await register(email, password);
      showSuccessMessage(t("Register Successfully!"));
      setExecuting(false);
      navigate("/auth/login");
    } catch (error) {
      const appError = error as AppError;

      if (appError.code === ErrorCode.EMAIL_ALREADY_EXISTS) {
        form.setError("email", {
          type: "manual",
          message: t("emailAlreadyExists"),
        });

        setErrorMessage(t("emailAlreadyExists"));
      }

      handleError(appError);
      setExecuting(false);
    }
  });

  return (
    <Layout>
      <RegisterContainer>
        <RegisterForm onSubmit={handleSubmit}>
          <FormProvider {...form}>
            <Title type="heading-3">{t("register")}</Title>
            <RegisterContent>
              <InputGroup>
                <Controller
                  name="email"
                  control={form.control}
                  rules={formatRules({ required: true })}
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
              <InputGroup>
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  rules={formatRules({ required: true })}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label={t("confirmPassword")}
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
                          type: showConfirmPassword ? "text" : "password",
                          endAdornment: (
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
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
                text={t("register")}
                disabled={executing}
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
                  translationKey="loginQuestion"
                />
                <Link to="/auth/login" style={{ marginLeft: 4 }}>
                  <Typography
                    type="body-1"
                    color="primary"
                    translationKey="login"
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
              <ThirdPartyAuth />
            </RegisterContent>
          </FormProvider>
        </RegisterForm>
      </RegisterContainer>
    </Layout>
  );
};

export default Register;
