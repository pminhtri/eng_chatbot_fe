import { FC, useState, useEffect } from "react";
import {
  Box,
  Grid2,
  IconButton,
  InputAdornment,
  Skeleton,
  styled,
  TextField,
} from "@mui/material";
import { SendRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Markdown from "react-markdown";
import { publicChat } from "../api";
import { Button, Typography } from "../components/ui";
import configs from "../configs";
import { color } from "../constants";
import { useErrorHandler } from "../hooks";
import { Layout, Header } from "../layouts";
import { AppError } from "../types";

const SKELETON_ROWS = 5;
const TYPING_SPEED = 10;

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
  [theme.breakpoints.down("laptop")]: {
    width: "100%",
  },
  overflowY: "auto",
}));

const BoxInput = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "50%",
  paddingTop: "8px",
  paddingBottom: "16px",
  [theme.breakpoints.down("laptop")]: {
    width: "100%",
  },
  [theme.breakpoints.down("tablet")]: {
    width: "100%",
    padding: "16px",
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
  [theme.breakpoints.down("laptop")]: {
    width: "70%",
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

const TypingMarkdown: FC<{ content: string; isAnimating: boolean }> = ({
  content,
  isAnimating,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isAnimating) {
      setDisplayedText("");
      setCurrentIndex(0);
    }
  }, [content, isAnimating]);

  useEffect(() => {
    if (isAnimating && currentIndex < content.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + content[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, TYPING_SPEED);

      return () => clearTimeout(timeoutId);
    }
  }, [currentIndex, content, isAnimating]);

  return (
    <Markdown
      components={{
        p: (props) => (
          <p
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
            }}
          >
            {props.children}
          </p>
        ),
      }}
    >
      {isAnimating ? displayedText : content}
    </Markdown>
  );
};

const renderSkeletonResponse = () => (
  <Box
    sx={(theme) => ({
      display: "flex",
      width: "50%",
      justifyContent: "flex-start",
      [theme.breakpoints.down("tablet")]: {
        width: "100%",
      },
    })}
  >
    <Box
      display="block"
      width="50%"
      maxWidth="70%"
      textOverflow="initial"
      whiteSpace="normal"
      borderRadius="16px"
      padding="8px 16px"
    >
      {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
        <Skeleton key={index} animation="wave" />
      ))}
    </Box>
  </Box>
);

export const PublicEChat: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();
  const [messages, setMessages] = useState<
    {
      content: string;
      isBot: boolean;
    }[]
  >([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [enableSend, setEnableSend] = useState<boolean>(false);
  const [isResponding, setIsResponding] = useState<boolean>(false);

  const bubbleItems: {
    title: string;
    description: string;
    content: string;
  }[] = configs.BUBBLE_CONTENT;

  const handleClickBubble = (content: string) => {
    setMessages((prevMessages) => [...prevMessages, { content, isBot: false }]);
    setNewMessage("");
    setEnableSend(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { content: newMessage, isBot: false },
    ]);

    setNewMessage("");
    setEnableSend(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isResponding) {
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const messageGroup = document.getElementById("message-group");
    if (messageGroup) {
      messageGroup.scrollTop =
        messageGroup.scrollHeight - messageGroup.clientHeight;
    }
  }, [messages]);

  useEffect(() => {
    (async () => {
      if (messages.length === 0) {
        return;
      }

      const lastMessage = messages[messages.length - 1];

      if (lastMessage.isBot) {
        return;
      }

      setIsResponding(true);

      try {
        const { response } = await publicChat({ message: lastMessage.content });

        setMessages((prevMessages) => [
          ...prevMessages,
          { content: response, isBot: true },
        ]);
      } catch (error) {
        handleError(error as AppError);
      } finally {
        setIsResponding(false);
      }
    })();
  }, [messages]);

  return (
    <Layout
      renderHeader={
        <Header>
          <Box display="flex" justifyContent="flex-end" width="100%" gap="10px">
            <LoginButton
              text="Login"
              variant="contained"
              onClick={() => {
                navigate("/auth/login");
              }}
            />
            <RegisterButton
              text="Register"
              variant="contained"
              onClick={() => {
                navigate("/auth/register");
              }}
            />
          </Box>
        </Header>
      }
    >
      <PublicChatContainer>
        <MessageGroup id="message-group">
          {messages.length !== 0 &&
            messages.map(({ content, isBot }, index) => (
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
                  maxWidth="70%"
                  textOverflow="initial"
                  whiteSpace="normal"
                  borderRadius="16px"
                  padding="8px 16px"
                  bgcolor={!isBot ? color.ZINC[200] : color.ZINC[300]}
                  sx={{
                    wordBreak: "break-word",
                  }}
                >
                  <TypingMarkdown
                    content={content}
                    isAnimating={isBot && index === messages.length - 1}
                  />
                </Box>
              </Box>
            ))}
          {isResponding && renderSkeletonResponse()}
          {messages.length === 0 && (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="space-around"
              width="50%"
              height="100%"
              sx={(theme) => ({
                [theme.breakpoints.down("laptop")]: {
                  width: "70%",
                },
                [theme.breakpoints.down("tablet")]: {
                  width: "100%",
                },
              })}
            >
              <Box
                display="flex"
                justifyContent="center"
                width="100%"
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
                <Typography type="heading-2">{t("defaultContent")}</Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Grid2 container spacing={2}>
                  {bubbleItems.map((item, index) => (
                    <Grid2 key={index} size={6}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="flex-start"
                        width="100%"
                        border={`1px solid ${color.ZINC[300]}`}
                        color={color.ZINC[800]}
                        boxShadow="0px 2px 6px 0px rgba(97, 110, 124, 0.20)"
                        borderRadius="12px"
                        padding="4px 12px"
                        gap={2}
                        height="80px"
                        whiteSpace="nowrap"
                        sx={{
                          ":hover": {
                            cursor: "pointer",
                            backgroundColor: color.ZINC[100],
                            transition: "0.3s",
                            transform: "scale(1.05)",
                            boxShadow:
                              "0px 4px 8px 0px rgba(97, 110, 124, 0.20)",
                            whiteSpace: "normal",
                          },
                        }}
                        onClick={() => handleClickBubble(item.content)}
                      >
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignContent="flex-start"
                          width="100%"
                          flexDirection="column"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          <Typography type="title-3">{item.title}</Typography>
                          <Typography type="body-1" display="block">
                            {item.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid2>
                  ))}
                </Grid2>
              </Box>
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
                      disabled={
                        !enableSend || !newMessage.trim() || isResponding
                      }
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
