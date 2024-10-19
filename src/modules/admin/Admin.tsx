import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RequestsInWeek, SummaryUserActivities } from "../../types/log";
import { getRequestsInWeek, getSummaryUserActivies } from "../../api";
import { Button } from "../../components/ui";
import { useAuthStore } from "../auth/store";
import { Path } from "../../Router";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2"
import './admin.css';
import {styled} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { DAY_IN_WEEK } from "../../constants";

const StyleButton = styled(Button)({
  padding: "10px 100px",
  backgroundColor: "black",
  color: "white",
  "&:hover": {
    backgroundColor: "gray"
  },
});

const Admin = () => {
  const {
    actions: { logout },
  } = useAuthStore();
  const navigate = useNavigate();
  const [summaryUserActivities, setSummaryUserActivities] = useState<
    SummaryUserActivities[]
  >([]);
  const [currentDate,setCurrentdate] = useState(new Date())
  const [requestsInWeek,setRequestsInWeek] = useState<RequestsInWeek[]>([])
  const handleLogout = async () => {
    await logout();
    navigate(Path["Login"]);
  };

  useEffect(() => {
    const fetchUserLog = async () => {
      const data = await getSummaryUserActivies(currentDate);
      setSummaryUserActivities(data);
    };
    const fetchRequestsInWeek = async () => {
      const res = await getRequestsInWeek(currentDate)
      setRequestsInWeek(res)
    }
    fetchUserLog();
    fetchRequestsInWeek();
  }, []);

  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(0);

  const handleNextpage = () => {
    if (
      currentPage + 1 <
      Math.floor(summaryUserActivities.length / pageSize) + 1
    ) {
      setCurrentPage((e) => e + 1);
    }
  };

  const handlePreviospage = () => {
    if (currentPage + 1 > 1) {
      setCurrentPage((e) => e - 1);
    }
  }
  const showDetailByDate = async (index:number) => {
    const data = await getSummaryUserActivies(new Date(requestsInWeek[index].date.split("T")[0]));
    setSummaryUserActivities(data);
  }

  return (
    <div>
      <BarChart
      onItemClick={(event, column) => showDetailByDate(column.dataIndex)}
      dataset={requestsInWeek}
      xAxis={[{ scaleType: 'band', data:DAY_IN_WEEK, label: "Date" }]}
      series={[{dataKey:"requests",label:"Total messages"}]}
      width={900}
      height={600}
      />
      <Container fixed>
        <Grid
          container
          style={{ height: "100vh" }} // Full viewport height
          alignItems="center"
          justifyContent="center"
        >
          <Grid size={12}>
            <h2 style={{ textAlign: "center"}}>
              Welcome admin, list of users in below table
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "20px",
                gap: "30px"
              }}
            >
              <StyleButton
                size="small"
                variant="contained"
                text={"DASHBOARD"}
                onClick={() => {navigate('/')}}
              ></StyleButton>
              <StyleButton
                size="small"
                variant="contained"
                text={"LOG OUT"}
                onClick={handleLogout}
              ></StyleButton>
            </div>
            <TableContainer
              sx={{ height: "300px", textAlign: "center" }}
              component={Paper}
            >
              <Table sx={{ tableLayout: "fixed" }} aria-label="simple table">
                <TableHead sx={{ bgcolor: "black", position: "sticky", top: "0"}}>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "white", width: "20%" }}
                    >
                      No
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "white", width: "60%" }}
                    >
                      Email user
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "white", width: "20%" }}
                    >
                      Total messages
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {summaryUserActivities
                    .slice(
                      currentPage * pageSize,
                      currentPage * pageSize + pageSize,
                    )
                    .map((row, index) => (
                      <TableRow className="data-row" hover key={index}>
                        <TableCell
                          sx={{ fontWeight: "bold" }}
                          component="th"
                          scope="row"
                        >
                        <b>{currentPage * pageSize + index + 1}</b>
                        </TableCell>
                        <TableCell><b>{row.email}</b></TableCell>
                        <TableCell><b>{row.total_messages}</b></TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <StyleButton
                size="small"
                style={{ width: "20px" }}
                variant="contained"
                text={"<<"}
                onClick={handlePreviospage}
              ></StyleButton>
              <b style={{ margin: "10px" }}>
                Page {currentPage + 1} of{" "}
                {Math.floor(summaryUserActivities.length / pageSize) + 1}
              </b>
              <StyleButton
                size="small"
                variant="contained"
                text={">>"}
                onClick={handleNextpage}
              ></StyleButton>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Admin;
