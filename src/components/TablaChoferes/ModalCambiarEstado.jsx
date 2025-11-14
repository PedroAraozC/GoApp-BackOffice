import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import axiosTaxi from "../../config/axiosTaxi";

const ModalCambiarEstado = ({ open, onClose, conductor, onSuccess }) => {
  const [formData, setFormData] = useState({
    id_estado_validacion: "",
    observaciones: "",
  });
  console.log(conductor);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Cargar estados disponibles y datos al abrir el modal
  useEffect(() => {
    if (open) {
      obtenerEstados();
      if (conductor) {
        setFormData({
          id_estado_validacion: conductor.id_estado_validacion || "",
          observaciones: conductor.observaciones || "",
        });
      }
    }
  }, [open, conductor]);

  const obtenerEstados = async () => {
    try {
      const { data } = await axiosTaxi.get("/estados/obtener");
      setEstados(data?.result || []);
      console.log(data);
    } catch (error) {
      console.error("Error al obtener estados:", error);
      setError("No se pudieron cargar los estados disponibles");
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const payload = {
        id_validacion: conductor.id_validacion,
        id_estado_validacion: formData.id_estado_validacion,
        observaciones: formData.observaciones,
      };

      const { data } = await axiosTaxi.put("/estados/cambiarEstado", payload);

      if (data.status === "OK") {
        onSuccess("Estado actualizado correctamente");
      } else {
        setError(data.message || "Error al actualizar el estado");
      }
    } catch (error) {
      console.error(error);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    setFormData({ id_estado_validacion: "", observaciones: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600 }}>
        Cambiar Estado de la Solicitud
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Nuevo Estado</InputLabel>
              <Select
                value={formData.id_estado_validacion}
                onChange={handleInputChange("id_estado_validacion")}
                label="Nuevo Estado"
              >
                {estados.map((estado) => (
                  <MenuItem
                    key={estado.id_estado_validacion}
                    value={estado.id_estado_validacion}
                  >
                    {estado.nombre_estado}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observaciones"
              multiline
              minRows={3}
              value={formData.observaciones}
              onChange={handleInputChange("observaciones")}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: "black",
            borderRadius: 1.8,
            color: "white",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#0000008e",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
            },
            "&:disabled": {
              backgroundColor: "#999",
              color: "#eee",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={22} sx={{ color: "white" }} />
          ) : (
            "Guardar Cambios"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCambiarEstado;
