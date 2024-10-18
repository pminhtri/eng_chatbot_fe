import { Menu, MenuItem, MenuProps, styled } from "@mui/material";

const ActionMenuContainer = styled(Menu)(() => ({
  display: "inline-flex",
  padding: 8,
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 8,
  boxShadow: "0px 4px 10px 0px rgba(123, 135, 148, 0.40)",
}));

const ActionMenuItem = styled(MenuItem)(() => ({
  height: 32,
  padding: "10px 8px",
  minWidth: 130,
  alignItems: "center",
  gap: 8,
  alignSelf: "stretch",
  svg: { fill: "#3E4C59" },
}));

type Props = {
  open: boolean;
  anchorEl: HTMLElement | null;
  actions: { element: React.ReactElement; onClick: () => void }[];
  onClose: () => void;
} & Omit<MenuProps, "open" | "onClose" | "anchorEl">;

export const ActionMenu: React.FC<Props> = ({
  open,
  anchorEl,
  actions,
  onClose,
  ...rest
}: Props) => {
  return (
    <ActionMenuContainer
      anchorEl={anchorEl}
      onClose={onClose}
      open={open}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "8px",
          },
        },
      }}
      {...rest}
    >
      {actions.map(({ element, onClick }, index) => (
        <ActionMenuItem key={index} onClick={onClick}>
          {element}
        </ActionMenuItem>
      ))}
    </ActionMenuContainer>
  );
};
