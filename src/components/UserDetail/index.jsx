import { Typography, Card, CardContent, Button } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";
import { useEffect, useState } from "react";

function UserDetail() {
  //Lấy thông tin người dùng từ URL
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchModel(`http://localhost:8080/api/user/${userId}`)
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, [userId]);

  if (!user) {
    return <Typography variant="h6">User not found</Typography>;
  }
  //END lấy thông tin người dùng từ URL
  return (
    <Card sx={{ maxWidth: 600, margin: "auto", marginTop: 4, padding: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {user.first_name} {user.last_name}
        </Typography>
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