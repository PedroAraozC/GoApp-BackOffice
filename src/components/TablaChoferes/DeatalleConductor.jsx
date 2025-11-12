import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosTaxi from "../../config/axiosTaxi";

const DetalleConductor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [conductor, setConductor] = useState(null);
  const [loading, setLoading] = useState(true);

  const obtenerDetalle = async () => {
    try {
      const { data } = await axiosTaxi.get(`/validaciones/detalle/${id}`);
      setConductor(data?.result || null);
    } catch (error) {
      console.error("Error al obtener el detalle del conductor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDetalle();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!conductor) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">No se encontró información del conductor.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          mb: 3,
          width: "fit-content",
        }}
        onClick={() => navigate(-1)}
      >
        <ArrowBackIcon sx={{ color: "black", mr: 1 }} />
        <Typography sx={{ color: "black" }}>Volver</Typography>
      </Box>

      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Detalle del Conductor
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Datos Personales</Typography>
              <Typography><b>Nombre:</b> {conductor.nombre_usuario}</Typography>
              <Typography><b>DNI:</b> {conductor.dni}</Typography>
              <Typography><b>Fecha de Solicitud:</b> {new Date(conductor.fecha_solicitud).toLocaleDateString("es-AR")}</Typography>
              <Typography><b>Estado:</b> {conductor.nombre_estado}</Typography>
              <Typography><b>Observaciones:</b> {conductor.observaciones || "-"}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Documentación</Typography>
              <Typography><b>Licencia:</b> {conductor.licencia}</Typography>
              <Typography><b>Vencimiento:</b> {conductor.vencimiento_licencia}</Typography>
              <Typography><b>Seguro:</b> {conductor.seguro}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Vehículo</Typography>
              <Typography><b>Matrícula:</b> {conductor.matricula}</Typography>
              <Typography><b>N° Motor:</b> {conductor.nro_motor}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Fotos</Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {conductor.foto_conductor && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={conductor.foto_conductor}
                    alt="Foto del conductor"
                    sx={{ borderRadius: 2 }}
                  />
                )}
                {conductor.foto_vehiculo && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={conductor.foto_vehiculo}
                    alt="Foto del vehículo"
                    sx={{ borderRadius: 2 }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#000000",
            "&:hover": { backgroundColor: "#0000008a" },
          }}
        >
          Cambiar Estado
        </Button>
      </Box>
    </Box>
  );
};

export default DetalleConductor;
