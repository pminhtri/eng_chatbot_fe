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
  Tooltip,
  TooltipProps,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { common } from "@mui/material/colors";
import { useLocation, useNavigate } from "react-router-dom";
import MuiDrawer from "@mui/material/Drawer";
import { Theme, CSSObject, useTheme, alpha } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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
import { ActionDropdown, Typography } from "../../components/ui";

const openedMixin = (theme: Theme): CSSObject => ({
  width: 260,
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
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
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
const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    PopperProps={{
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, -10],
          },
        },
        {
          name: "preventOverflow",
          options: {
            boundary: "viewport",
          },
        },
      ],
    }}
  />
))(() => ({
  "& .MuiTooltip-tooltip": {
    backgroundColor: color.DEFAULT_SECONDARY_COLOR,
    color: color.DEFAULT_TEXT_COLOR,
    border:`1px solid ${color.ZINC[500]}`,
    boxShadow: "0px 2px 6px 0px rgba(97, 110, 124, 0.20)",
    fontSize: "0.75rem",
  },
}));

export const SideBar: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("mobile"));
  const {
    value: { isSideBarOpen },
    actions: { handleToggleDrawer, setCurrentConversationId },
  } = usePrivateChatStore();
  const {
    value: { conversations },
    actions: { fetchConversations, updateConversationName, deleteConversation },
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

  const handleDeleteConversation = useCallback(
    async (conversationId: string) => {
      await deleteConversation(conversationId);
    },
    []
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
      anchor="left"
      open={isSideBarOpen}
      onClose={handleToggleDrawer}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <DrawerHeader>
        <IconButton onClick={handleToggleDrawer}>
          {isSideBarOpen && <ChevronLeftIcon />}
          {!isSideBarOpen && <ChevronRightIcon />}
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
          <Typography type="body-1" color="textPrimary">
            {t("newConversation")}
          </Typography>
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
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleRenameConversation(_id)
                    }
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
                  <CustomTooltip title={name} placement="top-start">
                    <ListItemText
                      primary={name}
                      sx={[
                        {
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                        isSideBarOpen
                          ? {
                              opacity: 1,
                            }
                          : {
                              opacity: 0,
                            },
                      ]}
                    />
                  </CustomTooltip>
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
                              {t("rename")}
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
                              {t("delete")}
                            </ActionMenuContainer>
                          ),
                          onClick: async () => {
                            await handleDeleteConversation(_id);
                            handleNewConversation();
                          },
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
