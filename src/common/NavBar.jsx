import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import appIcon from "../assets/app_icon.png";
import Header from "./Header";

export default function NavBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  // Definimos estas variables ya que fueron comentadas arriba
  const authenticated = false; // O puedes establecerlo en true si lo necesitas para pruebas
  const user = { nombre_persona: "Usuario de Prueba" }; // Objeto de usuario de prueba

  // const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            {/* <SideBar /> */}
            <div className="containerNav">
              <img
                src={appIcon}
                alt="Logo App"
                className="appIcon"
              />
              {/* <div className="tituloNav">PORTAL DE TESORERIA</div> */}
              <div className="tituloNav">Tucu Taxi</div>
              {
                // authenticated && (
                //   <div className="d-flex align-items-center">
                //     <p className="m-0 d-none d-md-block">
                //       {user?.nombre_persona}
                //     </p>
                //     <IconButton
                //       size="large"
                //       aria-label="account of current user"
                //       aria-controls="menu-appbar"
                //       aria-haspopup="true"
                //       onClick={handleMenu}
                //       color="inherit"
                //     >
                //       <AccountCircle />
                //     </IconButton>
                //     <Menu
                //       className="logOut"
                //       id="menu-appbar"
                //       anchorEl={anchorEl}
                //       anchorOrigin={{
                //         vertical: "top",
                //         horizontal: "right",
                //       }}
                //       keepMounted
                //       transformOrigin={{
                //         vertical: "top",
                //         horizontal: "right",
                //       }}
                //       open={Boolean(anchorEl)}
                //       onClose={handleClose}
                //     >
                //       {/* <MenuItem onClick={goToPerfil}>Mi perfil</MenuItem> */}
                //       {/* <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem> */}
                //     </Menu>
                //   </div>
                // )
              }
            </div>
          </Toolbar>
        </AppBar>
              <Header />
      </Box>
    </>
  );
}
