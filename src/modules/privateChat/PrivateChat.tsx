import { FC } from "react";
import { Header, Layout } from "../../layouts";
import { Avatar, Box } from "@mui/material";
import SideBar from "./SideBar";
import { ChatBox } from "./ChatBox";

export const PrivateChat: FC = () => {
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
    >
      <SideBar />
      <ChatBox />
    </Layout>
  );
};

export default PrivateChat;
