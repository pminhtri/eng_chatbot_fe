import {
  Box,
  styled,
  Skeleton,
  TextField,
  keyframes,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { color } from "../../constants";
import { Typography } from "../../components/ui";
import { useTranslation } from "react-i18next";
import { useErrorHandler } from "../../hooks";
import { useGlobalStore } from "../../store";
import { fetchChatsByConversation, privateChat } from "../../api";
import { AppError } from "../../types";
import { SendRounded } from "@mui/icons-material";
import SideBar from "./SideBar";
const SKELETON_ROWS = 5;

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
      maxWidth="50%"
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

const BoxInput = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "50%",
  paddingTop: "8px",
  paddingBottom: "16px",
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
  [theme.breakpoints.down("tablet")]: {
    width: "100%",
  },
}));

const renderContentWithAnimation = (content: string) => {
  const words = content.split(" ");

  return words.map((word, index) => (
    <Typography
      key={index}
      type="body-1"
      sx={{
        display: "inline-block",
        opacity: 0,
        animation: `${typingAnimation} 0.5s forwards`,
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {word}&nbsp;
    </Typography>
  ));
};

const typingAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

type ChatMessage = {
  content: string;
  isBot: boolean;
};

export const PrivateChat: FC = () => {
  const conversationId = "123";
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  const [newMessage, setNewMessage] = useState<string>("");
  const [enableSend, setEnableSend] = useState<boolean>(false);
  const [isResponding, setIsResponding] = useState<boolean>(false);
  const [isAtTop, setIsAtTop] = useState<boolean>(false);
  const messageLastIndexRef = useRef<unknown>(null);
  const [maxPages, setMaxPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const {
    value: { currentUser },
  } = useGlobalStore();

  const setIncrementalPage = (limitedValue: number) => {
    const limitedPage = Math.max(0, Math.min(++limitedValue, maxPages));
    return setPage(limitedPage);
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
      if (page <= 1) {
        messageGroup.scrollTop = messageGroup.scrollHeight;
      } else {
        // console.log(messageLastIndexRef.current)
        // messageGroup.scrollTop = messageLastIndexRef.current.scrollHeight;
      }
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
        const { response } = await privateChat({
          chatData: {
            conversationId: conversationId,
            message: lastMessage.content,
          },
          userId: currentUser?.id,
        });

        setMessages((prevMessages) => [
          ...prevMessages,
          { content: response.newChat.response, isBot: true },
        ]);
      } catch (error) {
        handleError(error as AppError);
      } finally {
        setIsResponding(false);
      }
    })();
  }, [messages]);

  useEffect(() => {
    (async () => {
      try {
        if (conversationId) {
          const { paginatedChats, totalPages } = await fetchChatsByConversation(
            page,
            conversationId
          );
          if (paginatedChats.length === 0 || !totalPages) {
            return setIsAtTop(false);
          } else {
            const mappedResponses = paginatedChats.map(({ response }) => ({
              content: response,
              isBot: true,
            }));

            const mappedMessages = paginatedChats.map(({ message }) => ({
              content: message,
              isBot: false,
            }));

            const mappedChats: ChatMessage[] = [];
            const maxLength = Math.max(
              mappedMessages.length,
              mappedResponses.length
            );

            for (let i = 0; i < maxLength; i++) {
              if (i < mappedMessages.length)
                mappedChats.push(mappedMessages[i]);
              if (i < mappedResponses.length)
                mappedChats.push(mappedResponses[i]);
            }

            setMessages(mappedChats);
            setMaxPages(totalPages);
          }
        }
      } catch (error) {}
    })();
  }, [conversationId, page]);

  const handleScroll = () => {
    const scrollElement = chatContainerRef;

    if (scrollElement.current?.scrollTop === 0) {
      setIsAtTop(true);
      setIncrementalPage(page);
    } else {
      setIsAtTop(false);
    }
  };

  useEffect(() => {
    const scrollElement = chatContainerRef;

    if (scrollElement.current) {
      scrollElement.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollElement.current) {
        scrollElement.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [chatContainerRef, maxPages]);

  return (
    <Box>
      <SideBar />
      <PublicChatContainer>
        <Box sx={{ display: "flex" }}>
          {isAtTop && page < maxPages && <CircularProgress />}
        </Box>
        <MessageGroup id="message-group" ref={chatContainerRef}>
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
                  ref={(el) => {
                    if (index === 0) {
                      messageLastIndexRef.current = el;
                    }
                  }}
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
                  {isBot && index === messages.length - 1 ? (
                    renderContentWithAnimation(content)
                  ) : (
                    <Typography type="body-1">{content}</Typography>
                  )}
                </Box>
              </Box>
            ))}
          {isResponding && renderSkeletonResponse()}
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
              <Typography type="heading-1">{t("defaultContent")}</Typography>
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
    </Box>
  );
};

export default PrivateChat;
