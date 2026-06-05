import { Box, Button, Typography } from "@mui/material";

const DocumentoCard = ({
  label,
  data,
  disabled,
  onUpload,
  onDelete,
  onPreview,
}) => {
  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        p: 1.5,
        height: 260,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#fff",
      }}
    >
      {/* HEADER */}
      <Typography
        variant="subtitle2"
        sx={{ textTransform: "capitalize", fontWeight: 600 }}
      >
        {label}
      </Typography>

      {/* BODY */}
      <Box
        sx={{
          flex: 1,
          mt: 1,
          mb: 1,
          borderRadius: 1,
          border: "1px dashed #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          cursor: data?.preview ? "pointer" : "default",
        }}
        onClick={() => data?.preview && onPreview(data.preview)}
      >
        {data ? (
          data.tipo === "image" ? (
            <img
              src={data.preview}
              alt={label}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            // 🔥 PREVIEW PDF SIN SCROLL
            <Box
              sx={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <iframe
                src={`${data.preview}#toolbar=0&navpanes=0&view=FitH&page=1`}
                width="100%"
                height="300px"
                style={{
                  border: "none",
                  transform: "scale(1.08)",
                  transformOrigin: "top left",
                  pointerEvents: "none",
                }}
                title="PDF Preview"
              />
            </Box>
          )
        ) : (
          <Typography variant="caption" color="text.secondary">
            Sin archivo
          </Typography>
        )}
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          color={
            data?.existente
              ? "success.main"
              : data?.file
                ? "warning.main"
                : "text.secondary"
          }
        >
          {data?.existente ? "Guardado" : data?.file ? "Pendiente" : ""}
        </Typography>

        <Box display="flex" gap={1}>
          <Button
            size="small"
            variant="outlined"
            component="label"
            disabled={disabled}
          >
            Subir
            <input
              hidden
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => onUpload(e.target.files[0])}
            />
          </Button>

          {data && (
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={onDelete}
            >
              Borrar
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DocumentoCard;
