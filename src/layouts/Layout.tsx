import { FC } from "react";
import { Box, styled } from "@mui/material";

type Props = {
  children: React.ReactNode;
  renderHeader?: React.ReactElement;
  renderFooter?: React.ReactElement;
};

const Container = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateRows: "auto 1fr auto",
  height: "100vh",

  [theme.breakpoints.down("tablet")]: {
    gridTemplateRows: "auto 1fr",
  },
}));

const Content = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100%",
  overflow: "auto",

  [theme.breakpoints.down("tablet")]: {
    width: "100%",
  },
}));

const Layout: FC<Props> = (props) => {
  const { children, renderHeader, renderFooter } = props;

  return (
    <Container>
      {renderHeader && <Box>{renderHeader}</Box>}
      <Content>{children}</Content>
      {renderFooter && <Box>{renderFooter}</Box>}
    </Container>
  );
};

export default Layout;
