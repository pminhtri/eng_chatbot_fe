import { Divider, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { Location, useLocation } from "react-router-dom";
import { mappingSectionName } from "../../constants/mapping";
import logo from "../../assets/logo.jpeg";

const HeaderAdmin = () => {
  const location: Location = useLocation();
  const [sectionName, setSectionName] = useState<string>();
  useEffect(() => {
    setSectionName(mappingSectionName[location.pathname]);
  }, [location]);
  return (
    <Stack direction={"row"} spacing={6} sx={{ padding: "20px 0" }}>
      <Stack
        direction={"row"}
        spacing={2}
        alignItems={"center"}
        sx={{ padding: "0 26px" }}
      >
        <img style={{ width: "50px", height: "50px" }} src={logo} alt="" />
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "25px",
            fontWeight: "Bold",
          }}
        >
          Rubi
        </span>
      </Stack>
      <Divider
        sx={{ border: "2px solid gray", position: "relative", left: "30px" }}
      />
      <h2>{sectionName}</h2>
    </Stack>
  );
};

export default HeaderAdmin;
