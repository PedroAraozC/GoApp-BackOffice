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

const ModalUsuario = ({ open, onClose, usuario, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    dni: "",
    email_usuario: "",
    id_rol: "",
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Cargar roles y datos del usuario al abrir el modal
  useEffect(() => {
    if (open) {
      obtenerRoles();
      if (usuario) {
        setFormData({
          nombre_usuario: usuario.nombre_usuario || "",
          dni: usuario.dni || "",
          email_usuario: usuario.email_usuario || "",
          id_rol: usuario.id_rol || "",
        });
      }
    }
  }, [open, usuario]);

  const obtenerRoles = async () => {
    try {
      const { data } = await axiosTaxi.get("/roles/obtenerRol");
      console.log(data.result);
      setRoles(data?.result || []);
    } catch (error) {
      console.error("Error al obtener roles:", error);
      setError("No se pudieron cargar los roles");
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
        id_usuario: usuario.id_usuario,
        id_rol: formData.id_rol,
      };

      const { data } = await axiosTaxi.put(
        "/usuarios/editarRolUsuario",
        payload
      );
      console.log(data);
      if (data.status == "OK") {
        onSuccess("Rol actualizado correctamente");
      } else {
        setError(data.message || "Error al actualizar el rol");
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
    setFormData({ nombre_usuario: "", dni: "", email_usuario: "", id_rol: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600 }}>Editar Rol del Usuario</DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre"
              value={formData.nombre_usuario}
              onChange={handleInputChange("nombre_usuario")}
              variant="outlined"
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="DNI"
              value={formData.dni}
              onChange={handleInputChange("dni")}
              variant="outlined"
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email_usuario}
              onChange={handleInputChange("email_usuario")}
              variant="outlined"
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Rol</InputLabel>
              <Select
                value={formData.id_rol}
                onChange={handleInputChange("id_rol")}
                label="Rol"
              >
                {roles.map((rol) => (
                  <MenuItem key={rol.id_rol} value={rol.id_rol}>
                    {rol.nombre_rol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              backgroundColor: "#0000008e", // color al hover (azul institucional)
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)", // brillo suave
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

export default ModalUsuario;
