import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SummaryUserActivities } from "../../types/log";
import { getSummaryUserActivies } from "../../api";
import { Button } from "../../components/ui";
import { useAuthStore } from "../auth/store";
import { Path } from "../../Router";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import "./admin.css";
import { styled } from "@mui/material";

const StyleButton = styled(Button)({
  padding: "10px 100px",
  backgroundColor: "#00994d",
  color: "white",
  "&:hover": {
    backgroundColor: "white",
    color: "#00994d",
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

  const handleLogout = async () => {
    await logout();
    navigate(Path["Login"]);
  };

  useEffect(() => {
    const fetchUserLog = async () => {
      const data = await getSummaryUserActivies();
      setSummaryUserActivities(data);
    };
    fetchUserLog();
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
  };

  return (
    <div>
      <Container fixed>
        <Grid
          bgcolor={"#e6ffff"}
          container
          style={{ height: "100vh" }} // Full viewport height
          alignItems="center"
          justifyContent="center"
        >
          <Grid size={10}>
            <h2 style={{ textAlign: "center", color: "#00994d" }}>
              Welcome admin, list of users in below table
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <StyleButton
                size="small"
                variant="contained"
                text={"LOG OUT"}
                onClick={handleLogout}
              ></StyleButton>
            </div>
            <TableContainer
              sx={{ height: "270px", textAlign: "center" }}
              component={Paper}
            >
              <Table sx={{ tableLayout: "fixed" }} aria-label="simple table">
                <TableHead sx={{ bgcolor: "#00994d" }}>
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
                      currentPage * pageSize + pageSize
                    )
                    .map((row, index) => (
                      <TableRow className="data-row" hover key={index}>
                        <TableCell
                          sx={{ fontWeight: "bold" }}
                          component="th"
                          scope="row"
                        >
                          {currentPage * pageSize + index + 1}
                        </TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.total_messages}</TableCell>
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
