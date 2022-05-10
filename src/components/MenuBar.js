import React, { useState, useContext } from "react";
import { Button, Menu } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/userContext";

const MenuBar = () => {
  const { token, logout } = useContext(AuthContext);
  const location = useLocation();
  const pathname = location.pathname;
  const path = pathname === "/" ? "home" : pathname.substring(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  return (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />

      <Menu.Menu position="right">
        {token ? (
          <React.Fragment>
            <Menu.Item
              name="profile"
              active={activeItem === "profile"}
              onClick={handleItemClick}
              as={Link}
              to="/profile"
            />
            <div
              style={{
                height: 50,
                width: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Button color="teal" onClick={logout}>
                Logout
              </Button>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Menu.Item
              name="login"
              active={activeItem === "login"}
              onClick={handleItemClick}
              as={Link}
              to="/login"
            />
            <Menu.Item
              name="register"
              active={activeItem === "register"}
              onClick={handleItemClick}
              as={Link}
              to="/register"
            />
          </React.Fragment>
        )}
      </Menu.Menu>
    </Menu>
  );
};

export default MenuBar;
