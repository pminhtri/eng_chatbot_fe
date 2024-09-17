import { FC } from "react";
import { Box } from "@mui/material";

type Props = {
  children: React.ReactElement;
};

const Layout: FC<Props> = (props) => {
  const { children } = props;

  return (
    <Box
      display="flex"
      width="100%"
      justifyContent="center"
      alignItems="center"
    >
      {children}
    </Box>
  );
};

export default Layout;
