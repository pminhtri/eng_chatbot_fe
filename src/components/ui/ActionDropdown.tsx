import { Box, MenuProps } from "@mui/material";
import { FC, useState } from "react";
import { ActionMenu } from "./ActionMenu";

type Action = {
  element: React.ReactElement;
  onClick: () => void;
};

type Props = {
  children: React.ReactNode;
  actions: Action[];
  position?: {
    top: number;
    left: number;
  };
  orientation?: "vertical" | "horizontal";
} & Omit<MenuProps, "open" | "onClose" | "anchorEl">;

export const ActionDropdown: FC<Props> = ({
  children,
  actions,
  position,
  orientation = "vertical",
  ...rest
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action: Action) => {
    action.onClick();
    closeMenu();
  };

  return (
    <div>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        onClick={openMenu}
      >
        {children}
      </Box>
      <ActionMenu
        open={open}
        anchorEl={anchorEl}
        actions={actions.map((action) => ({
          ...action,
          onClick: () => handleActionClick(action),
        }))}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        {...rest}
      />
    </div>
  );
};
