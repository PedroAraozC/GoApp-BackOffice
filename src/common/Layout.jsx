import NavBar from "./NavBar";
import React from "react";

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

export default Layout;
