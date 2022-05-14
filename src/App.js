import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MenuBar from "./components/MenuBar";
import { AuthContext } from "./context/userContext";
import Profile from "./pages/Profile";
import Post from "./pages/Post";

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  const login = (token, userId, user) => {
    setToken(token);
    setUserId(userId);
    setUser(user);
    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
  useEffect(() => {
    const item = JSON.parse(localStorage.getItem("token"));
    const currentUSer = JSON.parse(localStorage.getItem("user"));

    if (item) {
      setToken(item);
      setUser(currentUSer);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, userId, user, login, logout }}>
      <Router>
        <Container>
          <MenuBar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/posts/:postId" element={<Post />} />
            {token ? (
              <React.Fragment>
                <Route exact path="/profile" element={<Profile />} />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/register" element={<Register />} />
              </React.Fragment>
            )}
          </Routes>
        </Container>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
