import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import axiosTaxi from "../../config/axiosTaxi";
import { useNavigate } from "react-router-dom";

const ConductoresPendientes = () => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarPendientes();
  }, []);

  const cargarPendientes = async () => {
    const { data } = await axiosTaxi.get("/conductores/pendientes");
    setRows(data.result || []);
  };

  const columns = [
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      valueGetter: (p) =>
        `${p.row.apellido_usuario}, ${p.row.nombre_usuario}`,
    },
    { field: "dni", headerName: "DNI", width: 150 },
    { field: "email_usuario", headerName: "Email", width: 250 },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          onClick={() =>
            navigate(`/completar/${params.row.id_usuario}`)
          }
        >
          Completar datos
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Conductores pendientes de completar
      </Typography>

      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id_usuario}
        autoHeight
      />
    </Box>
  );
};

export default ConductoresPendientes;
