import { useRef, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert, CircularProgress } from "@mui/material";
import fetchModel from "../../lib/fetchModelData";

function AddPhotoDialog({ open, onClose, onSuccess }) {
  const fileInputRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    setError("");
    const file = fileInputRef.current?.files[0];
    if (!file) {
      setError("Vui lòng chọn file ảnh");
      return;
    }
    const formData = new FormData();
    formData.append("photo", file);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/photo/photos/new", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Lỗi khi tải ảnh");
      } else {
        if (onSuccess) onSuccess(data.photo);
        onClose();
      }
    } catch (e) {
      setError("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm ảnh mới</DialogTitle>
      <DialogContent>
        <input type="file" accept="image/*" ref={fileInputRef} />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Hủy</Button>
        <Button onClick={handleUpload} disabled={loading} variant="contained">
          {loading ? <CircularProgress size={20} /> : "Tải lên"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddPhotoDialog;
