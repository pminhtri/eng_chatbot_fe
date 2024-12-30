import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Path = {
    Root: "/",
    Public: "/public",
    Login: "/auth/login",
    Register: "/auth/register",
    Admin: {
      index:"/admin",
      children: {
        dashBoard: "/admin/dashboard",
        questions: "/admin/questions"
      }
    },
    PageNotFound: "/page-not-found",
    PermissionDenied: "/permission-denied",
    Conversation: "/conversation",
  };
type TSideBarData = {
    nameLink: string,
    path: string,
    isActive: boolean
}
const sideBarData:TSideBarData[] = [
    {
        nameLink : "Dashboard",
        path : Path.Admin.children.dashBoard,
        isActive : true
    },
    {
        nameLink : "Questions",
        path : Path.Admin.children.questions,
        isActive : true
    },
]
const itemSideBarStyle = {
    padding: "10px 20px",
    borderRadius: "8px",
    color: "gray",
    fontWeight: "bold",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#E6D9FB",
      color: "black"
    },
  }
const SideBarAdmin = () => {
    const navigate = useNavigate()
    return ( 
        <Box sx={{padding:"10px", width:"250px"}}>
            {sideBarData.map(curr => (
                <Box sx={itemSideBarStyle} component={"div"} onClick={e=>navigate(curr.path)}>
                    {curr.nameLink}
                </Box>
            ))}
        </Box>
    );
}
 
export default SideBarAdmin;