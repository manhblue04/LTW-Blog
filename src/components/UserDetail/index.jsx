import { Typography, Card, CardContent, Button } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";
import { useEffect, useState } from "react";

function UserDetail() {
  //Lấy thông tin người dùng từ URL
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editUser, setEditUser] = useState({});

  useEffect(() => {
    fetchModel(`http://localhost:8080/api/user/${userId}`)
      .then(data => {
        if (!data) {
          setUser(null);
          return;
        }
        setUser(data);
        setEditUser(data); // Khởi tạo dữ liệu sửa
      })
      .catch(() => setUser(null));
  }, [userId]);

  // Xử lý lưu thông tin đã sửa
  const handleSave = async () => {
    const res = await fetchModel(`http://localhost:8080/api/user/${userId}`, {
      method: "PUT",
      body: JSON.stringify(editUser),
    });
    if (res && !res.error) {
      setUser(res);
      setEditing(false);
    } else {
      alert(res?.error || "Lỗi cập nhật");
    }
  };

  if (!user) {
    return <Typography variant="h6">User not found</Typography>;
  }
  //END lấy thông tin người dùng từ URL
  const isMyPage = localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"))._id === userId;
  return (
    <Card sx={{ maxWidth: 600, margin: "auto", marginTop: 4, padding: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {user.first_name} {user.last_name}
        </Typography>
        {/* {editing ? (
          <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div style={{ marginBottom: 12 }}>
              <label><strong>Location:</strong></label>
              <input
                value={editUser.location || ""}
                onChange={e => setEditUser({ ...editUser, location: e.target.value })}
                style={{ marginLeft: 8, width: 200 }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label><strong>Occupation:</strong></label>
              <input
                value={editUser.occupation || ""}
                onChange={e => setEditUser({ ...editUser, occupation: e.target.value })}
                style={{ marginLeft: 8, width: 200 }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label><strong>Description:</strong></label>
              <input
                value={editUser.description || ""}
                onChange={e => setEditUser({ ...editUser, description: e.target.value })}
                style={{ marginLeft: 8, width: 300 }}
              />
            </div>
            <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>Lưu</Button>
            <Button onClick={() => setEditing(false)} variant="outlined">Hủy</Button>
          </form>
        ) : (
          <>
            <Typography variant="body1" color="text.secondary" paragraph>
              <strong>Location:</strong> {user.location || "N/A"}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              <strong>Occupation:</strong> {user.occupation || "N/A"}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              <strong>Description:</strong> {user.description || "N/A"}
            </Typography>
            {isMyPage && (
              <Button onClick={() => setEditing(true)} variant="outlined" sx={{ mb: 2 }}>Edit</Button>
            )}
          </>
        )} */}
        <Typography variant="body1" color="text.secondary" paragraph>
          <strong>Location:</strong> {user.location || "N/A"}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          <strong>Occupation:</strong> {user.occupation || "N/A"}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          <strong>Description:</strong> {user.description || "N/A"}
        </Typography>

        <Button
          component={Link}
          to={`/photos/${userId}`}
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          View Photos
        </Button>
      </CardContent>
    </Card>
  );
}

export default UserDetail;