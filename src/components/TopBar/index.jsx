import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";
import { useEffect, useState } from "react";

function TopBar() {
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const userId = pathParts[2]; 
  
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (userId && (location.pathname.startsWith("/users/") || location.pathname.startsWith("/photos/"))) {
      fetchModel(`http://localhost:8080/api/user/${userId}`)
        .then(data => setUser(data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [userId, location.pathname]);

  let context = "User List";
  if (location.pathname.startsWith("/users/") && userId && user) {
    context = `${user.first_name} ${user.last_name}`;
  } else if (location.pathname.startsWith("/photos/") && userId && user) {
    context = `Photos of ${user.first_name} ${user.last_name}`;
  }

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