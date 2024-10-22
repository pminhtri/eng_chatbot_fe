import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import MuiDrawer from "@mui/material/Drawer";
import { Theme, CSSObject, useTheme, alpha } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  AddCircle,
  DeleteForeverOutlined,
  EditOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";

import { usePrivateChatStore } from "./store";
import { Path } from "../../Router";
import { useGlobalStore } from "../../store";
import { color } from "../../constants";
import { ActionDropdown } from "../../components/ui";
import { common } from "@mui/material/colors";

const openedMixin = (theme: Theme): CSSObject => ({
  width: 250,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  [theme.breakpoints.down("tablet")]: {
    width: 200,
  },
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: 0,
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: 250,
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

const TextInput = styled(TextField)({
  ".MuiInputBase-root": {
    borderRadius: 8,
    "&.Mui-disabled": {
      backgroundColor: alpha(common.black, 0.1),
    },
  },
  "& label.Mui-focused": {
    color: color.ZINC[600],
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: `${color.ZINC[400]}`,
    },
    "&.Mui-focused fieldset": {
      borderColor: `${color.ZINC[400]}`,
    },
    "&:hover fieldset": {
      borderColor: `${color.ZINC[400]}`,
    },
    "& input": {
      padding: "0 8px",
    },
  },
  ".MuiFormHelperText-root": {
    marginLeft: 0,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const ActionMenuContainer = styled(Box)(() => ({
  display: "flex",
  width: "100%",
  padding: "8px",
  gap: 8,
  flexDirection: "row",
  justifyContent: "flex-start",
}));

export const SideBar: FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("tablet"));
  const {
    value: { isSideBarOpen },
    actions: { handleToggleDrawer, setCurrentConversationId },
  } = usePrivateChatStore();
  const {
    value: { conversations },
    actions: { fetchConversations, updateConversationName },
  } = useGlobalStore();

  const [hoveredConversationId, setHoveredConversationId] = useState<
    string | null
  >(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>("");
  const [conversationName, setConversationName] = useState("");
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      if (!conversations.length) {
        await fetchConversations();
      }
    })();
  }, [conversations]);

  useEffect(() => {
    if (isMobile && isSideBarOpen) {
      handleToggleDrawer();
    }
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        textInputRef.current &&
        !textInputRef.current.contains(event.target as Node)
      ) {
        setIsRenaming(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [textInputRef]);

  const handleNewConversation = useCallback(() => {
    setCurrentConversationId(null);
    navigate(Path["Root"]);
  }, [navigate]);

  const handleRenameConversation = useCallback(
    async (conversationId: string) => {
      setIsRenaming(true);
      await updateConversationName(conversationId, conversationName);
      setIsRenaming(false);
    },
    [conversationName]
  );

  const handleNavigateConversations = useCallback(
    (conversationId: string) => {
      if (location.pathname === `${Path["Conversation"]}/${conversationId}`) {
        return;
      }

      setCurrentConversationId(conversationId);
      navigate(`${Path["Conversation"]}/${conversationId}`);
    },
    [navigate]
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isSideBarOpen}
      onClose={handleToggleDrawer}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <DrawerHeader>
        <IconButton onClick={handleToggleDrawer}>
          {isSideBarOpen && <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            height: 40,
            backgroundColor: color.ZINC[100],
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={handleNewConversation}
        >
          <AddCircle />
          New Conversation
        </Box>
      </div>
      <List
        sx={{
          px: 1,
        }}
      >
        {conversations?.map(({ name, _id }) => (
          <ListItem
            key={_id}
            disablePadding
            sx={{
              display: "flex",
              direction: "row",
              px: 2,
              height: 40,
              borderRadius: 2,
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor:
                location.pathname === `${Path["Conversation"]}/${_id}`
                  ? `${color.ZINC[200]}`
                  : "transparent",
              "&:hover": {
                backgroundColor: `
                  ${
                    location.pathname === `${Path["Conversation"]}/${_id}`
                      ? color.ZINC[200]
                      : color.ZINC[100]
                  }
                `,
              },
            }}
            onMouseEnter={() => setHoveredConversationId(_id)}
            onMouseLeave={() => setHoveredConversationId(null)}
          >
            {isRenaming && selectedConversationId === _id ? (
              <ListItemText
                primary={
                  <TextInput
                    type="text"
                    defaultValue={name}
                    onChange={(e) => setConversationName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRenameConversation(_id);
                      }
                    }}
                    inputRef={textInputRef}
                  />
                }
              />
            ) : (
              <>
                <ListItemButton
                  disableTouchRipple
                  disableGutters
                  disableRipple
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                  onClick={() => handleNavigateConversations(_id)}
                >
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
                {(hoveredConversationId === _id ||
                  location.pathname === `${Path["Conversation"]}/${_id}`) && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      color: color.ZINC[500],
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  >
                    <ActionDropdown
                      actions={[
                        {
                          element: (
                            <ActionMenuContainer>
                              <EditOutlined />
                              Rename
                            </ActionMenuContainer>
                          ),
                          onClick: () => {
                            setIsRenaming(true);
                            setSelectedConversationId(_id);
                          },
                        },
                        {
                          element: (
                            <ActionMenuContainer
                              style={{
                                color: "red",
                              }}
                            >
                              <DeleteForeverOutlined color="error" />
                              Delete
                            </ActionMenuContainer>
                          ),
                          onClick: () => console.log("Delete", _id),
                        },
                      ]}
                    >
                      <MoreHorizOutlined />
                    </ActionDropdown>
                  </Box>
                )}
              </>
            )}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SideBar;
