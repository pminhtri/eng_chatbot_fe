import { SendRounded } from "@mui/icons-material";
import {
  Box,
  styled,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { FC, useState } from "react";
import { color } from "../../constants";

const PublicChatContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100%",
});

const MessageBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  width: "100%",
  height: "100%",
  padding: "16px",
  overflowY: "auto",
});

const Input = styled(TextField)(({ theme }) => ({
  flex: 1,
  borderRadius: 25,
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

export const PublicEChat: FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [enableSend, setEnableSend] = useState<boolean>(false);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, newMessage]);
      setNewMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <PublicChatContainer>
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        width="60%"
        padding="16px"
      >
        <MessageBox>
          {messages.map((message, index) => (
            <Typography key={index} variant="body1" gutterBottom>
              {message}
            </Typography>
          ))}
        </MessageBox>
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
      </Box>
    </PublicChatContainer>
  );
};

export default PublicEChat;
