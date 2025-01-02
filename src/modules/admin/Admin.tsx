import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { Layout } from "../../layouts";
import SideBarAdmin from "./SideBarAdmin";
import HeaderAdmin from "./HeaderAdmin";

const Admin = () => {
  return (
    <Layout renderHeader={<HeaderAdmin />} renderSidebar={<SideBarAdmin />}>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          width: "100%",
          height: "100%",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Layout>
  );
};

export default Admin;
