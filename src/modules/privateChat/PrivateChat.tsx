import { FC } from "react";
import { Avatar, Box, IconButton, styled } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  AdminPanelSettingsOutlined,
  LogoutRounded,
  PersonOutlineRounded,
  SettingsOutlined,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import { Header, Layout } from "../../layouts";
import { ChatBox } from "./ChatBox";
import { usePrivateChatStore } from "./store";
import { ActionDropdown } from "../../components/ui";
import { useGlobalStore } from "../../store";
import { hasPermission } from "../../utils";
import { Role } from "../../enums";
import { color } from "../../constants";
import { useAuthStore } from "../auth/store";
import { Path } from "../../Router";

const ActionMenuContainer = styled(Box)(() => ({
  display: "flex",
  width: "240px",
  justifyContent: "flex-start",
  alignItems: "center",
  flexDirection: "row",
  paddingLeft: "8px",
  color: `${color.ZINC[600]}`,
  gap: 8,
}));

export const PrivateChat: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    value: { currentConversationId, isSideBarOpen },
    actions: { handleToggleDrawer },
  } = usePrivateChatStore();
  const {
    value: { currentUser },
  } = useGlobalStore();
  const {
    actions: { logout },
  } = useAuthStore();

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
            <ActionDropdown
              actions={[
                {
                  element: (
                    <ActionMenuContainer>
                      <PersonOutlineRounded />
                      {t("profile")}
                    </ActionMenuContainer>
                  ),
                  onClick: () => console.log("Profile"),
                },
                ...(hasPermission([currentUser?.role as Role], [Role.Admin])
                  ? [
                      {
                        element: (
                          <ActionMenuContainer>
                            <AdminPanelSettingsOutlined />
                            {t("admin")}
                          </ActionMenuContainer>
                        ),
                        onClick: () => navigate(Path["Admin"]),
                      },
                    ]
                  : []),
                {
                  element: (
                    <ActionMenuContainer>
                      <SettingsOutlined />
                      {t("settings")}
                    </ActionMenuContainer>
                  ),
                  onClick: () => console.log("Settings"),
                },
                {
                  element: (
                    <ActionMenuContainer>
                      <LogoutRounded />
                      {t("logout")}
                    </ActionMenuContainer>
                  ),
                  dividerTop: true,
                  onClick: async () => {
                    await logout();
                    navigate(Path["Login"]);
                  },
                },
              ]}
            >
              <Box
                display="flex"
                padding={1}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <Avatar />
              </Box>
            </ActionDropdown>
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
