import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import * as Icons from "@mui/icons-material";
import ChoferesMap from "../../components/ChoferesMap/ChoferesMap";

const DirectionsCarIcon = Icons.DirectionsCar;
const PersonIcon = Icons.Person;
const AssignmentIcon = Icons.Assignment;
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { usuario } = useAuth();
  const [mostrarMapa, setMostrarMapa] = useState(false);
  // 🔹 datos mock (después lo conectamos a API/socket)
  const [stats, setStats] = useState({
    viajesActivos: 12,
    viajesHoy: 45,
    conductoresActivos: 8,
    usuariosRegistrados: 120,
  });

  const CardItem = ({ title, value, icon }) => (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        height: "100%",
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Box>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
  <Box p={3}>
    {mostrarMapa ? (
      <>
        {/* 🔹 Botón volver */}
        <Button
          variant="outlined"
          onClick={() => setMostrarMapa(false)}
          sx={{ mb: 2 }}
        >
          Volver
        </Button>

        {/* 🔹 MAPA */}
        <ChoferesMap />
      </>
    ) : (
      <>
        {/* 🔹 Bienvenida */}
        <Typography variant="h5" mb={3}>
          Bienvenido, {usuario?.nombre} 👋
        </Typography>

        {/* 🔹 Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <CardItem
              title="Viajes activos"
              value={stats.viajesActivos}
              icon={<DirectionsCarIcon fontSize="large" />}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CardItem
              title="Viajes hoy"
              value={stats.viajesHoy}
              icon={<AssignmentIcon fontSize="large" />}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CardItem
              title="Conductores activos"
              value={stats.conductoresActivos}
              icon={<PersonIcon fontSize="large" />}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CardItem
              title="Usuarios registrados"
              value={stats.usuariosRegistrados}
              icon={<PersonIcon fontSize="large" />}
            />
          </Grid>
        </Grid>

        {/* 🔹 Acciones rápidas */}
        <Box mt={5}>
          <Typography variant="h6" mb={2}>
            Acciones rápidas
          </Typography>

          <Grid container spacing={2}>
            <Grid item>
              <Button variant="contained">Ver viajes</Button>
            </Grid>

            <Grid item>
              <Button
                variant="contained"
                onClick={() => setMostrarMapa(true)}
              >
                Ver choferes
              </Button>
            </Grid>

            <Grid item>
              <Button variant="contained">Ver usuarios</Button>
            </Grid>
          </Grid>
        </Box>
      </>
    )}
  </Box>
);
};

export default Home;
