import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CrudDb() {
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [balance, setBalance] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [error, setError] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:8888/bank/read")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the posts!", error);
      });
  }, []);

  const validate = () => {
    const newError = {};
    if (!name) newError.name = "Name is required";
    if (!username) newError.username = "Username is required";
    if (!email) {
      newError.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newError.email = "Email address is invalid";
    }
    if (!phone) {
      newError.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(phone)) {
      newError.phone = "Phone number is invalid (must be 10 digits)";
    }
    if (!balance) {
      newError.balance = "Balance is required";
    } else if (isNaN(balance) || +balance <= 0) {
      newError.balance = "Balance must be a positive number";
    }
    setError(newError);
    return Object.keys(newError).length === 0; 
  };

  // Create a new post
  const createPost = () => {
    if (!validate()) return; 
    axios
      .post("http://localhost:8888/bank/add", {
        name,
        username,
        email,
        phone,
        balance,
      })
      .then((response) => {
        setPosts([...posts, response.data]);
        clearFields();
      })
      .catch((error) => {
        console.error("There was an error creating the post!", error);
      });
  };

// Update a post
const updatePost = (post) => {
  if (!validate()) return; 
  axios
    .put(`http://localhost:8888/bank/update/${post.id}`, post)
    .then((response) => {
      axios
        .get("http://localhost:8888/bank/read")
        .then((response) => {
          setPosts(response.data); 
        })
        .catch((error) => {
          console.error("There was an error fetching the updated posts!", error);
        });

      setEditingPost(null);
      clearFields();
    })
    .catch((error) => {
      console.error("There was an error updating the post!", error);
    });
};


  // Delete a post
  const deletePost = (id) => {
    axios
      .delete(`http://localhost:8888/bank/delete/${id}`)
      .then(() => {
        setPosts(posts.filter((post) => post.id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the post!", error);
      });
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
    setName(post.name);
    setUsername(post.username);
    setEmail(post.email);
    setPhone(post.phone);
    setBalance(post.balance);
  };

  const handleSaveClick = (event) => {
    event.preventDefault();
    if (editingPost) {
      updatePost({ ...editingPost, name, username, email, phone, balance });
    } else {
      createPost();
    }
  };

  const clearFields = () => {
    setName("");
    setUsername("");
    setEmail("");
    setPhone("");
    setBalance("");
  };

  return (
    <div className="container-fluid">
      <h1>React Axios CRUD Example</h1>
      <div className="row">
        <div className="col-md-6 half">
          <div className="card">
            <div className="card-body">
              <form className="user-form">
                <h5 className="card-title">Customer Details</h5>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {error.name && <p>{error.name}</p>}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {error.username && <p>{error.username}</p>}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {error.email && <p>{error.email}</p>}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {error.phone && <p>{error.phone}</p>}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Balance"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                  />
                  {error.balance && <p>{error.balance}</p>}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveClick}
                >
                  {editingPost ? "Update Post" : "Add Post"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6 half">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Customer List</h5>

              <ul className="list-group">
                {posts.map((post) => (
                  <li key={post.id} className="list-group-item">
                    <p>
                      <b>Name: </b>
                      {post.name}
                    </p>
                    <p>
                      <b>Username: </b>
                      {post.username}
                    </p>
                    <p>
                      <b>Email: </b>
                      {post.email}
                    </p>
                    <p>
                      <b>Phone: </b>
                      {post.phone}
                    </p>
                    <p>
                      <b>Balance: </b>
                      {post.balance}
                    </p>
                    <button
                      className="btn btn-sm btn-info float-right"
                      onClick={() => handleEditClick(post)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger float-right mr-2"
                      onClick={() => deletePost(post.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
