import React from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faSearch,
  faList,
  faSort,
  faFilter,
  faInfoCircle,
  faMousePointer,
} from "@fortawesome/free-solid-svg-icons";

const ModalInfo = ({ open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  // Función para procesar texto con negritas
  const processText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95%", sm: 800, md: 900 },
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 3,
    maxHeight: "95vh",
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle = {
    background: "linear-gradient(135deg, #000000 0%, #000000 100%)",
    color: "#ffffff",
    padding: 2,
    borderRadius: "12px 12px 0 0",
    textAlign: "center",
    flexShrink: 0,
  };

  const steps = [
    {
      label: "Seleccionar Período",
      icon: faCalendarAlt,
      content:
        "Seleccione fechas **DESDE** y **HASTA**, siendo por defecto los últimos 30 días teniendo en cuenta el día de la fecha de consulta y/o seleccione el Libramiento específico que desea consultar.",
      color: "#4caf50",
    },
    {
      label: "Consultar",
      icon: faSearch,
      content: "Presione el botón **CONSULTAR** para iniciar la búsqueda.",
      color: "#2196f3",
    },
    {
      label: "Visualizar Resultados",
      icon: faList,
      content:
        "Los datos aparecen etiquetados por **COLUMNAS** correspondientes.",
      color: "#ff9800",
    },
    {
      label: "Paginación",
      icon: faMousePointer,
      content:
        "**10 filas** por página. Use controles **ANTERIOR**, **SIGUIENTE** o cambie la cantidad de filas por página a **20**, **50** o **100**.",
      color: "#9c27b0",
    },
    {
      label: "Ordenamiento",
      icon: faSort,
      content:
        "Haga click en el **nombre de columna** para ordenar **ASCENDENTE** o **DESCENDENTE**.",
      color: "#f44336",
    },
    {
      label: "Filtros de Columnas",
      icon: faFilter,
      content:
        "En cada encabezado de columna, abra el menú (icono de tres líneas) y seleccione **Filtrar**. Puede elegir condiciones como 'contiene', 'es igual a', etc., para mostrar solo los registros que cumplan con ese criterio.",
      color: "#3f51b5",
    },
    {
      label: "Búsqueda Avanzada",
      icon: faSearch,
      content:
        "En caso que quiera buscar algo específico en todas las columnas, utilice el campo **BUSCAR** en la barra de herramientas.",
      color: "#607d8b",
    },
  ];

  return (
    <Modal
      open={open}
      aria-labelledby="modal-grilla-datos"
      aria-describedby="modal-instrucciones-grilla-datos"
    >
      <Box sx={style}>
        <Box sx={headerStyle}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: "bold",
              display: "inline",
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            ¿Cómo se utiliza la Grilla de datos?
          </Typography>
        </Box>
        <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              textAlign: "center",
              color: "#666",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            Sigue estos pasos para aprovechar al máximo la funcionalidad:
          </Typography>
          <Grid
            container
            spacing={1.5}
            sx={{ flex: 1, justifyContent: "center" }}
          >
            {steps.map((step, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    border: `2px solid ${step.color}`,
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 4px 12px ${step.color}30`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          backgroundColor: step.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          mr: 1,
                          flexShrink: 0,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={step.icon}
                          style={{ fontSize: "12px" }}
                        />
                      </Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: "600",
                          color: step.color,
                          fontSize: "0.85rem",
                          lineHeight: 1.2,
                        }}
                      >
                        {step.label}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#555",
                        fontSize: "0.8rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {processText(step.content)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 2,
            pt: 0,
            flexShrink: 0,
          }}
        >
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "0.9rem",
              fontWeight: "600",
              background: "#000000",
              boxShadow: "0 4px 12px #000000",
              "&:hover": {
                boxShadow: "0 6px 16px #000000",
                background: "#0000008a",
                transform: "translateY(-1px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Entendido
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalInfo;
