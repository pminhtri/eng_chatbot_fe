import { AlertColor } from "@mui/material/Alert/Alert";
import {
  FC,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { Alert as MuiAlert, Slide, styled } from "@mui/material";
import { Typography } from "../components/ui";
import { AlertStatus } from "../enums";
import configs from "../configs";

type AlertProps = {
  title?: string;
  text: string;
  type: AlertColor;
  expiredAt: number;
  onClose?: () => void;
};

type AlertMessage = {
  id: number;
  title?: string;
  text: string;
  type: AlertColor;
  expiredAt: number;
};

type AlertContext = {
  showSuccessMessage: (message: string, duration?: number) => void;
  showErrorMessage: (message: string, duration?: number) => void;
  showInfoMessage: (message: string, duration?: number) => void;
  showWarningMessage: (message: string, duration?: number) => void;
};

const Context = createContext<AlertContext>({
  showSuccessMessage: () => {},
  showErrorMessage: () => {},
  showInfoMessage: () => {},
  showWarningMessage: () => {},
});

const MessageContainer = styled("div")({
  position: "fixed",
  top: 10,
  right: 10,
  zIndex: 1301,
  width: 400,
  maxWidth: "calc(100vw - 20px)",
  "& .MuiAlert-root": {
    boxShadow: "0px 2px 6px 0px rgba(97, 110, 124, 0.20)",
  },
  "& .MuiAlert-standardSuccess": {
    border: "1px solid #1D7D64",
  },
  "& .MuiAlert-standardError": {
    border: "1px solid #5F2120",
  },
  "& .MuiAlert-standardInfo": {
    border: "1px solid #18516E",
  },
  "& .MuiAlert-standardWarning": {
    border: "1px solid #90724C",
  },
});

const MessageContent = styled(MuiAlert)({
  borderRadius: 8,
  marginBottom: 16,
});

const HighlightText = styled("span")({
  fontWeight: "bold",
});

const Alert: FC<AlertProps> = ({ text, type, title, expiredAt, onClose }) => {
  return (
    <Slide direction="left" in mountOnEnter unmountOnExit>
      <MessageContainer>
        <MessageContent key={expiredAt} severity={type} onClose={onClose}>
          {title && <Typography type="title-3">{title}</Typography>}
          <Typography type="body-1">
            <Trans
              components={{
                span: <HighlightText />,
              }}
            >
              {text}
            </Trans>
          </Typography>
        </MessageContent>
      </MessageContainer>
    </Slide>
  );
};

export function withAlertMessage(Component: FC) {
  return (props: Record<string, unknown>) => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<AlertMessage[]>([]);
    const element = useMemo(() => <Component {...props} />, [props]);

    const deleteMessage = (messageId: number) => {
      setMessages(messages.filter(({ id }) => id !== messageId));
    };
    const showMessage = (
      text: string,
      type: AlertColor,
      duration: number = configs.DEFAULT_DURATION,
      title?: string
    ) => {
      const now = Date.now();
      const newMessage = {
        id: now,
        title,
        text,
        type,
        expiredAt: now + duration,
      };

      setMessages([...messages, newMessage]);
    };
    const showSuccessMessage = (text: string, duration?: number) =>
      showMessage(text, AlertStatus.SUCCESS, duration, `${t("alertSuccess")}`);
    const showErrorMessage = (text: string, duration?: number) =>
      showMessage(text, AlertStatus.ERROR, duration, `${t("alertError")}`);
    const showInfoMessage = (text: string, duration?: number) =>
      showMessage(text, AlertStatus.INFO, duration);
    const showWarningMessage = (text: string, duration?: number) =>
      showMessage(text, AlertStatus.WARNING, duration);

    useEffect(() => {
      if (!messages.length) {
        return;
      }

      const minExpiredAt = messages.reduce<number>((current, { expiredAt }) => {
        return expiredAt < current ? expiredAt : current;
      }, Number.MAX_VALUE);

      setTimeout(() => {
        setMessages(messages.filter(({ expiredAt }) => expiredAt > Date.now()));
      }, minExpiredAt - Date.now());
    }, [messages]);

    return (
      <Context.Provider
        value={useMemo(
          () => ({
            showSuccessMessage,
            showErrorMessage,
            showInfoMessage,
            showWarningMessage,
          }),
          [messages]
        )}
      >
        {element}
        {messages.length ? (
          messages.map(({ id, text, type, title, expiredAt }) => (
            <Alert
              key={id}
              title={title}
              text={text}
              type={type}
              expiredAt={expiredAt}
              onClose={() => deleteMessage(id)}
            />
          ))
        ) : (
          <></>
        )}
      </Context.Provider>
    );
  };
}

export const useAlert = (): AlertContext => useContext(Context);
