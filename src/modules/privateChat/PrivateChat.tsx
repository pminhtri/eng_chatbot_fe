import { FC } from "react";
import { Header, Layout } from "../../layouts";
import { Avatar, Box } from "@mui/material";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import { ChatBox } from "./ChatBox";
import { usePrivateChatStore } from "./store";

export const PrivateChat: FC = () => {
  const {
    value: { currentConversationId },
  } = usePrivateChatStore();

  return (
    <Layout
      renderHeader={
        <Header>
          <Box
            display="flex"
            width="100%"
            justifyContent="flex-end"
            alignItems="center"
            paddingRight={4}
          >
            <Avatar />
          </Box>
        </Header>
      }
      renderSidebar={<SideBar />}
    >
      {currentConversationId ? <Outlet /> : <ChatBox />}
    </Layout>
  );
};

export default PrivateChat;
