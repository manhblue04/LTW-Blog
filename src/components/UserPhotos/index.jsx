import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, CardMedia } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import "./styles.css";
import models from "../../modelData/models";

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const userPhotos = models.photoOfUserModel(userId);
    setPhotos(userPhotos);
  }, [userId]);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Photos
      </Typography>
      {photos.length === 0 ? (
        <Typography variant="body1">No photos found for this user.</Typography>
      ) : (
        photos.map((photo) => (
          <Card key={photo._id} sx={{ maxWidth: 500, marginBottom: 4 }}>
            <CardMedia
              component="img"
              height="300"
              image={`/images/${photo.file_name}`}
              alt="User's Photo"
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                <strong>Posted on:</strong>{" "}
                {new Date(photo.date_time).toLocaleString()}
              </Typography>

              {photo.comments && photo.comments.length > 0 ? (
                <div>
                  <Typography variant="h6" sx={{ marginTop: 2 }}>
                    Comments
                  </Typography>
                  {photo.comments.map((comment) => (
                    <div key={comment._id} style={{ marginTop: 10 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>
                          <Link to={`/users/${comment.user._id}`}>
                            {comment.user.first_name} {comment.user.last_name}
                          </Link>
                        </strong>{" "}
                        on {new Date(comment.date_time).toLocaleString()}:
                      </Typography>
                      <Typography variant="body1">{comment.comment}</Typography>
                    </div>
                  ))}
                </div>
              ) : (
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                  No comments yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default UserPhotos;