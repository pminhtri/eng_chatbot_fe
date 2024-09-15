import React from "react";
import { Alert, AlertColor, AlertProps, Slide, styled } from "@mui/material";
import { Trans } from "react-i18next";
import { Typography } from "./Typography";

type Props = {
  id: string;
  text: string;
  title?: string;
  type: AlertColor;
  onClose?: () => void;
} & AlertProps;

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

const MessageContent = styled(Alert)({
  borderRadius: 8,
  marginBottom: 16,
});

const HighlightText = styled("span")({
  fontWeight: "bold",
});

export const Toaster: React.FC<Props> = ({
  id,
  text,
  type,
  title,
  onClose,
  ...rest
}: Props) => {
  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <MessageContainer>
        <MessageContent
          id={id}
          key={id}
          severity={type}
          onClose={onClose}
          {...rest}
        >
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
