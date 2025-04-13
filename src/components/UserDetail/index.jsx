import React from "react";
import { Typography, Card, CardContent, Button } from "@mui/material";
import { useParams, Link } from "react-router-dom";

import "./styles.css";
import models from "../../modelData/models";

function UserDetail() {
  const { userId } = useParams();
  const user = models.userModel(userId);

  if (!user) {
    return <Typography variant="h6">User not found</Typography>;
  }

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