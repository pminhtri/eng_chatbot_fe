import { FC, useEffect, useState } from "react";
import { SendRounded } from "@mui/icons-material";
import {
  Box,
  styled,
  TextField,
  InputAdornment,
  IconButton,
  Skeleton
} from "@mui/material";
import { color } from "../../constants";
import { Header, Layout } from "../../layouts";
import { Button, Typography } from "../../components/ui";
import { useNavigate } from "react-router-dom";
import { publicChat } from "../../api";

const PublicChatContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
});

const MessageGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  height: "100%",
  width: "100%",
  padding: "16px",
  [theme.breakpoints.down("tablet")]: {
    width: "100%",
  },
  overflowY: "auto",
}));

const BoxInput = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "50%",
  paddingRight: "16px",
  paddingLeft: "16px",
  paddingBottom: "16px",
  [theme.breakpoints.down("tablet")]: {
    width: "100%",
  },
}));

const Input = styled(TextField)(({ theme }) => ({
  borderRadius: 25,
  height: "fit-content",
  backgroundColor: color.ZINC[200],
  "& .MuiOutlinedInput-multiline": {
    padding: "8px 12px",
  },
  "& .MuiOutlinedInput-root": {
    "& textarea": {
      overflowY: "auto",
    },

    "& fieldset": {
      border: "none",
    },
  },
  [theme.breakpoints.down("tablet")]: {
    width: "100%",
  },
}));

const LoginButton = styled(Button)({
  padding: "6px",
  backgroundColor: color.ZINC[800],
  border: `1px solid ${color.ZINC[600]}`,
  color: color.DEFAULT_SECONDARY_TEXT_COLOR,
  "&:hover": {
    backgroundColor: color.ZINC[700],
  },
});

const RegisterButton = styled(Button)({
  padding: "6px",
  width: "fit-content",
  backgroundColor: "transparent",
  border: `1px solid ${color.ZINC[600]}`,
  color: color.ZINC[600],
  "&:hover": {
    backgroundColor: color.ZINC[100],
  },
});

export const PublicEChat: FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<
    {
      message: string;
      isBot: boolean;
    }[]
  >([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [enableSend, setEnableSend] = useState<boolean>(false);

  const handleSendMessage = async () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: newMessage, isBot: false },
    ]);

    setNewMessage("");
    setEnableSend(false);

    const responseData = await publicChat({ message: newMessage });
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: responseData.response, isBot: true },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const messageGroup = document.getElementById("message-group");
    if (messageGroup) {
      messageGroup.scrollTop = messageGroup.scrollHeight;
    }
  }, [messages]);

  return (
    <Layout
      renderHeader={
        <Header>
          <Box display="flex" justifyContent="flex-end" width="100%" gap="10px">
            <LoginButton
              text="Login"
              variant="contained"
              onClick={() => navigate("/auth/login")}
            />
            <RegisterButton
              text="Register"
              variant="contained"
              onClick={() => navigate("/auth/register")}
            />
          </Box>
        </Header>
      }
    >
      <PublicChatContainer>
        <MessageGroup id="message-group">
          {messages.length !== 0 &&
            messages.map(({ message, isBot }, index) => (
              <Box
                key={index}
                sx={(theme) => ({
                  display: "flex",
                  width: "50%",
                  justifyContent: isBot ? "flex-start" : "flex-end",
                  [theme.breakpoints.down("tablet")]: {
                    width: "100%",
                  },
                })}
              >
                <Box
                  display="block"
                  width="fit-content"
                  maxWidth="50%"
                  textOverflow="initial"
                  whiteSpace="normal"
                  borderRadius="16px"
                  padding="8px 16px"
                  bgcolor={!isBot ? color.ZINC[200] : color.ZINC[300]}
                  sx={{
                    wordBreak: "break-word",
                  }}
                >
                  <Typography type="body-1">{message}</Typography>
                </Box>
              </Box>
            ))}
          {messages.length === 0 && (
            <Box
              display="flex"
              justifyContent="center"
              width="50%"
              height="100%"
              sx={{
                background:
                  "linear-gradient(90deg, #ff7e5f, #feb47b, #6a11cb, #2575fc, #ff7e5f)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "gradient-animation 5s ease infinite",
                backgroundSize: "300% 100%",
                "@keyframes gradient-animation": {
                  "0%": {
                    backgroundPosition: "0% 50%",
                  },
                  "50%": {
                    backgroundPosition: "100% 50%",
                  },
                  "100%": {
                    backgroundPosition: "0% 50%",
                  },
                },
              }}
            >
              <Typography type="heading-1">
                Hello! Welcome to English Chatbot
                <br />
                How can I help you today?
              </Typography>
            </Box>
          )}
        </MessageGroup>
        <BoxInput>
          <Input
            fullWidth
            variant="outlined"
            placeholder="Message Chat..."
            multiline
            minRows={1}
            maxRows={5}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onFocus={() => setEnableSend(true)}
            sx={{
              "& .MuiInputBase-root": {
                padding: "8px 16px",
                color: "black",
                "&:focus": {
                  color: "black",
                },
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      disabled={!enableSend || !newMessage.trim()}
                      onClick={handleSendMessage}
                    >
                      <SendRounded />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            onKeyDown={handleKeyDown}
          />
        </BoxInput>
      </PublicChatContainer>
    </Layout>
  );
};

export default PublicEChat;
