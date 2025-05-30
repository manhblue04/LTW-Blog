import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function UserList() {
  const [users, setUsers] = useState([]);

  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchModel("http://localhost:8080/api/user/count")
      .then(data => {
        if (!data) {
          setCount(0);
          return;
        }
        setCount(data.count);
      })
      .catch(() => setCount(0));
  }, [count]);


  useEffect(() => {
    fetchModel("http://localhost:8080/api/user/list")
      .then(data => {
        if (!data) {
          setUsers([]);
          return;
        }
        setUsers(data);
      })
      .catch(() => setUsers([]));
  }, []);

  return (
    <div>
      <Typography variant="body1">
        <strong>Total Users:</strong> {count}
        {/* This is the user list, which takes up of the window. */}
      </Typography>
      <List component="nav">
        {users.map((item) => (
          <React.Fragment key={item._id}>
            <ListItem component={Link} to={`/users/${item._id}`}>
              <ListItemText primary={`${item.first_name} ${item.last_name}`} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;