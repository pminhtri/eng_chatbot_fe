import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { FC } from "react";

export const Spinner: FC = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
};
