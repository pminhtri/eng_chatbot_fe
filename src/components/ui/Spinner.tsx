import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { FC } from "react";

export const Spinner: FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress size={30} />
    </Box>
  );
};
