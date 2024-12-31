import { Outlet } from "react-router-dom";
import { Layout } from "../../layouts";
import SideBarAdmin from "./SideBarAdmin";
import { Container } from "@mui/material";
import HeaderAdmin from "./HeaderAdmin";

const Admin = () => {
  return (
    <Layout renderHeader={<HeaderAdmin/>} renderSidebar={<SideBarAdmin />}>
      <Container sx={{ padding: "20px" }}>
        <Outlet />
      </Container>
    </Layout>
  );
};

export default Admin;
