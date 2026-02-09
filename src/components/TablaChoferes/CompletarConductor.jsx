import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axiosTaxi from "../../config/axiosTaxi.js";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import DocumentoCard from "./DocumentoCard.jsx";
const baseUrl = import.meta.env.VITE_APP_RUTA;

const CompletarConductor = () => {
  const { id_usuario } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [snackbar, setSnackbar] = useState(null);
  const [idConductor, setIdConductor] = useState(null);
  const isEdit = !!idConductor;
  const puedeSubirArchivos = !!idConductor;
  const [tipoVehiculos, setTipoVehiculos] = useState([]);
  const [imagenes, setImagenes] = useState({
    perfil: null,
    dni_frente: null,
    dni_dorso: null,
    licencia: null,
    seguro: null,
    vehiculo: null,
  });

  const [form, setForm] = useState({
    licencia: "",
    vencimientoLicencia: "",
    vencimientoCarnet: "",
    poliza: "",
    vencimientoSeguro: "",
    numeroMotor: "",
    numeroChassis: "",
    patente: "",
    marca: "",
    modelo: "",
    anio: "",
    tipoVehiculo: "",
  });

  const tiposPermitidos = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  const formularioBloqueado = puedeSubirArchivos;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const obtenerTipoVehiculos = async () => {
    try {
      const { data } = await axiosTaxi.get("/tipoVehiculo/obtener");
      setTipoVehiculos(data.result || []);
    } catch (error) {
      console.error("Error cargando tipos de vehículo", error);
    }
  };

  const construirUrlAbsoluta = (ruta) => {
    if (!ruta) return null;

    // 🔧 Windows → URL
    const normalizada = ruta?.replace(/\\/g, "/");

    // Ya es URL completa
    if (normalizada.startsWith("http")) {
      return normalizada;
    }
    console.log("VITE_API_URL =", baseUrl);

    // Base pública donde servís imágenes

    return `${baseUrl}imagenes${normalizada}`;
  };

  const cargarImagenes = async (idConductor) => {
    try {
      const { data } = await axiosTaxi.get(
        `/conductores/${idConductor}/imagenes`,
      );

      if (data?.imagenes) {
        const nuevasImagenes = {};
        console.log(data.imagenes, "IMAGENES OBTENIDAS DEL SERVIDOR");
        Object.entries(data.imagenes).forEach(([tipo, ruta]) => {
          const urlCompleta = construirUrlAbsoluta(ruta);

          const esPdf = ruta.toLowerCase().endsWith(".pdf");

          nuevasImagenes[tipo] = {
            file: null,
            tipo: esPdf ? "pdf" : "image",
            preview: urlCompleta, // 🔥 ABSOLUTA
            existente: true,
            nombreArchivo: ruta.split("/").pop(),
          };
        });

        setImagenes((prev) => ({
          ...prev,
          ...nuevasImagenes,
        }));
      }
    } catch (error) {
      console.error("Error cargando imágenes:", error);
    }
  };

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setLoadingData(true);
      try {
        await obtenerTipoVehiculos();

        const { data } = await axiosTaxi.get(
          `/conductores/detalle/${id_usuario}`,
        );

        if (data?.result) {
          setIdConductor(data.result.id_conductor);
          await cargarImagenes(data.result.id_conductor);

          setForm({
            licencia: data.result.licencia || "",
            vencimientoLicencia: data.result.vencimiento_licencia || "",
            vencimientoCarnet: data.result.vencimiento_carnet || "",
            poliza: data.result.poliza_seguro || "",
            vencimientoSeguro: data.result.vencimiento_seguro || "",
            numeroMotor: data.result.nro_motor || "",
            numeroChassis: data.result.nro_chasis || "",
            patente: data.result.matricula || "",
            marca: data.result.marca_vehiculo || "",
            modelo: data.result.modelo_vehiculo || "",
            anio: data.result.año_vehiculo || "",
            tipoVehiculo: data.result.id_tipo_vehiculo || "",
          });
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        // no existe conductor → alta
      } finally {
        setLoadingData(false);
      }
    };

    cargarDatosIniciales();
  }, [id_usuario]);

  const subirImagenes = async () => {
    setLoading(true);
    try {
      // Subir solo las imágenes nuevas
      for (const tipo of Object.keys(imagenes)) {
        if (!imagenes[tipo]?.file) continue;

        const formData = new FormData();
        formData.append("imagen", imagenes[tipo].file);

        await axiosTaxi.post(
          `/conductores/imagenes?id_conductor=${idConductor}&tipo_imagen=${tipo}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      }

      setSnackbar({
        type: "success",
        message: "Archivos subidos correctamente",
      });

      // 🔄 Recargar las imágenes desde el servidor para reflejar el estado actualizado
      await cargarImagenes(idConductor);

      setTimeout(() => {
        navigate("/conductores-pendientes");
      }, 1200);
    } catch (error) {
      setSnackbar({
        type: "error",
        message: "Error al subir archivos",
      });
    } finally {
      setLoading(false);
    }
  };
  const crear = async () => {
    setLoading(true);
    try {
      const { data } = await axiosTaxi.post("/conductores/crearChofer", {
        id_usuario,
        ...form,
      });
      setIdConductor(data.id_conductor);
      setSnackbar({
        type: "success",
        message: "Conductor creado correctamente",
      });
    } catch (error) {
      setSnackbar({
        type: "error",
        message: "Error al crear conductor",
      });
    } finally {
      setLoading(false);
    }
  };

  const actualizar = async () => {
    setLoading(true);
    try {
      await axiosTaxi.put(`/conductores/actualizarChofer/${idConductor}`, form);

      setSnackbar({
        type: "success",
        message: "Datos actualizados correctamente",
      });
    } catch (error) {
      setSnackbar({
        type: "error",
        message: "Error al actualizar datos",
      });
    } finally {
      setLoading(false);
    }
  };

  const eliminarImagen = (key) => {
    setImagenes((prev) => ({
      ...prev,
      [key]: null,
    }));
  };

  const abrirPreview = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleFileChange = (key, file) => {
    if (!file) return;

    if (!tiposPermitidos.includes(file.type)) {
      setSnackbar({
        type: "error",
        message: "Solo se permiten imágenes o archivos PDF",
      });
      return;
    }

    const esPdf = file.type === "application/pdf";
    setImagenes((prev) => ({
      ...prev,
      [key]: {
        file,
        tipo: esPdf ? "pdf" : "image",
        preview: esPdf ? null : URL.createObjectURL(file),
        existente: false,
        nombreArchivo: file.name,
      },
    }));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      {loadingData ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress size={60} />
          <Typography sx={{ mt: 2 }} color="text.secondary">
            Cargando datos del conductor...
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              mb: 2,
              width: "fit-content",
            }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon sx={{ color: "black", mr: 1 }} />
            <Typography sx={{ color: "black" }}>Volver</Typography>
          </Box>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Completar datos del conductor
          </Typography>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              label="Licencia"
              name="licencia"
              onChange={handleChange}
              value={form.licencia}
              disabled={formularioBloqueado}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Vencimiento Licencia"
              type="date"
              name="vencimientoLicencia"
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
              value={form.vencimientoLicencia}
              disabled={formularioBloqueado}
            />
            <TextField
              label="Vencimiento Carnet"
              type="date"
              name="vencimientoCarnet"
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
              value={form.vencimientoCarnet}
              disabled={formularioBloqueado}
            />
            <TextField
              label="Póliza"
              name="poliza"
              onChange={handleChange}
              value={form.poliza}
              disabled={formularioBloqueado}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Vencimiento Seguro"
              type="date"
              name="vencimientoSeguro"
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
              value={form.vencimientoSeguro}
              disabled={formularioBloqueado}
            />
            <TextField
              label="Patente"
              name="patente"
              onChange={handleChange}
              value={form.patente}
              disabled={formularioBloqueado}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Marca"
              name="marca"
              onChange={handleChange}
              value={form.marca}
              disabled={formularioBloqueado}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Modelo"
              name="modelo"
              onChange={handleChange}
              value={form.modelo}
              disabled={formularioBloqueado}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Año"
              type="number"
              name="anio"
              onChange={handleChange}
              value={form.anio}
              disabled={formularioBloqueado}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Número Motor"
              name="numeroMotor"
              onChange={handleChange}
              value={form.numeroMotor}
              InputLabelProps={{ shrink: true }}
              disabled={formularioBloqueado}
            />
            <TextField
              label="Número Chasis"
              name="numeroChassis"
              onChange={handleChange}
              value={form.numeroChassis}
              InputLabelProps={{ shrink: true }}
              disabled={formularioBloqueado}
            />
            <FormControl fullWidth>
              <InputLabel id="tipo-vehiculo-label">Tipo de Vehículo</InputLabel>

              <Select
                labelId="tipo-vehiculo-label"
                label="Tipo de Vehículo"
                name="tipoVehiculo"
                value={form.tipoVehiculo}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                disabled={formularioBloqueado}
              >
                {tipoVehiculos.map((tipo) => (
                  <MenuItem
                    key={tipo.id_tipo_vehiculo}
                    value={tipo.id_tipo_vehiculo}
                  >
                    {tipo.nombre_tipo_vehiculo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={isEdit ? actualizar : crear}
              disabled={loading || formularioBloqueado}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : isEdit ? (
                "Guardar cambios"
              ) : (
                "Guardar"
              )}
            </Button>
          </Box>

          <Box sx={{ mt: 4, opacity: puedeSubirArchivos ? 1 : 0.5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Documentación del conductor
            </Typography>

            {!puedeSubirArchivos && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Primero debés guardar los datos del conductor para poder subir
                la documentación.
              </Alert>
            )}

            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fill, minmax(260px, 1fr))"
              gap={2}
            >
              {Object.entries(imagenes).map(([key, value]) => (
                <DocumentoCard
                  key={key}
                  label={key?.replace(/_/g, " ")}
                  data={value}
                  disabled={!puedeSubirArchivos}
                  onUpload={(file) => handleFileChange(key, file)}
                  onDelete={() => eliminarImagen(key)}
                  onPreview={abrirPreview}
                />
              ))}
            </Box>

            <Button
              sx={{ mt: 3 }}
              variant="contained"
              disabled={!puedeSubirArchivos || loading}
              onClick={subirImagenes}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Subir archivos"
              )}
            </Button>
          </Box>

          <Snackbar
            open={!!snackbar}
            autoHideDuration={3000}
            onClose={() => setSnackbar(null)}
          >
            <Alert severity={snackbar?.type}>{snackbar?.message}</Alert>
          </Snackbar>
        </>
      )}
    </Box>
  );
};

export default CompletarConductor;
