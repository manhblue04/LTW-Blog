import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import "./styles.css";
import models from "../../modelData/models";

function TopBar() {
  //Lấy context cho topbar
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const userId = pathParts[2]; // /users/:userId or /photos/:userId

  let context = "User List";
  if (location.pathname.startsWith("/users/") && userId) {
    const user = models.userModel(userId);
    if (user) {
      context = `${user.first_name} ${user.last_name}`;
    }
  } 
  else if (location.pathname.startsWith("/photos/") && userId) {
    const user = models.userModel(userId);
    if (user) {
      context = `Photos of ${user.first_name} ${user.last_name}`;
    }
  }
  //END lấy context cho topbar
  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" color="inherit">
          ManhBlue
        </Typography>
        <Typography variant="h5" color="inherit">
          {context}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;