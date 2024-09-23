import React, { FC } from "react";
import { styled } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

const HeaderContainer = styled("header")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "8px",
  width: "100%",
  top: 0,
  position: "sticky",
});

const Header: FC<Props> = (props) => {
  const { children } = props;

  return <HeaderContainer>{children}</HeaderContainer>;
};

export default Header;
