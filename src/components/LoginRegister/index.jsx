import { useState } from "react";
import { Button, TextField, Typography, Card, CardContent, Box } from "@mui/material";
import fetchModel from "../../lib/fetchModelData";

function LoginRegister({ onLogin }) {
  // State cho đăng nhập
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // State cho đăng ký
  const [registerData, setRegisterData] = useState({
    login_name: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: ""
  });
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!loginName || !loginPassword) {
      setLoginError("Vui lòng nhập login_name và password");
      return;
    }
    try {
      const res = await fetchModel("http://localhost:8080/api/user/admin/login", {
        method: "POST",
        body: JSON.stringify({ login_name: loginName, password: loginPassword }),
      });
      if (!res || res.error) {
        setLoginError(res?.error || "Đăng nhập thất bại");
        return;
      }
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      onLogin(res.user);
    } catch (err) {
      setLoginError("Lỗi kết nối server");
    }
  };

  // Xử lý đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");
    const { login_name, password, confirmPassword, first_name, last_name } = registerData;
    if (!login_name || !password || !confirmPassword || !first_name || !last_name) {
      setRegisterError("Vui lòng nhập đầy đủ các trường bắt buộc");
      return;
    }
    if (password !== confirmPassword) {
      setRegisterError("Mật khẩu xác nhận không khớp");
      return;
    }
    try {
      const res = await fetchModel("http://localhost:8080/api/user/admin/register", {
        method: "POST",
        body: JSON.stringify({
          login_name: registerData.login_name,
          password: registerData.password,
          first_name: registerData.first_name,
          last_name: registerData.last_name,
          location: registerData.location,
          description: registerData.description,
          occupation: registerData.occupation
        }),
      });
      if (!res || res.error) {
        setRegisterError(res?.error || "Đăng ký thất bại");
        return;
      }
      setRegisterSuccess("Đăng ký thành công! Bạn có thể đăng nhập.");
      setRegisterData({
        login_name: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        location: "",
        description: "",
        occupation: ""
      });
    } catch (err) {
      setRegisterError("Lỗi kết nối server");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, justifyContent: "center", mt: 8 }}>
      {/* Đăng nhập */}
      <Card sx={{ maxWidth: 400, minWidth: 300 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Đăng nhập
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Login Name"
              value={loginName}
              onChange={e => setLoginName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              type="password"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="current-password"
            />
            {loginError && (
              <Typography color="error" variant="body2">
                {loginError}
              </Typography>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Đăng nhập
            </Button>
          </form>
        </CardContent>
      </Card>
      {/* Đăng ký */}
      <Card sx={{ maxWidth: 400, minWidth: 300 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Đăng ký tài khoản mới
          </Typography>
          <form onSubmit={handleRegister}>
            <TextField
              label="Login Name"
              value={registerData.login_name}
              onChange={e => setRegisterData({ ...registerData, login_name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              type="password"
              value={registerData.password}
              onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
              fullWidth
              margin="normal"
              autoComplete="new-password"
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={registerData.confirmPassword}
              onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              fullWidth
              margin="normal"
              autoComplete="new-password"
            />
            <TextField
              label="First Name"
              value={registerData.first_name}
              onChange={e => setRegisterData({ ...registerData, first_name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Last Name"
              value={registerData.last_name}
              onChange={e => setRegisterData({ ...registerData, last_name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Location"
              value={registerData.location}
              onChange={e => setRegisterData({ ...registerData, location: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={registerData.description}
              onChange={e => setRegisterData({ ...registerData, description: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Occupation"
              value={registerData.occupation}
              onChange={e => setRegisterData({ ...registerData, occupation: e.target.value })}
              fullWidth
              margin="normal"
            />
            {registerError && (
              <Typography color="error" variant="body2">
                {registerError}
              </Typography>
            )}
            {registerSuccess && (
              <Typography color="primary" variant="body2">
                {registerSuccess}
              </Typography>
            )}
            <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>
              Đăng ký
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginRegister;
