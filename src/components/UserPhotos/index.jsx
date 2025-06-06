import { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Button,
  IconButton
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

export default function UserPhotos({ reloadTrigger }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [commentErrors, setCommentErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editValue, setEditValue] = useState("");

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
  }, [userId, reloadTrigger]);

  // Hàm reload lại danh sách ảnh (dùng khi upload thành công)
  const reloadPhotos = () => {
    fetchModel(`http://localhost:8080/api/photo/photosOfUser/${userId}`)
      .then((data) => setPhotos(data || []))
      .catch(() => setPhotos([]));
  };

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



  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setEditValue(comment.comment);
  };
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditValue("");
  };

  
  const handleSaveEdit = async (photoId, commentId) => {

    console.log("photoId", photoId, "commentId", commentId);

    const newComment = editValue.trim();
    if (!newComment) return;

    // console.log("photoId", photoId, "commentId", commentId);


    try {
      const data = await fetchModel(`http://localhost:8080/api/photo/commentsOfPhoto/${photoId}/${commentId}`, {
        method: "PUT",
        body: JSON.stringify({ comment: newComment }),
      });

      if (!data || data.error) return;

      setPhotos((prevPhotos) =>
        prevPhotos.map((p) =>
          p._id === photoId
            ? {
                ...p,
                comments: p.comments.map((c) =>
                  c._id === commentId ? { ...c, comment: data.comment } : c
                ),
              }
            : p
        )
      );
      setEditingCommentId(null);
      setEditValue("");
    } catch (err) {}
  };

  return (
    <div style={{ padding: 20 }}>


      <Typography variant="h4" gutterBottom>
        Photos
      </Typography>


      {photos.length === 0 
      
      ? 
      
      (
        <Typography variant="body1">No photos found for this user.</Typography>
      ) 
      
      : 
      
      (
        photos.map((photo) => (
          <Card key={photo._id} sx={{ maxWidth: 500, marginBottom: 4 }}>
            <CardMedia
              component="img"
              height="300"
              image={`http://localhost:8080/images/${photo.file_name}`} 
              alt="User's Photo"
            />
            <CardContent>


              <Typography variant="body2" color="text.secondary">
                <strong>Posted on:</strong>{" "}
                {new Date(photo.date_time).toLocaleString()}
              </Typography>


              {photo.comments && photo.comments.length > 0 

              ? 
              
              (
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

                      
                      {/* {editingCommentId === comment._id 
                      
                      ? 
                      
                      (
                        <>
                          <input
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                          />
                          <button onClick={() => handleSaveEdit(photo._id, comment._id)}>Lưu</button>
                          <button onClick={handleCancelEdit}>Hủy</button>
                        </>
                      ) 
                      
                      :
                      
                      (
                        <>
                          <span>{comment.comment}</span>
                          {currentUser && comment.user?._id === currentUser._id && (
                            <button onClick={() => handleEditClick(comment)}>Sửa</button>
                          )}
                        </>
                      )} */}


                      <span>{comment.comment}</span>
                    </div>
                  ))}
                </div>
              ) 
              
              : 
              
              (
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