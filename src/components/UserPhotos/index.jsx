import { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Button,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [commentErrors, setCommentErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchModel(`http://localhost:8080/api/photo/photosOfUser/${userId}`)
      .then((data) => {
        if (!data) {
          setPhotos([]);
          return;
        }
        setPhotos(data);
      })
      .catch(() => setPhotos([]));
    // Lấy user hiện tại từ localStorage
    const u = localStorage.getItem("user");
    setCurrentUser(u ? JSON.parse(u) : null);
  }, [userId]);

  // Xử lý nhập bình luận
  const handleInputChange = (photoId, value) => {
    setCommentInputs((prev) => ({ ...prev, [photoId]: value }));
    setCommentErrors((prev) => ({ ...prev, [photoId]: "" }));
  };

  // Gửi bình luận mới
  const handleAddComment = async (photoId) => {
    const comment = commentInputs[photoId]?.trim();
    if (!comment) {
      setCommentErrors((prev) => ({ ...prev, [photoId]: "Nội dung không được rỗng" }));
      return;
    }
    try {
      // Sử dụng fetchModel thay cho fetch trực tiếp
      const data = await fetchModel(`http://localhost:8080/api/photo/commentsOfPhoto/${photoId}`, {
        method: "POST",
        body: JSON.stringify({ comment }),
      });
      if (!data || data.error) {
        setCommentErrors((prev) => ({ ...prev, [photoId]: data?.error || "Lỗi" }));
        return;
      }
      setPhotos((prevPhotos) =>
        prevPhotos.map((p) =>
          p._id === photoId
            ? { ...p, comments: [...(p.comments || []), data] }
            : p
        )
      );
      setCommentInputs((prev) => ({ ...prev, [photoId]: "" }));
    } catch (err) {
      setCommentErrors((prev) => ({ ...prev, [photoId]: "Lỗi kết nối server" }));
    }
  };

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
                          <Link to={`/users/${comment.user?._id}`}>
                            {comment.user?.first_name} {comment.user?.last_name}
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

              {/* Giao diện nhập bình luận mới */}
              {currentUser && (
                <div style={{ marginTop: 16 }}>
                  <TextField
                    label="Thêm bình luận"
                    value={commentInputs[photo._id] || ""}
                    onChange={(e) => handleInputChange(photo._id, e.target.value)}
                    fullWidth
                    size="small"
                    error={!!commentErrors[photo._id]}
                    helperText={commentErrors[photo._id]}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1 }}
                    onClick={() => handleAddComment(photo._id)}
                  >
                    Gửi
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default UserPhotos;