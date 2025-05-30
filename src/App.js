import './App.css';
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

// Component bảo vệ route, nếu chưa đăng nhập thì chuyển về /login
function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

const App = (props) => {
  // Quản lý trạng thái user đăng nhập
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  // Khi đăng nhập thành công, chuyển hướng về /users
  const handleLogin = (userObj) => {
    setUser(userObj);
    window.location.href = "/users";
  };

  // Khi logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Nếu chưa đăng nhập, chỉ hiển thị LoginRegister
  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar user={user} onLogout={handleLogout} />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              {user && <UserList />}
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                
                <Route path="/login" element={<LoginRegister onLogin={handleLogin} />} />

                <Route
                  path="/users/:userId"
                  element={
                    <RequireAuth>
                      <UserDetail />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/photos/:userId"
                  element={
                    <RequireAuth>
                      <UserPhotos />
                    </RequireAuth>
                  }
                />

                <Route
                  path="*"
                  element={
                    user ? <Navigate to="/users" /> : <Navigate to="/login" />
                  }
                />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
}

export default App;
