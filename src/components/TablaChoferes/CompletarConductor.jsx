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

const CompletarConductor = () => {
  const { id_usuario } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
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
  useEffect(() => {
    obtenerTipoVehiculos();
    const cargarConductor = async () => {
      try {
        const { data } = await axiosTaxi.get(
          `/conductores/detalle/${id_usuario}`,
        );

        if (data?.result) {
          setIdConductor(data.result.id_conductor);

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
      } catch {
        // no existe conductor → alta
      }
    };

    cargarConductor();
  }, [id_usuario]);

  const subirImagenes = async () => {
    try {
      for (const tipo of Object.keys(imagenes)) {
        if (!imagenes[tipo]) continue;

        const formData = new FormData();
        formData.append("imagen", imagenes[tipo]);
        formData.append("id_conductor", idConductor);
        formData.append("tipo_imagen", tipo);

        await axiosTaxi.post("/conductores/imagenes", formData);
      }

      setSnackbar({
        type: "success",
        message: "Archivos subidos correctamente",
      });

      setTimeout(() => {
        navigate("/conductores-pendientes");
      }, 1200);
    } catch (error) {
      setSnackbar({
        type: "error",
        message: "Error al subir archivos",
      });
    }
  };

  const crear = async () => {
    const { data } = await axiosTaxi.post("/conductores/crearChofer", {
      id_usuario,
      ...form,
    });
    setIdConductor(data.id_conductor);
  };

  const actualizar = async () => {
    await axiosTaxi.put(`/conductores/${idConductor}`, form);

    setSnackbar({
      type: "success",
      message: "Datos actualizados correctamente",
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Completar datos del conductor
      </Typography>

      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
        <TextField
          label="Licencia"
          name="licencia"
          onChange={handleChange}
          disabled={formularioBloqueado}
        />
        <TextField
          label="Vencimiento Licencia"
          type="date"
          name="vencimientoLicencia"
          InputLabelProps={{ shrink: true }}
          onChange={handleChange}
          disabled={formularioBloqueado}
        />
        <TextField
          label="Vencimiento Carnet"
          type="date"
          name="vencimientoCarnet"
          InputLabelProps={{ shrink: true }}
          onChange={handleChange}
          disabled={formularioBloqueado}
        />
        <TextField
          label="Póliza"
          name="poliza"
          onChange={handleChange}
          disabled={formularioBloqueado}
        />
        <TextField
          label="Vencimiento Seguro"
          type="date"
          name="vencimientoSeguro"
          InputLabelProps={{ shrink: true }}
          onChange={handleChange}
          disabled={formularioBloqueado}
        />
        <TextField
          label="Patente"
          name="patente"
          onChange={handleChange}
          disabled={formularioBloqueado}
        />
        <TextField
          label="Marca"
          name="marca"
          onChange={handleChange}
          disabled={formularioBloqueado}
        />
        <TextField
          label="Modelo"
          name="modelo"
          onChange={handleChange}
          disabled={formularioBloqueado}
        />
        <TextField
          label="Año"
          type="number"
          name="anio"
          onChange={handleChange}
          disabled={formularioBloqueado}
        />
        <TextField
          label="Número Motor"
          name="numeroMotor"
          onChange={handleChange}
          disabled={formularioBloqueado}
        />
        <TextField
          label="Número Chasis"
          name="numeroChassis"
          onChange={handleChange}
          disabled={formularioBloqueado}
        />
        <FormControl fullWidth>
          <InputLabel id="tipo-vehiculo-label">Tipo de Vehículo</InputLabel>

          <Select
            labelId="tipo-vehiculo-label"
            label="Tipo de Vehículo"
            name="tipoVehiculo"
            value={form.tipoVehiculo}
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
            Primero debés guardar los datos del conductor para poder subir la
            documentación.
          </Alert>
        )}

        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
          {Object.keys(imagenes).map((key) => (
            <Button
              key={key}
              variant="outlined"
              component="label"
              disabled={!puedeSubirArchivos}
            >
              Subir {key}
              <input
                hidden
                type="file"
                disabled={!puedeSubirArchivos}
                onChange={(e) =>
                  setImagenes({
                    ...imagenes,
                    [key]: e.target.files[0],
                  })
                }
              />
            </Button>
          ))}
        </Box>

        <Button
          sx={{ mt: 3 }}
          variant="contained"
          disabled={!puedeSubirArchivos}
          onClick={subirImagenes}
        >
          Subir archivos
        </Button>
      </Box>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
      >
        <Alert severity={snackbar?.type}>{snackbar?.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CompletarConductor;
