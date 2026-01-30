// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Stepper,
//   Step,
//   StepLabel,
//   TextField,
//   Button,
//   Box,
//   Typography,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Snackbar,
//   Alert,
//   LinearProgress,
// } from "@mui/material";
// import axiosTaxi from "../../config/axiosTaxi";

// /* =========================
//    CONSTANTES
// ========================= */
// const TIPO_USUARIO = {
//   USUARIO: "usuario",
//   CONDUCTOR: "conductor",
// };

// /* =========================
//    COMPONENTE
// ========================= */
// const ModalAltaUsuarioStepper = ({ open, onClose, onSuccess }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const [tipoUsuario, setTipoUsuario] = useState(TIPO_USUARIO.USUARIO);

//   const [generos, setGeneros] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [tipoVehiculos, setTipoVehiculos] = useState([]);

//   const [usuario, setUsuario] = useState({
//     nombre: "",
//     apellido: "",
//     dni: "",
//     fecha_nacimiento: "",
//     id_genero: "",
//     telefono: "",
//     email: "",
//     password: "",
//   });

//   const [conductor, setConductor] = useState({
//     licencia: "",
//     vencimientoLicencia: "",
//     vencimientoCarnet: "",
//     poliza: "",
//     vencimientoSeguro: "",
//     numeroMotor: "",
//     numeroChassis: "",
//     patente: "",
//     marca: "",
//     modelo: "",
//     anio: "",
//     tipoVehiculo: "",
//   });

//   const [imagenes, setImagenes] = useState({
//     perfil: null,
//     dni_frente: null,
//     dni_dorso: null,
//     tarjeta_verde: null,
//     seguro: null,
//     vehiculo_frente: null,
//   });

//   const [progreso, setProgreso] = useState({});
//   const [idUsuario, setIdUsuario] = useState(null);
//   const [idConductor, setIdConductor] = useState(null);
//   const [usuarioCreado, setUsuarioCreado] = useState(false);

//   /* =========================
//      SNACKBAR
//   ========================= */
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "error",
//   });

//   const showSnackbar = (message, severity = "error") => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar((prev) => ({ ...prev, open: false }));
//   };

//   /* =========================
//      STEPS
//   ========================= */
//   const steps =
//     tipoUsuario === TIPO_USUARIO.CONDUCTOR
//       ? ["Datos personales", "Confirmar", "Datos del conductor", "Fotos"]
//       : ["Datos personales", "Confirmar"];

//   /* =========================
//      HANDLERS
//   ========================= */
//   const handleUsuarioChange = (e) => {
//     const { name, value } = e.target;
//     setUsuario((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleConductorChange = (e) => {
//     const { name, value } = e.target;
//     setConductor((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (!files?.[0]) return;
//     setImagenes((prev) => ({ ...prev, [name]: files[0] }));
//   };

//   const handleCancelar = async () => {
//     if (usuarioCreado && idUsuario) {
//       try {
//         await axiosTaxi.delete(`/usuarios/rollback/${idUsuario}`);
//       } catch (e) {
//         console.error("Error rollback:", e);
//       }
//     }

//     onClose();
//   };

//   /* =========================
//      VALIDACIONES
//   ========================= */
//   const validarUsuario = () => {
//     const campos = [
//       "nombre",
//       "apellido",
//       "dni",
//       "fecha_nacimiento",
//       "id_genero",
//       "email",
//       "password",
//     ];
//     return campos.every((c) => usuario[c]?.toString().trim());
//   };

//   const camposChoferObligatorios = Object.keys(conductor);

//   const faltanDatosChofer = () =>
//     camposChoferObligatorios.filter((c) => !conductor[c]?.toString().trim());

//   const imagenesObligatorias = ["perfil", "dni_frente", "dni_dorso", "seguro"];

//   const faltanImagenesObligatorias = () =>
//     imagenesObligatorias.filter((i) => !imagenes[i]);

//   /* =========================
//      API
//   ========================= */
//   const obtenerGeneros = async () => {
//     const { data } = await axiosTaxi.get("/generos/obtenerGenero");
//     setGeneros(data?.result || []);
//   };

//   const obtenerRoles = async () => {
//     const { data } = await axiosTaxi.get("/roles/obtenerRol");
//     setRoles(data?.result || []);
//   };

//   const obtenerTipoVehiculos = async () => {
//     const { data } = await axiosTaxi.get("/tipoVehiculo/obtener");
//     setTipoVehiculos(data?.result || []);
//   };

//   const rolesPermitidos = roles.filter((r) =>
//     ["usuario", "conductor"].includes(r.nombre_rol.toLowerCase()),
//   );

//   const obtenerIdRol = () => {
//     const nombre =
//       tipoUsuario === TIPO_USUARIO.CONDUCTOR ? "conductor" : "usuario";
//     return roles.find((r) => r.nombre_rol.toLowerCase() === nombre)?.id_rol;
//   };

//   const crearUsuario = async () => {
//     const res = await axiosTaxi.post("/usuarios/crearUsuario", {
//       nombre_usuario: usuario.nombre,
//       apellido_usuario: usuario.apellido,
//       dni: usuario.dni,
//       fecha_nacimiento: usuario.fecha_nacimiento,
//       id_genero: usuario.id_genero,
//       telefono_usuario: usuario.telefono,
//       email_usuario: usuario.email,
//       password: usuario.password,
//       id_rol: obtenerIdRol(),
//     });

//     setIdUsuario(res.data.userId);
//     setUsuarioCreado(true);
//     return res.data.userId;
//   };

//   const crearConductor = async (userId) => {
//     console.log(conductor);
//     const res = await axiosTaxi.post("/conductores/crearChofer", {
//       id_usuario: userId,
//       ...conductor,
//     });
//     setIdConductor(res.data.id_conductor);
//     return res.data.id_conductor;
//   };

//   const subirImagenes = async () => {
//     for (const tipo of Object.keys(imagenes)) {
//       if (!imagenes[tipo]) continue;

//       const formData = new FormData();
//       formData.append("imagen", imagenes[tipo]);
//       formData.append("id_conductor", idConductor);
//       formData.append("tipo_imagen", tipo);

//       await axiosTaxi.post("/conductores/imagenes", formData, {
//         onUploadProgress: (e) => {
//           const percent = Math.round((e.loaded * 100) / e.total);
//           setProgreso((p) => ({ ...p, [tipo]: percent }));
//         },
//       });
//     }
//   };

//   /* =========================
//      HANDLE NEXT
//   ========================= */
//   const handleNext = async () => {
//     setLoading(true);

//     try {
//       if (activeStep === 0) {
//         if (!validarUsuario()) {
//           showSnackbar("Completá todos los datos personales", "warning");
//           return;
//         }
//         setActiveStep(1);
//         return;
//       }

//       if (activeStep === 1) {
//         if (!usuarioCreado) await crearUsuario();

//         if (tipoUsuario === TIPO_USUARIO.USUARIO) {
//           showSnackbar("Usuario creado correctamente", "success");
//           onSuccess?.();
//           onClose();
//           return;
//         }

//         setActiveStep(2);
//         return;
//       }

//       if (activeStep === 2) {
//         const faltantes = faltanDatosChofer();
//         if (faltantes.length) {
//           showSnackbar(
//             `Faltan datos del conductor: ${faltantes.join(", ")}`,
//             "warning",
//           );
//           return;
//         }

//         await crearConductor(idUsuario);
//         setActiveStep(3);
//         return;
//       }

//       if (activeStep === 3) {
//         const faltantes = faltanImagenesObligatorias();
//         if (faltantes.length) {
//           showSnackbar(
//             `Faltan imágenes obligatorias: ${faltantes.join(", ")}`,
//             "warning",
//           );
//           return;
//         }

//         await subirImagenes();
//         await axiosTaxi.post(`/usuarios/confirmar/${idUsuario}`);

//         showSnackbar("Conductor creado correctamente", "success");
//         onSuccess?.();
//         onClose();
//       }
//     } catch (error) {
//       const msg =
//         error?.response?.data?.message || "Error en el proceso de alta";
//       showSnackbar(msg, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBack = () => setActiveStep((s) => s - 1);

//   /* =========================
//      EFECTOS
//   ========================= */
//   useEffect(() => {
//     if (open) {
//       obtenerGeneros();
//       obtenerRoles();
//       obtenerTipoVehiculos();
//     }
//   }, [open]);

//   /* =========================
//      COMPONENTE IMAGEN
//   ========================= */
//   const ImagePreview = ({ label, name, file }) => {
//     const previewUrl = file ? URL.createObjectURL(file) : null;

//     return (
//       <Box sx={{ border: "1px dashed #ccc", borderRadius: 2, p: 1 }}>
//         <Typography variant="body2">{label}</Typography>
//         {previewUrl && (
//           <img
//             src={previewUrl}
//             alt={label}
//             style={{ width: "100%", height: 120, objectFit: "cover" }}
//           />
//         )}
//         <Button component="label" size="small" variant="outlined">
//           Seleccionar
//           <input hidden type="file" name={name} onChange={handleFileChange} />
//         </Button>
//         {progreso[name] !== undefined && (
//           <LinearProgress value={progreso[name]} variant="determinate" />
//         )}
//       </Box>
//     );
//   };

//   /* =========================
//      RENDER
//   ========================= */
//   const renderStep = () => {
//     switch (activeStep) {
//       case 0:
//         return (
//           <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
//             <TextField
//               label="Nombre"
//               name="nombre"
//               value={usuario.nombre}
//               onChange={handleUsuarioChange}
//             />
//             <TextField
//               label="Apellido"
//               name="apellido"
//               value={usuario.apellido}
//               onChange={handleUsuarioChange}
//             />
//             <TextField
//               label="DNI"
//               name="dni"
//               value={usuario.dni}
//               onChange={handleUsuarioChange}
//             />
//             <TextField
//               label="Teléfono"
//               name="telefono"
//               value={usuario.telefono}
//               onChange={handleUsuarioChange}
//             />
//             <TextField
//               label="Email"
//               name="email"
//               value={usuario.email}
//               onChange={handleUsuarioChange}
//             />
//             <TextField
//               label="Contraseña"
//               type="password"
//               name="password"
//               value={usuario.password}
//               onChange={handleUsuarioChange}
//             />
//             <TextField
//               label="Fecha de nacimiento"
//               type="date"
//               name="fecha_nacimiento"
//               value={usuario.fecha_nacimiento}
//               onChange={handleUsuarioChange}
//               InputLabelProps={{ shrink: true }}
//             />
//             <TextField
//               select
//               label="Género"
//               name="id_genero"
//               value={usuario.id_genero}
//               onChange={handleUsuarioChange}
//               SelectProps={{ native: true }}
//             >
//               <option value="" />
//               {generos.map((g) => (
//                 <option key={g.id_genero} value={g.id_genero}>
//                   {g.nombre_genero}
//                 </option>
//               ))}
//             </TextField>

//             <Box gridColumn="1 / -1">
//               <Typography>Tipo de usuario</Typography>
//               <RadioGroup
//                 row
//                 value={tipoUsuario}
//                 onChange={(e) => setTipoUsuario(e.target.value)}
//               >
//                 {rolesPermitidos.map((rol) => (
//                   <FormControlLabel
//                     key={rol.id_rol}
//                     value={rol.nombre_rol.toLowerCase()}
//                     control={<Radio />}
//                     label={rol.nombre_rol}
//                   />
//                 ))}
//               </RadioGroup>
//             </Box>
//           </Box>
//         );

//       case 1:
//         return <pre>{JSON.stringify({ usuario, tipoUsuario }, null, 2)}</pre>;

//       case 2:
//         return (
//           <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
//             <TextField
//               label="Licencia"
//               name="licencia"
//               required
//               value={conductor.licencia}
//               onChange={handleConductorChange}
//             />

//             <TextField
//               label="Vencimiento Licencia"
//               type="date"
//               name="vencimientoLicencia"
//               required
//               InputLabelProps={{ shrink: true }}
//               value={conductor.vencimientoLicencia}
//               onChange={handleConductorChange}
//             />

//             <TextField
//               label="Vencimiento Carnet"
//               type="date"
//               name="vencimientoCarnet"
//               required
//               InputLabelProps={{ shrink: true }}
//               value={conductor.vencimientoCarnet}
//               onChange={handleConductorChange}
//             />

//             <TextField
//               label="Vencimiento Seguro"
//               type="date"
//               name="vencimientoSeguro"
//               required
//               InputLabelProps={{ shrink: true }}
//               value={conductor.vencimientoSeguro}
//               onChange={handleConductorChange}
//             />

//             <TextField
//               label="Póliza"
//               name="poliza"
//               required
//               value={conductor.poliza}
//               onChange={handleConductorChange}
//             />

//             <TextField
//               label="Patente"
//               name="patente"
//               required
//               value={conductor.patente}
//               onChange={handleConductorChange}
//             />

//             <TextField
//               label="Marca"
//               name="marca"
//               required
//               value={conductor.marca}
//               onChange={handleConductorChange}
//             />

//             <TextField
//               label="Modelo"
//               name="modelo"
//               required
//               value={conductor.modelo}
//               onChange={handleConductorChange}
//             />

//             <TextField
//               label="Año"
//               name="anio"
//               type="number"
//               required
//               value={conductor.anio}
//               onChange={handleConductorChange}
//             />

//             {/* ✅ SELECT DE TIPO DE VEHÍCULO */}
//             <TextField
//               select
//               label="Tipo de vehículo"
//               name="tipoVehiculo"
//               required
//               value={conductor.tipoVehiculo}
//               onChange={handleConductorChange}
//               SelectProps={{ native: true }}
//             >
//               <option value=""></option>
//               {tipoVehiculos.map((tv) => (
//                 <option key={tv.id_tipo_vehiculo} value={tv.id_tipo_vehiculo}>
//                   {tv.nombre_tipo_vehiculo}
//                 </option>
//               ))}
//             </TextField>

//             <TextField
//               label="Número de motor"
//               name="numeroMotor"
//               required
//               value={conductor.numeroMotor}
//               onChange={handleConductorChange}
//             />

//             <TextField
//               label="Número de chasis"
//               name="numeroChassis"
//               required
//               value={conductor.numeroChassis}
//               onChange={handleConductorChange}
//             />
//           </Box>
//         );

//       case 3:
//         return (
//           <Box
//             display="grid"
//             gridTemplateColumns="repeat(auto-fill, minmax(160px, 1fr))"
//             gap={2}
//           >
//             {Object.keys(imagenes).map((k) => (
//               <ImagePreview key={k} label={k} name={k} file={imagenes[k]} />
//             ))}
//           </Box>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Dialog open={open} maxWidth="md" fullWidth>
//       <DialogTitle>Alta de Usuario</DialogTitle>
//       <DialogContent>
//         <Stepper activeStep={activeStep}>
//           {steps.map((s) => (
//             <Step key={s}>
//               <StepLabel>{s}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//         <Box mt={3}>{renderStep()}</Box>
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={() => handleCancelar()}>Cancelar</Button>
//         {activeStep > 0 && !usuarioCreado && (
//           <Button onClick={handleBack}>Atrás</Button>
//         )}
//         <Button variant="contained" onClick={handleNext} disabled={loading}>
//           {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
//         </Button>
//       </DialogActions>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={5000}
//         onClose={handleCloseSnackbar}
//       >
//         <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Dialog>
//   );
// };

// export default ModalAltaUsuarioStepper;


import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import axiosTaxi from "../../config/axiosTaxi";

const ModalAltaUsuarioStepper = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [generos, setGeneros] = useState([]);
  const [roles, setRoles] = useState([]);

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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const showSnackbar = (message, severity = "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleUsuarioChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const validarUsuario = () => {
    const campos = [
      "nombre",
      "apellido",
      "dni",
      "fecha_nacimiento",
      "id_genero",
      "email",
      "password",
      "id_rol",
    ];
    return campos.every((c) => usuario[c]?.toString().trim());
  };

  const obtenerGeneros = async () => {
    const { data } = await axiosTaxi.get("/generos/obtenerGenero");
    setGeneros(data?.result || []);
  };

  const obtenerRoles = async () => {
    const { data } = await axiosTaxi.get("/roles/obtenerRol");
    setRoles(data?.result || []);
  };

  const crearUsuario = async () => {
    setLoading(true);
    try {
      if (!validarUsuario()) {
        showSnackbar("Completá todos los campos obligatorios", "warning");
        return;
      }

      await axiosTaxi.post("/usuarios/crearUsuario", {
        nombre_usuario: usuario.nombre,
        apellido_usuario: usuario.apellido,
        dni: usuario.dni,
        fecha_nacimiento: usuario.fecha_nacimiento,
        id_genero: usuario.id_genero,
        telefono_usuario: usuario.telefono,
        email_usuario: usuario.email,
        password: usuario.password,
        id_rol: usuario.id_rol,
      });

      showSnackbar("Usuario creado correctamente", "success");
      onSuccess?.();
      handleCancelar();
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Error al crear el usuario";
      showSnackbar(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setUsuario({
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
    onClose();
  };

  useEffect(() => {
    if (open) {
      obtenerGeneros();
      obtenerRoles();
    }
  }, [open]);

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Alta de Usuario</DialogTitle>
      <DialogContent>
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={2}>
          <TextField
            label="Nombre"
            name="nombre"
            required
            value={usuario.nombre}
            onChange={handleUsuarioChange}
          />
          <TextField
            label="Apellido"
            name="apellido"
            required
            value={usuario.apellido}
            onChange={handleUsuarioChange}
          />
          <TextField
            label="DNI"
            name="dni"
            required
            value={usuario.dni}
            onChange={handleUsuarioChange}
          />
          <TextField
            label="Teléfono"
            name="telefono"
            value={usuario.telefono}
            onChange={handleUsuarioChange}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            required
            value={usuario.email}
            onChange={handleUsuarioChange}
          />
          <TextField
            label="Contraseña"
            type="password"
            name="password"
            required
            value={usuario.password}
            onChange={handleUsuarioChange}
          />
          <TextField
            label="Fecha de nacimiento"
            type="date"
            name="fecha_nacimiento"
            required
            value={usuario.fecha_nacimiento}
            onChange={handleUsuarioChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Género"
            name="id_genero"
            required
            value={usuario.id_genero}
            onChange={handleUsuarioChange}
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
            <TextField
              select
              label="Rol"
              name="id_rol"
              required
              fullWidth
              value={usuario.id_rol}
              onChange={handleUsuarioChange}
              SelectProps={{ native: true }}
            >
              <option value=""></option>
              {roles.map((rol) => (
                <option key={rol.id_rol} value={rol.id_rol}>
                  {rol.nombre_rol}
                </option>
              ))}
            </TextField>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancelar} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={crearUsuario} disabled={loading}>
          Crear Usuario
        </Button>
      </DialogActions>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default ModalAltaUsuarioStepper;