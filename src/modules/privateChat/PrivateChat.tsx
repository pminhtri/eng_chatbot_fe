import { FC } from "react";
import { Header, Layout } from "../../layouts";
import { Avatar, Box, IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import { ChatBox } from "./ChatBox";
import { usePrivateChatStore } from "./store";

export const PrivateChat: FC = () => {
  const {
    value: { currentConversationId, isSideBarOpen },
    actions: { handleToggleDrawer },
  } = usePrivateChatStore();

  return (
    <Layout
      renderHeader={
        <Header>
          <Box
            display="flex"
            width="100%"
            justifyContent={`${isSideBarOpen ? "flex-end" : "space-between"}`}
            alignItems="center"
            paddingRight={4}
          >
            {!isSideBarOpen && (
              <IconButton onClick={handleToggleDrawer}>
                <ChevronRightIcon />
              </IconButton>
            )}
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
