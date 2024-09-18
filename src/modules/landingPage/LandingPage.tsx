import { FC } from "react";
import { useAuthStore } from "../auth/store";
import { useGlobalStore } from "../../store";
import { Box } from "@mui/material";
import { Button, Typography } from "../../components/ui";

const LandingPage: FC = () => {
  const {
    actions: { logout },
  } = useAuthStore();
  const {
    value: { currentUser },
    actions: { clearUser },
  } = useGlobalStore();

  const handleLogout = () => {
    logout();
    clearUser();
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
