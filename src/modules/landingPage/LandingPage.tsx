import { FC } from "react";
import { useAuthStore } from "../auth/store";
import { useGlobalStore } from "../../store";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { del } from "idb-keyval";
import { Button, Typography } from "../../components/ui";

const LandingPage: FC = () => {
  const navigate = useNavigate();

  const {
    actions: { logout },
  } = useAuthStore();

  const {
    value: { currentUser },
  } = useGlobalStore();

  const handleLogout = async () => {
    await logout();
    del("global-store");
    navigate("/auth/login");
  };

  return (
    <div>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography type="heading-2" translationKey="Welcome to Landing Page" />
        <div>
          {currentUser && (
            <div>
              <Typography type="heading-3">{currentUser.email}</Typography>
            </div>
          )}
          <Button text={"logout"} onClick={handleLogout} />
        </div>
      </Box>
    </div>
  );
};

export default LandingPage;
