import { FC, useEffect, useRef, useState } from "react";
import { Typography } from "../../components/ui";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Skeleton,
  styled,
  TextField,
} from "@mui/material";
import { color } from "../../constants";
import { SendRounded } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useErrorHandler } from "../../hooks";
import { fetchChatsByConversation, privateChat } from "../../api";
import { AppError } from "../../types";
import { useGlobalStore } from "../../store";
import Markdown from "react-markdown";
import { usePrivateChatStore } from "./index";
import { Path } from "../../Router";

const SKELETON_ROWS = 5;
const TYPING_SPEED = 10;

const ChatContainer = styled(Box)({
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
  gap: "24px",
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
      width="70%"
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

type ChatMessage = {
  content: string;
  isBot: boolean;
};

export const ChatBox: FC = () => {
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();

  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [newMessage, setNewMessage] = useState<string>("");
  const [enableSend, setEnableSend] = useState<boolean>(false);
  const [isResponding, setIsResponding] = useState<boolean>(false);
  const [isAtTop, setIsAtTop] = useState<boolean>(false);
  const [maxPages, setMaxPages] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messageLastIndexRef = useRef<unknown>();

  const {
    value: { currentUser },
  } = useGlobalStore();

  const {
    value: { pageCount },
    actions: { increasePageCount, resetPageCount },
  } = usePrivateChatStore();

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
      if (pageCount <= 1) {
        messageGroup.scrollTop = messageGroup.scrollHeight;
      } else {
        const messageLastIndex =
          messageLastIndexRef.current?.getBoundingClientRect();
        messageGroup.scrollTop = messageLastIndex.y;
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

      if (firstLoad) {
        setFirstLoad(false);
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

        if(response.newConversation){
          return navigate(`${Path["Conversation"]}/${response.newConversation._id}`)
        }

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
          const {
            docs: paginatedChats,
            totalPages,
            hasNextPage,
            hasPrevPage,
          } = await fetchChatsByConversation(pageCount, conversationId);

          if (paginatedChats.length === 0 || !totalPages) {
            return setIsAtTop(false);
          } else {
            paginatedChats.reverse();
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

            if (hasPrevPage) {
              setMessages((prevMessages) => {
                return [...mappedChats, ...prevMessages];
              });
            } else {
              setMessages(mappedChats);
            }
            setMaxPages(totalPages);
            setHasNextPage(hasNextPage);
          }
        }
      } catch (error) {}
    })();
  }, [conversationId, pageCount]);

  const handleScroll = () => {
    const scrollElement = document.getElementById("message-group");

    if (scrollElement?.scrollTop === 0) {
      setIsAtTop(true);
      increasePageCount(maxPages);
    } else {
      setIsAtTop(false);
    }
  };

  useEffect(() => {
    const scrollElement = document.getElementById("message-group");

    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasNextPage]);

  useEffect(() => {
    const scrollElement = document.getElementById("message-group");

    if (!scrollElement) return;

    if (!hasNextPage) {
      scrollElement.removeEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasNextPage]);

  useEffect(() => {
    resetPageCount;
    setMessages([]);
    setIsAtTop(false);
    setHasNextPage(false)
  }, [conversationId]);

  const lastIndex =
    messages.length % 20 === 0
      ? (pageCount - 1) * 20 - 1
      : (messages.length % 20) - 1;

  return (
    <ChatContainer>
      <Box sx={{ display: "flex" }}>
        {isAtTop && hasNextPage && <CircularProgress />}
      </Box>
      <MessageGroup id="message-group">
        {messages.length !== 0 &&
          messages.map(({ content, isBot }, index) => (
            <Box
              key={index}
              ref={(el) => {
                if (index === lastIndex) {
                  messageLastIndexRef.current = el;
                }
              }}
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
                maxWidth="100%"
                textOverflow="initial"
                whiteSpace="normal"
                borderRadius="16px"
                padding="8px 16px"
                bgcolor={!isBot ? color.ZINC[200] : color.DEFAULT_PRIMARY_COLOR}
                sx={{
                  wordBreak: "break-word",
                }}
              >
                <TypingMarkdown
                  content={content}
                  isAnimating={
                    isBot && index === messages.length - 1 && !firstLoad
                  }
                />
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
            <Typography type="heading-2">{t("defaultContent")}</Typography>
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
                    disabled={!enableSend || !newMessage.trim() || isResponding}
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
    </ChatContainer>
  );
};
