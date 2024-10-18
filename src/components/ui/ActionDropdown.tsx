import { Box, Divider, Menu, MenuItem, MenuProps } from "@mui/material";
import { FC, useState } from "react";

type Action = {
  element: React.ReactElement;
  onClick?: () => void;
  dividerTop?: boolean;
  dividerBottom?: boolean;
};

type Props = {
  children: React.ReactNode;
  actions: Action[];
  orientation?: "vertical" | "horizontal";
} & Omit<MenuProps, "open" | "onClose" | "anchorEl">;

export const ActionDropdown: FC<Props> = ({
  children,
  actions,
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
    action.onClick?.();
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
      <Menu
        anchorEl={anchorEl}
        onClose={closeMenu}
        open={open}
        disableAutoFocusItem
        slotProps={{
          paper: {
            sx: {
              borderRadius: "8px",
              padding: "4px",
              height: "fit-content",
            },
          },
        }}
        {...rest}
      >
        {actions.map(
          ({ element, onClick, dividerTop, dividerBottom }, index) => (
            <div key={index}>
              {dividerTop && (
                <Box sx={{ width: "100%", height: "1px", color: "red", py: 1 }}>
                  <Divider />
                </Box>
              )}
              <MenuItem
                sx={{
                  padding: 0,
                  margin: 0,
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                  },
                }}
                onClick={() => handleActionClick({ element, onClick })}
              >
                {element}
              </MenuItem>
              {dividerBottom && (
                <Box sx={{ width: "100%", height: "1px", color: "red", py: 1 }}>
                  <Divider />
                </Box>
              )}
            </div>
          ),
        )}
      </Menu>
    </div>
  );
};
