import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
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
  IconButton,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { faEye, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import "../Tablas.css";
import axiosTaxi from "../../config/axiosTaxi";

const TablaValidacionConductores = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isVerySmall = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("warning");

  const showSnackbar = (message, severity = "warning") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const obtenerSolicitudes = async () => {
    try {
      setLoading(true);
      const { data } = await axiosTaxi.get(`/conductores/obtener`);
      console.log(data.result);
      setSolicitudes(data?.result || []);
      setFilteredSolicitudes(data?.result || []);
      if (!data?.result?.length)
        showSnackbar("No se encontraron solicitudes.", "info");
    } catch (error) {
      console.error("Error al obtener validaciones:", error);
      showSnackbar("Error al obtener las validaciones.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  useEffect(() => {
    if (!searchText) {
      setFilteredSolicitudes(solicitudes);
      return;
    }
    const lowerSearch = searchText.toLowerCase();
    const filtered = solicitudes.filter((row) =>
      Object.values(row).some(
        (val) => val && val.toString().toLowerCase().includes(lowerSearch),
      ),
    );
    setFilteredSolicitudes(filtered);
  }, [searchText, solicitudes]);

  const columnas = [
    {
      field: "nombre_usuario",
      headerName: "Nombre del Chofer",
      flex: 1,
      valueGetter: (params) =>
        `${params.row.apellido_usuario || ""}, ${params.row.nombre_usuario || ""}`.trim() ||
        "Sin nombre",
    },
    {
      field: "fecha_solicitud",
      headerName: "Fecha de Solicitud",
      width: 150,
      valueGetter: (params) => {
        if (!params.row.fecha_validacion) return "-";
        const fecha = new Date(params.row.fecha_validacion);
        return fecha.toLocaleDateString("es-AR");
      },
    },
    {
      field: "nombre_estado",
      headerName: "Estado",
      width: 150,
      renderCell: (params) => {
        const estado = params.row.nombre_estado || "Pendiente";
        const color =
          estado === "Aprobado"
            ? "#2e7d32"
            : estado === "Rechazado"
              ? "#d32f2f"
              : "#ed6c02";
        return (
          <Typography sx={{ color, fontWeight: 600 }}>{estado}</Typography>
        );
      },
    },
    {
      field: "observaciones",
      headerName: "Observaciones",
      flex: 1,
      valueGetter: (params) => params.row.observaciones || "-",
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 300,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() =>
              navigate(`/validacion-conductores/${params.row.id_usuario}`)
            }
          >
            Ver detalle
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/completar/${params.row.id_usuario}`)}
          >
            Completar
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
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

      <Typography variant="h5" sx={{ mb: 2 }}>
        Solicitudes de Habilitación de Choferes
      </Typography>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <TextField
          label="Buscar"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ width: 300 }}
        />
      </Box>

      <DataGrid
        rows={filteredSolicitudes}
        columns={columnas}
        getRowId={(r) => r.id_conductor}
        autoHeight
        loading={loading}
        pagination
        pageSizeOptions={[50, 100, 200]}
        initialState={{ pagination: { paginationModel: { pageSize: 50 } } }}
        localeText={{
          ...esES.components.MuiDataGrid.defaultProps.localeText,
          noRowsLabel: loading
            ? "Cargando solicitudes..."
            : "No hay solicitudes de habilitación",
        }}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "down" }}
      >
        <Alert severity={snackbarSeverity} onClose={handleCloseSnackbar}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TablaValidacionConductores;