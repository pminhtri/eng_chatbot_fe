import {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Markdown from "react-markdown";
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  Skeleton,
  styled,
  TextField,
} from "@mui/material";
import { SendRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Spinner, Typography } from "../../components/ui";
import { color } from "../../constants";
import { useAsyncEffect, useErrorHandler } from "../../hooks";
import { privateChat } from "../../api";
import { useGlobalStore } from "../../store";
import { usePrivateChatStore } from "./index";
import { AppMessage } from "./store";
import { AppError } from "../../types";

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
    <Avatar sx={{ width: 28, height: 28 }} />
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
  [theme.breakpoints.down("laptop")]: {
    width: "80%",
  },
  [theme.breakpoints.down("tablet")]: {
    width: "100%",
    padding: "16px",
  },
}));

const TextInput = styled(TextField)(({ theme }) => ({
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

export const ChatBox: FC = () => {
  const { t } = useTranslation();
  const { conversationId } = useParams<{ conversationId: string }>();
  const { handleError } = useErrorHandler();
  const {
    value: { currentUser },
  } = useGlobalStore();
  const {
    value: { messages },
    actions: {
      fetchMessages,
      appendMessages,
      resetPageCount,
      loadMoreMessages,
    },
  } = usePrivateChatStore();
  const [enableSend, setEnableSend] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);
  const [isResponding, setIsResponding] = useState(false);
  const messageGroupRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    if (messageGroupRef.current) {
      messageGroupRef.current.scrollTo({
        top: messageGroupRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  const restoreScrollPosition = useCallback(() => {
    if (messageGroupRef.current) {
      messageGroupRef.current.scrollTop =
        messageGroupRef.current.scrollHeight - previousScrollHeightRef.current;
    }
  }, []);

  const { executing: fetchingMessages, error: fetchMessagesError } =
    useAsyncEffect(async () => {
      if (conversationId) {
        try {
          await fetchMessages(conversationId);
        } catch (error) {
          handleError(error as AppError);
        }
      }
    }, [conversationId]);

  if (fetchMessagesError) handleError(fetchMessagesError);

  const messageMutation = useMutation({
    mutationFn: async (message: AppMessage) => {
      try {
        const { response } = await privateChat({
          chatData: {
            conversationId: conversationId!,
            message: message.content,
          },
          userId: currentUser?.id,
        });
        return { content: response.newChat.response, isBot: true };
      } catch (error) {
        throw new Error("Failed to send message");
      }
    },
    onMutate: (message) => {
      appendMessages([message]);
      scrollToBottom();
    },
    onSuccess: (response) => {
      appendMessages([response]);
      setIsResponding(false);
      scrollToBottom();
    },
    onError: (error) => {
      handleError(error);
      setIsResponding(false);
    },
  });

  const handleScroll = useCallback(async () => {
    if (!messageGroupRef.current) return;

    if (messageGroupRef.current.scrollTop === 0) {
      previousScrollHeightRef.current = messageGroupRef.current.scrollHeight;

      try {
        await loadMoreMessages(conversationId!);
        restoreScrollPosition();
      } catch (error) {
        handleError(error as AppError);
      }
    }
  }, [conversationId, loadMoreMessages, handleError]);

  const handleChangeValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value),
    []
  );

  const handleSendMessage = useCallback(() => {
    if (!userInput.trim() || isResponding) return;

    if (firstLoad) {
      setFirstLoad(false);
    }

    const message = { content: userInput, isBot: false };
    setIsResponding(true);
    messageMutation.mutate(message);
    setUserInput("");
  }, [userInput, isResponding, messageMutation]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useLayoutEffect(() => {
    if (messageGroupRef.current) {
      scrollToBottom();
    }
  }, [firstLoad, messageGroupRef.current]);

  useEffect(() => {
    const messageGroup = messageGroupRef.current;
    if (!messageGroup) return;

    messageGroup.addEventListener("scroll", handleScroll);
    return () => messageGroup.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setUserInput("");
    resetPageCount();
  }, [conversationId]);

  if (fetchingMessages) {
    return (
      <ChatContainer>
        <Spinner />
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <MessageGroup ref={messageGroupRef} id="message-group">
        {messages.length !== 0 &&
          messages.map(({ content, isBot }, index) => (
            <Box
              key={`${content}-${index}`}
              sx={(theme) => ({
                display: "flex",
                width: "50%",
                justifyContent: isBot ? "flex-start" : "flex-end",
                [theme.breakpoints.down("tablet")]: {
                  width: "100%",
                },
              })}
            >
              {isBot && <Avatar sx={{ width: 28, height: 28 }} />}
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
        {messages.length === 0 && !fetchingMessages && (
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
        <TextInput
          fullWidth
          variant="outlined"
          placeholder="Message Chat..."
          multiline
          minRows={1}
          maxRows={5}
          value={userInput}
          onChange={handleChangeValue}
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
                    disabled={!enableSend || !userInput.trim() || isResponding}
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
