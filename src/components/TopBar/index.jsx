import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AddPhotoDialog from "./AddPhotoDialog";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function TopBar({ user, onLogout, onAddPhotoSuccess }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [otherUserName, setOtherUserName] = useState("");

  useEffect(() => {
    // Lấy tên người khác nếu không phải trang của mình
    let userId = null;
    if (location.pathname.startsWith("/users/")) {
      userId = location.pathname.split("/").pop();
    } else if (location.pathname.startsWith("/photos/")) {
      userId = location.pathname.split("/").pop();
    }
    if (userId && (!user || user._id !== userId)) {
      fetchModel(`http://localhost:8080/api/user/${userId}/name`).then((data) => {
        if (data && data.first_name) {
          setOtherUserName(`${data.first_name} ${data.last_name}`);
        } else {
          setOtherUserName("");
        }
      });
    } else {
      setOtherUserName("");
    }
  }, [location.pathname, user]);

  // Xử lý logout
  const handleLogout = () => {
    // Xóa token FE, gọi API logout nếu muốn
    fetch("http://localhost:8080/api/user/admin/logout", { method: "POST" });
    if (onLogout) onLogout();
    navigate("/login");
  };

  let context = "User List";
  // Hiển thị tên đúng người đang xem ảnh
  if (location.pathname.startsWith("/users/")) {
    // Lấy userId từ URL
    const userId = location.pathname.split("/").pop();
    // Nếu là trang cá nhân của mình
    if (user && user._id === userId) {
      context = `${user.first_name} ${user.last_name}`;
    } else {
      context = otherUserName ? otherUserName : `User: ${userId}`;
    }
  } else if (location.pathname.startsWith("/photos/")) {
    const userId = location.pathname.split("/").pop();
    if (user && user._id === userId) {
      context = `Photos of ${user.first_name} ${user.last_name}`;
    } else {
      context = otherUserName ? `Photos of ${otherUserName}` : `Photos of ${userId}`;
    }
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