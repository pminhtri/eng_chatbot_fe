import { FC, useEffect, useState } from "react";
import { useAuthStore } from "../auth/store";
import { useGlobalStore } from "../../store";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { del } from "idb-keyval";
import { Button, Typography } from "../../components/ui";
import { Header, Layout } from "../../layouts";
import { PrivateChat, SideBar } from "../privateChat";
import { getConversations } from "../../api/conversation";
import { ConversationsData } from "../../types";

const LandingPage: FC = () => {
  const navigate = useNavigate();
  const [conversationsData, setConversationData] =
    useState<ConversationsData[]>();

  const {
    actions: { logout },
  } = useAuthStore();

  const {
    value: { currentUser },
  } = useGlobalStore();

  const handleLogout = async () => {
    await logout();
    del("global-store");
    navigate("/auth/login");
  };

  useEffect(() => {
    (async () => {
      try {
        const { conversations } = await getConversations();
        const filteredConversations = conversations.map(
          ({ name, _id, createdAt }) => ({
            name,
            _id,
            createdAt,
          })
        );
        setConversationData(filteredConversations);
      } catch (error) {}
    })();
  }, [currentUser]);

  return (
    <Layout
      renderHeader={
        <Header>
          <Box display="flex" justifyContent="flex-end" width="100%" gap="10px">
            <div>
              {currentUser && (
                <div>
                  <Typography type="heading-3">{currentUser.email}</Typography>
                </div>
              )}
              <Button text={"logout"} onClick={handleLogout} />
            </div>
          </Box>
        </Header>
      }
    >
      <SideBar conversationsData={conversationsData} />
      <PrivateChat />
    </Layout>
  );
};

export default LandingPage;
