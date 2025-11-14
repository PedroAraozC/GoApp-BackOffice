import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  DirectionsCar,
  Description,
  Badge,
  CameraAlt,
} from "@mui/icons-material";
import "../Tablas.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosTaxi from "../../config/axiosTaxi";

const DetalleConductor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const [conductor, setConductor] = useState(null);
  const [loading, setLoading] = useState(true);
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const obtenerDetalle = async () => {
    try {
      const { data } = await axiosTaxi.get(`/conductores/obtenerDetalle/${id}`);
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

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    try {
      return new Date(fecha).toLocaleDateString("es-AR");
    } catch {
      return "-";
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          width: "100%",
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f7f7f7",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );

  if (!conductor)
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">
          No se encontró información del conductor.
        </Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        p: { xs: 2, md: 4 },
        backgroundColor: "#f4f6f8",
      }}
    >
      {/* 🔙 Volver */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          mb: 3,
          width: "fit-content",
          transition: "0.2s",
          "&:hover": { opacity: 0.7 },
        }}
        onClick={() => navigate(-1)}
      >
        <ArrowBackIcon sx={{ color: "#000", mr: 1 }} />
        <Typography sx={{ color: "#000", fontWeight: 500 }}>Volver</Typography>
      </Box>

      {/* 🧾 Encabezado */}
      <div className={isSmall ? `taxi-header-small` : `taxi-header`}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{ width: "100", text: "center", p: 3, pt: 4 }}
            component="h4"
          >
            Detalle del Conductor
          </Typography>
        </Box>
      </div>
      {/* 🔹 Layout principal */}
      <Grid container spacing={3} mt={3}>
        {/* 🧍 Datos Personales */}
        <Grid item xs={12} md={6} lg={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0px 4px 16px rgba(0,0,0,0.06)",
              backgroundColor: "#fff",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Badge sx={{ color: "#1976d2", mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Datos Personales
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Nombre y Apellido
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {conductor?.nombre_usuario} {conductor?.apellido_usuario}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Usuario
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {conductor?.nombre_rol || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    DNI
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {conductor?.dni || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {conductor?.email_usuario || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Teléfono
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {conductor?.telefono_usuario || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Fecha de Solicitud
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatearFecha(conductor?.fecha_validacion)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Estado{" "}
                  </Typography>
                  <Chip
                    label={conductor?.nombre_estado || "DESCONOCIDO"}
                    color={
                      conductor?.nombre_estado === "APROBADO"
                        ? "success"
                        : conductor?.nombre_estado === "RECHAZADO"
                        ? "error"
                        : "warning"
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Observaciones
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {conductor?.observaciones || "-"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 📄 Documentación */}
        <Grid item xs={12} md={6} lg={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0px 4px 16px rgba(0,0,0,0.06)",
              backgroundColor: "#fff",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Description sx={{ color: "#1976d2", mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Documentación
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Licencia
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {conductor?.licencia || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Vencimiento Licencia
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatearFecha(conductor?.vencimiento_licencia)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Seguro
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {conductor?.seguro || "-"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 🚗 Vehículo */}
        <Grid item xs={12} md={6} lg={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0px 4px 16px rgba(0,0,0,0.06)",
              backgroundColor: "#fff",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <DirectionsCar sx={{ color: "#1976d2", mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Vehículo
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Marca
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {conductor?.marca_vehiculo || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Modelo
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {conductor?.modelo_vehiculo || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Año
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {conductor?.año_vehiculo || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Patente
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {conductor?.matricula || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    N° Motor
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {conductor?.nro_motor || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    N° Chasis
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {conductor?.nro_chasis || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Tipo de Vehículo
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {conductor?.nombre_tipo || "-"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 📷 Fotos (todas las imágenes) */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0px 4px 16px rgba(0,0,0,0.06)",
              backgroundColor: "#fff",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <CameraAlt sx={{ color: "#1976d2", mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Fotos
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={3}>
                {[
                  { label: "Foto de Perfil", src: conductor?.foto_perfil },
                  { label: "DNI Frente", src: conductor?.foto_dni_frente },
                  { label: "DNI Dorso", src: conductor?.foto_dni_dorso },
                  {
                    label: "Tarjeta Verde",
                    src: conductor?.foto_tarjeta_verde,
                  },
                  {
                    label: "Seguro del Taxi",
                    src: conductor?.foto_seguro_taxi,
                  },
                ].map((f, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      mb={1}
                      display="block"
                    >
                      {f.label}
                    </Typography>
                    {f.src ? (
                      <CardMedia
                        component="img"
                        sx={{
                          width: "100%",
                          height: 200,
                          borderRadius: 3,
                          objectFit: "cover",
                          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                        }}
                        image={f.src}
                        alt={f.label}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: 200,
                          borderRadius: 3,
                          backgroundColor: "#f5f5f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography color="text.secondary">Sin foto</Typography>
                      </Box>
                    )}
                  </Grid>
                ))}

                {/* 🚗 Fotos del Vehículo */}
                <Grid item xs={4}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    mb={1}
                    display="block"
                  >
                    Fotos del Vehículo
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    {[
                      { label: "Frente", src: conductor?.foto_vehiculo_frente },
                      {
                        label: "Lado Derecho",
                        src: conductor?.foto_vehiculo_derecho,
                      },
                      {
                        label: "Lado Izquierdo",
                        src: conductor?.foto_vehiculo_izquierdo,
                      },
                    ].map((f, i) => (
                      <Box key={i} sx={{ textAlign: "center" }}>
                        {f.src ? (
                          <CardMedia
                            component="img"
                            sx={{
                              width: 200,
                              height: 150,
                              borderRadius: 3,
                              objectFit: "cover",
                              boxShadow: "0px 3px 8px rgba(0,0,0,0.15)",
                              transition: "transform 0.2s ease",
                              "&:hover": { transform: "scale(1.05)" },
                            }}
                            image={f.src}
                            alt={f.label}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 200,
                              height: 150,
                              borderRadius: 3,
                              backgroundColor: "#f5f5f5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              color="text.secondary"
                              fontSize="0.8rem"
                            >
                              Sin foto
                            </Typography>
                          </Box>
                        )}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ mt: 0.5 }}
                        >
                          {f.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 🔘 Botón Cambiar Estado */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Button
          variant="contained"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            backgroundColor: "#000",
            borderRadius: 3,
            fontWeight: 600,
            letterSpacing: 0.6,
            boxShadow: "0px 3px 8px rgba(0,0,0,0.3)",
            "&:hover": { backgroundColor: "#000000d1" },
          }}
        >
          CAMBIAR ESTADO
        </Button>
      </Box>
    </Box>
  );
};

export default DetalleConductor;
