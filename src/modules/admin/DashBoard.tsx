import { useEffect, useState } from "react";
import { getRequestsInWeek, getSummaryUserActivities } from "../../api";
import { BarChartCustom } from "./BarChartAdmin";
import { TableAdmin } from "./TableAdmin";
import { RequestsInWeek, SummaryUserActivities } from "../../types/admin";
import { Box, Container, Stack } from "@mui/material";

const spreadStyle = {
  borderBottom: "solid #F4F5F6 2px",
  padding: "0 0 20px 30px",
};
const boxStyle = {
  borderRadius: "15px",
  backgroundColor: "white",
  boxShadow: "5px 5px 6px 1px #E8EBEC",
};
const DashBoard = () => {
  const [summaryUserActivities, setSummaryUserActivities] = useState<
    SummaryUserActivities[]
  >([]);
  const [requestsInWeek, setRequestsInWeek] = useState<RequestsInWeek[]>([]);
  const currentDate = new Date("2024-12-27");

  useEffect(() => {
    const fetchUserLog = async () => {
      const data = await getSummaryUserActivities(currentDate);
      setSummaryUserActivities(data);
    };
    const fetchRequestsInWeek = async () => {
      const res = await getRequestsInWeek(currentDate);
      setRequestsInWeek(res);
    };
    fetchUserLog();
    fetchRequestsInWeek();
  }, []);

  const showDetailByDate = async (index: number) => {
    const data = await getSummaryUserActivities(
      new Date(requestsInWeek[index].date.split("T")[0])
    );
    setSummaryUserActivities(data);
  };
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3rem",
        gap: "20px",
      }}
    >
      <Stack direction="row" spacing={4} sx={{ alignItems: "baseline" }}>
        <Box sx={{ padding: "20px 0", ...boxStyle }}>
          <Box sx={spreadStyle}>
            <span style={{ fontWeight: "bold", fontSize: "20px" }}>
              Monitoring activities chart
            </span>
          </Box>
          <BarChartCustom
            requests={requestsInWeek}
            onItemClick={showDetailByDate}
          />
        </Box>
        <Box sx={{ padding: "20px 0", ...boxStyle }}>
          <Box sx={spreadStyle}>
            <span style={{ fontWeight: "bold", fontSize: "20px" }}>
              Monitoring activities chart
            </span>
          </Box>
          <BarChartCustom
            requests={requestsInWeek}
            onItemClick={showDetailByDate}
          />
        </Box>
        {/* <Box sx={{padding: "20px", ...boxStyle}}>
                    <span style={{color:"#D3D5D9"}}>Total user:</span>
                    <h1>290</h1>
                </Box> */}
      </Stack>
      <Box sx={{ padding: "20px 0", ...boxStyle }}>
        <Box sx={spreadStyle}>
          <span style={{ fontWeight: "bold", fontSize: "20px" }}>Detail</span>
        </Box>
        <TableAdmin data={summaryUserActivities} />
      </Box>
    </Container>
  );
};

export default DashBoard;
