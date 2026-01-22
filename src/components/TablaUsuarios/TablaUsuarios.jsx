import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  Alert,
  Slide,
  TextField,
  CircularProgress,
  Snackbar,
  useMediaQuery,
  useTheme,
  Button,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import axiosTaxi from "../../config/axiosTaxi";
import "./Usuario.css";
import "../Tablas.css";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { LocalPrintshop as LocalPrintshopIcon } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import app_icon from "../../assets/app_icon.png";
import { useNavigate } from "react-router-dom";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "@mui/material/IconButton";
import ModalInfo from "../ModaInfo/ModalInfo";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import ModalUsuario from "./ModalUsuario";
import ModalAltaUsuario from "./ModalAltaUsuario.jsx";
import { esES } from "@mui/x-data-grid/locales";

const TablaUsuarios = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isVerySmall = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [modalInfo, setModalInfo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("warning");
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const showSnackbar = (message, severity = "warning") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const obtenerUsuarios = async () => {
    try {
      setLoading(true);
      const { data } = await axiosTaxi.get(`/usuarios/obtenerUsuarios`);
      console.log(data?.result, "usuarios obtenidos");
      setUsuarios(data?.result || []);
      if (!data?.result || data.result?.length === 0) {
        showSnackbar("No se encontraron usuarios.", "info");
      }
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      showSnackbar("Error al obtener los usuarios.", "error");
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  useEffect(() => {
    if (!searchText) {
      setFilteredUsuarios(usuarios);
      return;
    }
    const lowerSearch = searchText.toLowerCase();
    const filtered = usuarios.filter((row) =>
      Object.values(row).some(
        (value) =>
          value && value.toString().toLowerCase().includes(lowerSearch),
      ),
    );
    setFilteredUsuarios(filtered);
  }, [searchText, usuarios]);

  const AgregarUsuario = async () => {
    setOpenModalAgregar(true);
  };

  const imprimirTabla = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // ✅ Crear canvas para convertir imagen a base64
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = app_icon;

    img.onload = () => {
      try {
        // Convertir imagen a canvas y luego a base64
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL("image/png");

        // Ahora usar imgData en lugar de img
        doc.addImage(imgData, "PNG", 40, 20, 50, 50);

        doc.setFontSize(18);
        const title = "Listado de Usuarios";
        const textWidth = doc.getTextWidth(title);
        doc.text(title, (pageWidth - textWidth) / 2, 50);

        const columns = [
          { header: "Nombre", dataKey: "nombre_usuario" },
          { header: "Apellido", dataKey: "apellido_usuario" },
          { header: "DNI", dataKey: "dni" },
          { header: "Correo electrónico", dataKey: "email_usuario" },
          { header: "Rol", dataKey: "nombre_rol" },
        ];

        const rows = filteredUsuarios.map((row) => ({
          nombre_usuario: row.nombre_usuario || "",
          apellido_usuario: row.apellido_usuario || "",
          dni: row.dni || "",
          email_usuario: row.email_usuario || "",
          nombre_rol: row.nombre_rol || "",
        }));

        autoTable(doc, {
          startY: 75,
          head: [columns.map((col) => col.header)],
          body: rows.map((row) => columns.map((col) => row[col.dataKey])),
          styles: { fontSize: 10, halign: "center" },
          headStyles: { fillColor: [0, 0, 0], halign: "center" },
          margin: { left: 40, right: 40 },
        });

        const pdfUrl = doc.output("bloburl");
        window.open(pdfUrl, "_blank");
      } catch (error) {
        console.error("Error al generar el PDF:", error);
        showSnackbar("Error al generar el PDF", "error");
      }
    };

    img.onerror = (err) => {
      console.error("❌ Error al cargar la imagen del logo", err);
      showSnackbar("No se pudo cargar el logo", "error");
    };
  };
  const handleEditarRol = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEditar(true);
  };

  const columnas = [
    {
      field: "nombre_usuario",
      headerName: "Nombre",
      width: 350,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => (
        <Typography sx={{ paddingLeft: 2, fontWeight: 500 }}>
          {params.row.nombre_usuario || "Sin nombre"}
        </Typography>
      ),
    },
    {
      field: "apellido_usuario",
      headerName: "Apellido",
      width: 350,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "dni",
      headerName: "DNI",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.row.dni
          ? params.row.dni.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          : "-",
    },
    {
      field: "email_usuario",
      headerName: "Correo electrónico",
      width: 400,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "nombre_rol",
      headerName: "Rol",
      width: 220,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Typography sx={{ color: "#1f89f6", fontWeight: 500 }}>
          {params.row.nombre_rol || "-"}
        </Typography>
      ),
    },
    {
      field: "habilita",
      headerName: "Hablitado",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const habilitado = params.row.habilita == 1;
        return (
          <Typography
            sx={{
              color: habilitado ? "" : "#d32f2f", // 🔵 Azul si habilitado, 🔴 Rojo si no
            }}
          >
            {habilitado ? "Habilitado" : "Deshabilitado"}
          </Typography>
        );
      },
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Tooltip title="Editar rol del usuario" arrow>
          <IconButton
            color="primary"
            onClick={() => handleEditarRol(params.row)}
            sx={{
              color: "#000000",
              "&:hover": {
                color: "#0000008a",
                backgroundColor: "rgba(21,101,192,0.1)",
              },
            }}
          >
            <FontAwesomeIcon icon={faPen} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
      <Box
        className="no-print"
        onClick={() => navigate(-1)}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          marginLeft: "2%",
          marginTop: 2,
          width: "fit-content",
        }}
      >
        <ArrowBackIcon sx={{ color: "black", marginRight: 1 }} />
        <Typography sx={{ color: "black", fontSize: "1rem" }}>
          Volver
        </Typography>
      </Box>
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
            Listado de Usuarios
          </Typography>
          <FontAwesomeIcon
            icon={faCircleInfo}
            className="info-icon-container"
            onClick={() => setModalInfo(true)}
          />
        </Box>
      </div>
      {Array.isArray(usuarios) ? (
        <Box>
          <Box
            className="container-search"
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1.5,
              marginBottom: 2,
              paddingX: 2,
            }}
          >
            <TextField
              label="Buscar"
              type="text"
              variant="outlined"
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ maxWidth: 300, marginRight: "auto" }}
            />
            <Button
              variant="contained"
              onClick={AgregarUsuario}
              sx={{
                borderRadius: 3,
                // backgroundColor: "#1976d2",
                backgroundColor: "#000000",
                color: "#fff",
                // "&:hover": { backgroundColor: "#1565c0" },
                "&:hover": { backgroundColor: "#0000008a" },
              }}
            >
              <AddIcon sx={{ fontSize: 28 }} />
            </Button>
            <Button
              variant="contained"
              onClick={imprimirTabla}
              sx={{
                borderRadius: 3,
                // backgroundColor: "#1976d2",
                backgroundColor: "#000000",
                color: "#fff",
                // "&:hover": { backgroundColor: "#1565c0" },
                "&:hover": { backgroundColor: "#0000008a" },
              }}
            >
              <LocalPrintshopIcon sx={{ fontSize: 28 }} />
            </Button>
          </Box>

          <Box sx={{ width: "100%", overflow: "auto", paddingX: 2 }}>
            <DataGrid
              rows={filteredUsuarios}
              columns={columnas}
              pagination
              initialState={{
                pagination: { paginationModel: { pageSize: 100, page: 0 } },
              }}
              getRowId={(row) => row.id_usuario}
              pageSizeOptions={[100, 200, 500]}
              sx={{
                width: "90%",
                minWidth: isVerySmall ? "410px" : "auto",
                alignSelf: "center",
                justifySelf: "center",
                height: "55dvh",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",

                // 🔹 Header
                "& .MuiDataGrid-columnHeaders": {
                  fontSize: "0.9rem",
                  backgroundColor: "#000000",
                  color: "white",
                  fontWeight: 400,
                },

                "& .MuiDataGrid-cell": {
                  fontSize: isVerySmall ? "0.75rem" : "0.875rem",
                },

                // 🔹 Estilo del menú desplegable del header
                "& .MuiDataGrid-menuList": {
                  backgroundColor: "#fffff",
                  color: "white",
                },
                "& .MuiMenuItem-root": {
                  color: "white !important",
                },
                "& .MuiMenuItem-root.Mui-selected": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
                "& .MuiMenuItem-root:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },

                // 🔹 Iconos del header (flecha, puntos, etc.)
                "& .MuiDataGrid-sortIcon, & .MuiDataGrid-iconButtonContainer": {
                  color: "white",
                  transition: "color 0.2s ease",
                },
                "& .css-1pe4mpk-MuiButtonBase-root-MuiIconButton-root": {
                  color: "rgb(255 255 255)",
                },
                // 🔹 Efecto hover sobre el header
                "& .MuiDataGrid-columnHeader:hover .MuiDataGrid-iconButtonContainer, \
       .MuiDataGrid-columnHeader:hover .MuiDataGrid-sortIcon": {
                  color: "#FFFFFF", // Color dorado o el que quieras al hover
                },

                "& .MuiDataGrid-columnHeaderTitleContainerContent": {
                  color: "white",
                },
              }}
              localeText={esES.localeText}
            />
          </Box>
        </Box>
      ) : (
        <Typography color="error" sx={{ p: 2 }}>
          No se pudo cargar usuarios o el resultado no es un array.
        </Typography>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "down" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <ModalInfo open={modalInfo} setOpen={setModalInfo} />
      <ModalUsuario
        open={modalEditar}
        onClose={() => setModalEditar(false)}
        usuario={usuarioSeleccionado}
        onSuccess={(msg) => {
          showSnackbar(msg, "success");
          setModalEditar(false);
          obtenerUsuarios(); // refresca la tabla
        }}
      />
      <ModalAltaUsuario
        open={openModalAgregar}
        onClose={() => setOpenModalAgregar(false)}
        onSubmit={() => obtenerUsuarios()}
      />
    </Box>
  );
};

export default TablaUsuarios;
