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
  Switch,
  FormControlLabel,
} from "@mui/material";
import axiosTaxi from "../../config/axiosTaxi";

const ModalUsuario = ({ open, onClose, usuario, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    dni: "",
    email_usuario: "",
    id_rol: "",
    habilita: 1,
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      obtenerRoles();
      if (usuario) {
        setFormData({
          nombre_usuario: usuario.nombre_usuario || "",
          dni: usuario.dni || "",
          email_usuario: usuario.email_usuario || "",
          id_rol: usuario.id_rol || "",
          habilita: usuario.habilita ?? 1,
        });
      }
    }
  }, [open, usuario]);

  const obtenerRoles = async () => {
    try {
      const { data } = await axiosTaxi.get("/roles/obtenerRol");
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

  const handleSwitchChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      habilita: event.target.checked ? 1 : 0,
    }));
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const payload = {
        id_usuario: usuario.id_usuario,
        id_rol: Number(formData.id_rol),
        habilita: Number(formData.habilita),
      };

      const { data } = await axiosTaxi.put(
        "/usuarios/editarUsuarioWeb",
        payload
      );

      if (data.status === "OK") {
        onSuccess("Usuario actualizado correctamente");
      } else {
        setError(data.message || "Error al actualizar el usuario");
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
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600 }}>
        Editar Usuario
      </DialogTitle>

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
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="DNI"
              value={formData.dni}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email_usuario}
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
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

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.habilita === 1}
                  onChange={handleSwitchChange}
                  color="primary"
                />
              }
              label={
                formData.habilita === 1
                  ? "Usuario Habilitado"
                  : "Usuario Deshabilitado"
              }
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: "black",
            color: "white",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#333" },
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