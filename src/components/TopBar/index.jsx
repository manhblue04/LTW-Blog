import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import AddPhotoDialog from "./AddPhotoDialog";
import "./styles.css";

function TopBar({ user, onLogout, onAddPhotoSuccess }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);

  // Xử lý logout
  const handleLogout = () => {
    // Xóa token FE, gọi API logout nếu muốn
    fetch("http://localhost:8080/api/user/admin/logout", { method: "POST" });
    if (onLogout) onLogout();
    navigate("/login");
  };

  let context = "User List";
  if (location.pathname.startsWith("/users/") && user) {
    context = `${user.first_name} ${user.last_name}`;
  } else if (location.pathname.startsWith("/photos/") && user) {
    context = `Photos of ${user.first_name} ${user.last_name}`;
  }

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" color="inherit">
          {context}
        </Typography>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button color="inherit" onClick={() => setOpenAdd(true)}>
              Add Photo
            </Button>
            <Typography variant="body1">Hi {user.first_name}</Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
            <AddPhotoDialog
              open={openAdd}
              onClose={() => setOpenAdd(false)}
              onSuccess={onAddPhotoSuccess}
            />
          </div>
        ) : (
          <Typography variant="body1">Please Login</Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;