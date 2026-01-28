import { useState, useEffect } from "react";
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

  const [tipoUsuario, setTipoUsuario] = useState("Usuario");
  const [generos, setGeneros] = useState([]);

  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fecha_nacimiento: "",
    id_genero: "",
    telefono: "",
    email: "",
    password: "",
    id_rol: "",
  });

  const [Conductor, setConductor] = useState({
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

  const camposChoferObligatorios = [
    "licencia",
    "vencimientoLicencia",
    "vencimientoCarnet",
    "poliza",
    "vencimientoSeguro",
    "numeroMotor",
    "numeroChassis",
    "patente",
    "marca",
    "modelo",
    "anio",
    "tipoVehiculo",
  ];

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
  const [roles, setRoles] = useState([]);
  const [usuarioCreado, setUsuarioCreado] = useState(false);

  const steps =
    tipoUsuario === "Conductor"
      ? ["Datos personales", "Confirmar", "Datos de Conductor", "Fotos"]
      : ["Datos personales", "Confirmar"];

  const handleUsuarioChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleConductorChange = (e) => {
    const { name, value } = e.target;
    setConductor({ ...Conductor, [name]: value });
  };

  const validarUsuario = () => {
    const errores = {};

    if (!usuario.nombre.trim()) errores.nombre = "Nombre requerido";
    if (!usuario.apellido.trim()) errores.apellido = "Apellido requerido";
    if (!usuario.dni.trim()) errores.dni = "DNI requerido";
    if (!usuario.telefono.trim()) errores.telefono = "Teléfono requerido";
    if (!usuario.email.trim()) errores.email = "Email requerido";
    if (!usuario.password.trim()) errores.password = "Contraseña requerida";

    // ejemplo simple de email
    if (usuario.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email)) {
      errores.email = "Email inválido";
    }

    setErroresUsuario(errores);

    return Object.keys(errores).length === 0;
  };

  const crearUsuario = async () => {
    const idRol = obtenerIdRol();

    if (!idRol) {
      alert("No se pudo determinar el rol del usuario");
      throw new Error("Rol no encontrado");
    }

    const payload = {
      nombre_usuario: usuario.nombre,
      apellido_usuario: usuario.apellido,
      dni: usuario.dni,
      fecha_nacimiento: usuario.fecha_nacimiento,
      id_genero: usuario.id_genero,
      telefono_usuario: usuario.telefono,
      email_usuario: usuario.email,
      password: usuario.password,
      id_rol: idRol,
    };

    const res = await axiosTaxi.post("/usuarios/crearUsuario", payload);
    setIdUsuario(res.data.userId);
    return res.data.userId;
  };

  const crearConductor = async (userId) => {
    const payload = {
      id_usuario: userId,
      ...Conductor,
    };

    const res = await axiosTaxi.post("/conductores/crearConductor", payload);
    setIdConductor(res.data.id_conductor);
  };
  const obtenerGeneros = async () => {
    try {
      const { data } = await axiosTaxi.get("/generos/obtenerGenero");
      setGeneros(data?.result || []);
    } catch (error) {
      console.error("Error al obtener géneros:", error);
      alert("No se pudieron cargar los géneros");
    }
  };
  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      setUsuario({
        nombre: "",
        apellido: "",
        dni: "",
        telefono: "",
        email: "",
        password: "",
        fechaNacimiento: "",
        id_genero: "",
        id_rol: "",
      });
      setChofer({});
      setImagenes({});
      setUsuarioCreado(false);
    }
  }, [open]);

  const obtenerRoles = async () => {
    try {
      const { data } = await axiosTaxi.get("/roles/obtenerRol");
      setRoles(data?.result || []);
    } catch (error) {
      console.error("Error al obtener roles:", error);
      alert("No se pudieron cargar los roles");
    }
  };

  const obtenerIdRol = () => {
    if (!roles.length) return null;

    const nombreBuscado = tipoUsuario === "conductor" ? "conductor" : "usuario";

    const rol = roles.find((r) => r.nombre_rol.toLowerCase() === nombreBuscado);

    return rol?.id_rol || null;
  };

  const faltanDatosChofer = () => {
    return camposChoferObligatorios.filter((campo) => {
      const valor = chofer[campo];
      return (
        valor === undefined || valor === null || valor.toString().trim() === ""
      );
    });
  };

  const handleNext = async () => {
    try {
      setLoading(true);

      // =========================
      // PASO 0 → DATOS PERSONALES
      // =========================
      if (activeStep === 0) {
        const {
          nombre,
          apellido,
          dni,
          fecha_nacimiento,
          id_genero,
          email,
          password,
        } = usuario;

        if (
          !nombre ||
          !apellido ||
          !dni ||
          !fecha_nacimiento ||
          !id_genero ||
          !email ||
          !password
        ) {
          alert("Completá todos los datos personales obligatorios");
          return;
        }

        const esValido = validarUsuario();
        if (!esValido) return;

        setActiveStep((prev) => prev + 1);
        return;
      }

      // =========================
      // PASO 1 → CONFIRMAR → CREAR USUARIO
      // =========================
      // Paso 1 → Confirmar → crear usuario (UNA SOLA VEZ)
      if (activeStep === 1) {
        let userId = idUsuario;

        if (!usuarioCreado) {
          userId = await crearUsuario();
          setUsuarioCreado(true);
        }

        if (tipoUsuario === "comun") {
          onSuccess?.();
          onClose();
          return;
        }

        setActiveStep((prev) => prev + 1);
        return;
      }

      // =========================
      // PASO 2 → DATOS DE Conductor
      // =========================
      if (activeStep === 2 && tipoUsuario === "chofer") {
        const faltantes = faltanDatosChofer();

        if (faltantes.length > 0) {
          alert(
            `Para continuar, el conductor debe completar TODOS los datos.\n\nFaltan:\n- ${faltantes.join(
              "\n- ",
            )}`,
          );
          return;
        }

        await crearChofer(idUsuario);
        setActiveStep((prev) => prev + 1);
        return;
      }

      // =========================
      // PASO 3 → FOTOS
      // =========================
      if (activeStep === steps.length - 1 && tipoUsuario === "Conductor") {
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

      // Fallback (por si cambia el flujo)
      setActiveStep((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      alert("Error al crear el usuario / Conductor");
    } finally {
      setLoading(false);
    }
  };

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
  const rolesPermitidos = roles.filter((r) =>
    ["usuario", "conductor"].includes(r.nombre_rol.toLowerCase()),
  );

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
            <TextField
              label="Fecha de nacimiento"
              type="date"
              name="fecha_nacimiento"
              InputLabelProps={{ shrink: true }}
              value={usuario.fecha_nacimiento}
              onChange={handleUsuarioChange}
              required
            />
            <TextField
              select
              label="Género"
              name="id_genero"
              value={usuario.id_genero}
              onChange={handleUsuarioChange}
              required
              SelectProps={{ native: true }}
            >
              <option value=""></option>
              {generos.map((g) => (
                <option key={g.id_genero} value={g.id_genero}>
                  {g.nombre_genero}
                </option>
              ))}
            </TextField>

            <Box gridColumn="1 / -1">
              <Typography>Tipo de usuario</Typography>

              <RadioGroup
                row
                value={tipoUsuario}
                onChange={(e) => setTipoUsuario(e.target.value)}
              >
                {rolesPermitidos.map((rol) => {
                  const value =
                    rol.nombre_rol.toLowerCase() === "conductor"
                      ? "Conductor"
                      : "Usuario";

                  return (
                    <FormControlLabel
                      key={rol.id_rol}
                      value={value}
                      control={<Radio />}
                      label={
                        rol.nombre_rol.toLowerCase() === "conductor"
                          ? "Conductor"
                          : "Usuario"
                      }
                    />
                  );
                })}
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
              required
              onChange={handleConductorChange}
            />

            <TextField
              label="Vencimiento Licencia"
              type="date"
              name="vencimientoLicencia"
              required
              InputLabelProps={{ shrink: true }}
              onChange={handleConductorChange}
            />

            <TextField
              label="Vencimiento Carnet"
              type="date"
              name="vencimientoCarnet"
              required
              InputLabelProps={{ shrink: true }}
              onChange={handleConductorChange}
            />

            <TextField
              label="Vencimiento Seguro"
              type="date"
              name="vencimientoSeguro"
              required
              InputLabelProps={{ shrink: true }}
              onChange={handleConductorChange}
            />

            <TextField
              label="Póliza"
              name="poliza"
              required
              onChange={handleConductorChange}
            />

            <TextField
              label="Patente"
              name="patente"
              required
              onChange={handleConductorChange}
            />

            <TextField
              label="Marca"
              name="marca"
              required
              onChange={handleConductorChange}
            />

            <TextField
              label="Modelo"
              name="modelo"
              required
              onChange={handleConductorChange}
            />

            <TextField
              label="Año"
              name="anio"
              type="number"
              required
              onChange={handleConductorChange}
            />

            <TextField
              label="Tipo de vehículo"
              name="tipoVehiculo"
              required
              onChange={handleConductorChange}
            />

            <TextField
              label="Número de motor"
              name="numeroMotor"
              required
              onChange={handleConductorChange}
            />

            <TextField
              label="Número de chasis"
              name="numeroChassis"
              required
              onChange={handleConductorChange}
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
        {activeStep > 0 && !usuarioCreado && (
          <Button onClick={handleBack}>Atrás</Button>
        )}

        <Button variant="contained" onClick={handleNext} disabled={loading}>
          {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAltaUsuarioStepper;
