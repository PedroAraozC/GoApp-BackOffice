import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import axiosTaxi from "../../config/axiosTaxi";
import { LinearProgress } from "@mui/material";

const ModalAltaUsuarioStepper = ({ open, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [tipoUsuario, setTipoUsuario] = useState("comun");

  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
    password: "",
  });

  const [chofer, setChofer] = useState({
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

  const [imagenes, setImagenes] = useState({
    perfil: null,
    dni_frente: null,
    dni_dorso: null,
    tarjeta_verde: null,
    seguro: null,
    vehiculo_frente: null,
    vehiculo_lado_izq: null,
    vehiculo_lado_der: null,
  });
  const [progreso, setProgreso] = useState({});

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || !files[0]) return;

    setImagenes((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const [idUsuario, setIdUsuario] = useState(null);
  const [idConductor, setIdConductor] = useState(null);

  const steps =
    tipoUsuario === "chofer"
      ? ["Datos personales", "Confirmar", "Datos de chofer", "Fotos"]
      : ["Datos personales", "Confirmar"];

  const handleUsuarioChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleChoferChange = (e) => {
    const { name, value } = e.target;
    setChofer({ ...chofer, [name]: value });
  };

  const crearUsuario = async () => {
    const payload = {
      nombre_usuario: usuario.nombre,
      apellido_usuario: usuario.apellido,
      dni: usuario.dni,
      telefono_usuario: usuario.telefono,
      email_usuario: usuario.email,
      password: usuario.password,
    };

    const res = await axiosTaxi.post("/usuarios/crearUsuario", payload);
    setIdUsuario(res.data.userId);
    return res.data.userId;
  };

  const crearChofer = async (userId) => {
    const payload = {
      id_usuario: userId,
      ...chofer,
    };

    const res = await axiosTaxi.post("/conductores/crearChofer", payload);
    setIdConductor(res.data.id_conductor);
  };

  const handleNext = async () => {
    try {
      setLoading(true);

      // Paso 1 → Confirmar → crear usuario
      if (activeStep === 1) {
        const userId = await crearUsuario();

        if (tipoUsuario === "comun") {
          onSuccess?.();
          onClose();
          return;
        }

        setActiveStep((prev) => prev + 1);
        return;
      }

      // Paso 2 → Datos chofer → crear chofer
      if (activeStep === 2 && tipoUsuario === "chofer") {
        await crearChofer(idUsuario);
        setActiveStep((prev) => prev + 1);
        return;
      }

      // Paso 3 → Fotos → validar + subir imágenes
      if (activeStep === steps.length - 1 && tipoUsuario === "chofer") {
        const faltantes = faltanImagenesObligatorias();

        if (faltantes.length > 0) {
          alert(`Faltan imágenes obligatorias: ${faltantes.join(", ")}`);
          return;
        }

        await subirImagenes();
        onSuccess?.();
        onClose();
        return;
      }

      setActiveStep((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      alert("Error al crear el usuario/chofer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, []);

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const subirImagenes = async () => {
    for (const tipo of Object.keys(imagenes)) {
      if (!imagenes[tipo]) continue;

      const formData = new FormData();
      formData.append("imagen", imagenes[tipo]);
      formData.append("id_conductor", idConductor);
      formData.append("tipo_imagen", tipo);

      await axiosTaxi.post("/conductores/imagenes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );

          setProgreso((prev) => ({
            ...prev,
            [tipo]: percent,
          }));
        },
      });
    }
  };
  const imagenesObligatorias = ["perfil", "dni_frente", "dni_dorso", "seguro"];

  const faltanImagenesObligatorias = () => {
    return imagenesObligatorias.filter((tipo) => !imagenes[tipo]);
  };

  const ImagePreview = ({ label, name, file, onChange }) => {
    const previewUrl = file ? URL.createObjectURL(file) : null;

    return (
      <Box
        sx={{
          border: "1px dashed #ccc",
          borderRadius: 2,
          p: 1,
          textAlign: "center",
        }}
      >
        <Typography variant="body2" sx={{ mb: 1 }}>
          {label}
        </Typography>

        {previewUrl ? (
          <img
            src={previewUrl}
            alt={label}
            style={{
              width: "100%",
              height: 120,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          <Box
            sx={{
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
            }}
          >
            Sin imagen
          </Box>
        )}

        <Button
          component="label"
          size="small"
          sx={{ mt: 1 }}
          variant="outlined"
        >
          {file ? "Reemplazar" : "Seleccionar"}
          <input
            hidden
            type="file"
            accept="image/*"
            name={name}
            onChange={onChange}
          />
        </Button>
        {progreso[name] !== undefined && (
          <LinearProgress
            variant="determinate"
            value={progreso[name]}
            sx={{ mt: 1 }}
          />
        )}
      </Box>
    );
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              label="Nombre"
              name="nombre"
              onChange={handleUsuarioChange}
            />
            <TextField
              label="Apellido"
              name="apellido"
              onChange={handleUsuarioChange}
            />
            <TextField label="DNI" name="dni" onChange={handleUsuarioChange} />
            <TextField
              label="Teléfono"
              name="telefono"
              onChange={handleUsuarioChange}
            />
            <TextField
              label="Email"
              name="email"
              onChange={handleUsuarioChange}
            />
            <TextField
              label="Contraseña"
              type="password"
              name="password"
              onChange={handleUsuarioChange}
            />

            <Box gridColumn="1 / -1">
              <Typography>Tipo de usuario</Typography>
              <RadioGroup
                row
                value={tipoUsuario}
                onChange={(e) => setTipoUsuario(e.target.value)}
              >
                <FormControlLabel
                  value="comun"
                  control={<Radio />}
                  label="Usuario común"
                />
                <FormControlLabel
                  value="chofer"
                  control={<Radio />}
                  label="Chofer"
                />
              </RadioGroup>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6">Confirmar datos</Typography>
            <pre>{JSON.stringify({ usuario, tipoUsuario }, null, 2)}</pre>
          </Box>
        );

      case 2:
        return (
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              label="Licencia"
              name="licencia"
              onChange={handleChoferChange}
            />
            <TextField
              label="Vencimiento Licencia"
              type="date"
              name="vencimientoLicencia"
              InputLabelProps={{ shrink: true }}
              onChange={handleChoferChange}
            />
            <TextField
              label="Patente"
              name="patente"
              onChange={handleChoferChange}
            />
            <TextField
              label="Marca"
              name="marca"
              onChange={handleChoferChange}
            />
            <TextField
              label="Modelo"
              name="modelo"
              onChange={handleChoferChange}
            />
          </Box>
        );
      case 3:
        return (
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(160px, 1fr))"
            gap={2}
          >
            <Typography variant="caption" color="error">
              * Imágenes obligatorias
            </Typography>
            <ImagePreview
              label="Foto perfil *"
              name="perfil"
              file={imagenes.perfil}
              onChange={handleFileChange}
            />
            <ImagePreview
              label="DNI frente *"
              name="dni_frente"
              file={imagenes.dni_frente}
              onChange={handleFileChange}
            />
            <ImagePreview
              label="DNI dorso *"
              name="dni_dorso"
              file={imagenes.dni_dorso}
              onChange={handleFileChange}
            />
            <ImagePreview
              label="Tarjeta verde *"
              name="tarjeta_verde"
              file={imagenes.tarjeta_verde}
              onChange={handleFileChange}
            />
            <ImagePreview
              label="Seguro *"
              name="seguro"
              file={imagenes.seguro}
              onChange={handleFileChange}
            />
            <ImagePreview
              label="Vehículo frente *"
              name="vehiculo_frente"
              file={imagenes.vehiculo_frente}
              onChange={handleFileChange}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Alta de Usuario</DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box mt={3}>{renderStep()}</Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        {activeStep > 0 && <Button onClick={handleBack}>Atrás</Button>}
        <Button variant="contained" onClick={handleNext} disabled={loading}>
          {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAltaUsuarioStepper;
