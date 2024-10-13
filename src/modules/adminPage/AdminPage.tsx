import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { SummaryUserActivities } from '../../types/log';
import { getSummaryUserActivies } from '../../api';
import { Button } from '../../components/ui';

const AdminPage = () => {
    const [summaryUserActivities,setSummaryUserActivities] = useState<SummaryUserActivities[]>([])
    useEffect(()=>{
        const fetchUserLog = async () => {
            const data = await getSummaryUserActivies()
            setSummaryUserActivities(data)
        }
        fetchUserLog()
    },[])
    return ( 
        <div>
            <h1>Welcome to admin site, where you can track activities user</h1>
            <Button text={"logout"} />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell align="right">User email</TableCell>
                        <TableCell align="right">Total messages</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {summaryUserActivities.map((row,index) => (
                        <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {index + 1}
                            </TableCell>
                            <TableCell align="right">{row.email}</TableCell>
                            <TableCell align="right">{row.total_messages}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
        </div>
     );
}
 
export default AdminPage;