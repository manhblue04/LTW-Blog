function fetchModel(url, options = {}) {
  // Lấy token từ localStorage (nếu có)
  const token = localStorage.getItem("token");
  // Thêm header Authorization nếu có token
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json"
  };
  return fetch(url, { ...options, headers })
    .then(response => {
      if (!response.ok) {
        // Nếu lỗi 401 thì trả về null để FE xử lý chuyển hướng login
        if (response.status === 401) {
          return null;
        }
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
}

export default fetchModel;
