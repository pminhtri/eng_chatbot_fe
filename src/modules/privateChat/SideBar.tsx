import { FC, useEffect, useState } from "react";
import {
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import MuiDrawer from "@mui/material/Drawer";
import { useQuery } from "@tanstack/react-query";
import { Theme, CSSObject } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { getConversations } from "../../api";
import { usePrivateChatStore } from "./store";
import { AddCircle } from "@mui/icons-material";
import { Path } from "../../Router";
import { Conversation } from "../../types";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("laptop")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export const SideBar: FC = () => {
  const navigate = useNavigate();
  // const { conversationId } = useParams<{ conversationId: string }>();
  const {
    value: { isSideBarOpen },
    actions: { handleToggleDrawer },
  } = usePrivateChatStore();

  const { data: conversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });

  const handleNewConversation = () => {
    return navigate(Path["Root"]);
  };

  const handleNavigateConversations = (conversationId: string) => {
    return navigate(`${Path["Conversation"]}/${conversationId}`);
  };

  return (
    <Drawer variant="permanent" open={isSideBarOpen}>
      <DrawerHeader>
        <IconButton onClick={handleToggleDrawer}>
          {isSideBarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <>
        <Button
          variant="text"
          color="info"
          startIcon={<AddCircle />}
          onClick={handleNewConversation}
        >
          New Conversation
        </Button>
      </>
      <Divider />
      <List>
        {conversations?.map(({ name, _id }) => (
          <ListItem
            key={name}
            disablePadding
            sx={{ display: "block" }}
            onClick={() => handleNavigateConversations(_id)}
          >
            <ListItemButton
              sx={[
                {
                  minHeight: 48,
                  px: 2.5,
                },
                isSideBarOpen
                  ? {
                      justifyContent: "initial",
                    }
                  : {
                      justifyContent: "center",
                    },
              ]}
            >
              <ListItemIcon
                sx={[
                  {
                    minWidth: 0,
                    justifyContent: "center",
                  },
                  isSideBarOpen
                    ? {
                        mr: 3,
                      }
                    : {
                        mr: "auto",
                      },
                ]}
              >
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
              </ListItemIcon>
              <ListItemText
                primary={name}
                sx={[
                  isSideBarOpen
                    ? {
                        opacity: 1,
                      }
                    : {
                        opacity: 0,
                      },
                ]}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
};

export default SideBar;
