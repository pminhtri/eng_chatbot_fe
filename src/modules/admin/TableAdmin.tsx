import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FC, useState } from "react";
import { TableProp } from "../../types/admin";
import { Box, styled, TablePagination } from "@mui/material";

const CellStyle = {
  fontSize: "15px",
  color: "white",
};
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
export const TableAdmin: FC<TableProp> = (props) => {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const handleChangePage = (_event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };
  return (
    <Box sx={{ padding: "20px" }}>
      <TableContainer>
        <Table sx={{ tableLayout: "fixed" }} aria-label="simple table">
          <TableHead
            sx={{ bgcolor: "rgb(17,23,29)", position: "sticky", top: "0" }}
          >
            <TableRow>
              <TableCell align="center" sx={{ ...CellStyle, width: "30%" }}>
                No
              </TableCell>
              <TableCell align="center" sx={{ ...CellStyle, width: "50%" }}>
                Email user
              </TableCell>
              <TableCell align="center" sx={{ ...CellStyle, width: "20%" }}>
                Total requests
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.length ? (
              props.data
                .slice(
                  currentPage * pageSize,
                  currentPage * pageSize + pageSize
                )
                .map((row, index) => (
                  <StyledTableRow key={index}>
                    <TableCell component="th" scope="row" align="center">
                      <span>{currentPage * pageSize + index + 1}</span>
                    </TableCell>
                    <TableCell align="center">
                      <span>{row.email}</span>
                    </TableCell>
                    <TableCell align="center">
                      <b>{row.total_messages}</b>
                    </TableCell>
                  </StyledTableRow>
                ))
            ) : (
              <span>No data display ( choose a column has data )</span>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={props.data.length}
        rowsPerPage={pageSize}
        page={currentPage}
        onPageChange={handleChangePage}
      />
    </Box>
  );
};
