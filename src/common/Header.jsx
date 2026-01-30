import React, { useEffect, useState } from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { Markunread as MarkunreadIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Menu,
  MenuItem,
  Badge,
  Divider,
} from "@mui/material";
import axiosTaxi from "../config/axiosTaxi";

const Header = () => {
  const [currentDate, setCurrentDate] = useState("");
  const navigate = useNavigate();
  // const { userData, logout } = useUser();
  const [hasUnreadNotifications] = useState(true);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [selectedComunicado, setSelectedComunicado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Función handleLogout definida
  const handleLogout = () => {
    // logout(); // Descomenta cuando tengas el contexto de usuario
    navigate("/");
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedComunicado(null);
  };

  const getPriorityColor = (leido) => {
    return leido ? "#4caf50" : "#ff4444";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const navLinks = [
    { name: "Inicio", path: "/BackOffice/" },
    {
      name: "Choferes",
      subItems: [
        { name: "Pendientes", path: "#/conductores-pendientes" },
        { name: "validacion", path: "#/validacion-conductores" },
      ],
    },
    { name: "Usuarios", path: "#/Usuarios" },
    { name: "Salir", onclick: () => handleLogout(), path: "/" },
  ];

  const navLinksProv = [
    { name: "Inicio", path: "/BackOffice/" },
    { name: "Salir", onclick: () => handleLogout(), path: "/" },
  ];

  const navLinksAdmin = [
    { name: "Inicio", path: "/BackOffice/" },
    { name: "Salir", onclick: () => handleLogout(), path: "/" },
  ];

  let headerLinks = navLinks;

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const diasSemana = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ];
      const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
      const diaSemana = diasSemana[now.getDay()];
      const dia = now.getDate();
      const mes = meses[now.getMonth()];
      const año = now.getFullYear();
      const fechaFormateada = `${diaSemana} ${dia} de ${mes} de ${año}`;
      setCurrentDate(fechaFormateada);
    };

    updateDate();
    const interval = setInterval(updateDate, 86400000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="app-bar">
        <div className="container" style={{ position: "relative" }}>
          <div className="nav-options mb-2">
            {headerLinks.map((link, index) => (
              <div key={index} className="nav-item">
                <a
                  href={link.path}
                  className="nav-button"
                  onClick={
                    link.onclick
                      ? (e) => {
                          e.preventDefault();
                          link.onclick();
                        }
                      : undefined
                  }
                >
                  {link.name}
                </a>

                {link.subItems && (
                  <div className="dropdown-menu">
                    {link.subItems.map((sub, subIndex) => (
                      <a
                        key={subIndex}
                        href={sub.path}
                        className="dropdown-item"
                      >
                        {sub.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Icono de notificaciones */}
          <div
            style={{
              position: "absolute",
              right: "0",
              marginRight: "20px",
              top: "50%",
              width: "50px",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            className="notification-icon-responsive"
            onClick={handleNotificationClick}
          >
            <Badge color="error">
              <MarkunreadIcon
                sx={{
                  color: "white",
                  width: "100%",
                  height: 35,
                  // color: "#F2C947",
                  marginBottom: 2,
                  transition: "all 0.3s ease-in-out",
                  ":hover": { color: "#f0f0f0", transform: "scale(1.1)" },
                }}
              />
            </Badge>
          </div>

          {/* Menú desplegable de comunicados */}
          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleNotificationClose}
            PaperProps={{
              style: { maxHeight: 400, width: 350, marginTop: 8 },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ p: 2, pt: 0, borderBottom: 1, borderColor: "divider" }}>
              <Typography variant="h6">Comunicados</Typography>
            </Box>
          </Menu>
        </div>
      </header>

      {/* Modal comunicado */}
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        {selectedComunicado && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: getPriorityColor(
                      selectedComunicado.fecha_leido !== "0000-00-00 00:00:00",
                    ),
                  }}
                />
                <Typography variant="h6">
                  {selectedComunicado.titulo_comunicado}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Fecha: {formatDate(selectedComunicado.fecha_comunicado)} | Leído
                ✅
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                {selectedComunicado.comunicado}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleModalClose} variant="contained">
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <div className="user-info-container">
        <div className="container user-info-content">
          <div className="user-profile">
            <div className="user-avatar">
              <FontAwesomeIcon
                icon={faUser}
                size="2xl"
                className="me-2 mb-1 d-flex align-self-end"
              />
              <div className="d-flex flex-column">
                <p className="user-role">Usuario Conectado</p>
                <p className="user-id"></p>
              </div>
            </div>
          </div>
          <div className="date-display d-flex align-items-center">
            {currentDate}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
