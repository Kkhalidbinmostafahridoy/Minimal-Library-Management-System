import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Header } = Layout;

export const AppNavbar: React.FC = () => {
  const location = useLocation();

  const getSelectedKey = () => {
    if (location.pathname === "/") return "1";
    if (location.pathname.startsWith("/add")) return "2";
    if (location.pathname.startsWith("/summary")) return "3";
    return "1";
  };

  return (
    <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
      <Menu theme="dark" mode="horizontal" selectedKeys={[getSelectedKey()]}>
        <Menu.Item key="1">
          <Link to="/">All Books</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/add">Add Book</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/summary">Borrow Summary</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};
