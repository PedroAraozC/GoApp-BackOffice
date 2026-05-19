import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosTaxi from "../../config/axiosTaxi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmarPassword: "",
    dni: "",
    telefono: "",
    genero: "",
    fechaNacimiento: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [generos, setGeneros] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setMessage(null);
  };

  const obtenerGeneros = async () => {
    try {
      const { data } = await axiosTaxi.get(`/generos/obtenerGenero/`);
      setGeneros(data?.result || null);
    } catch (error) {
      console.error("Error al obtener generos:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!form.email.trim()) return "Ingresa un correo válido.";
    if (form.password.length <= 6 && form.password > 0)
      return "La contraseña debe tener al menos 6 caracteres.";
    if (!form.password.trim()) return "La contraseña es requerida.";
  };

  const hoy = new Date();

  const maxDate = new Date(
    hoy.getFullYear() - 17,
    hoy.getMonth(),
    hoy.getDate(),
  );

  const minDate = new Date(
    hoy.getFullYear() - 120,
    hoy.getMonth(),
    hoy.getDate(),
  );

  // formato yyyy-mm-dd
  const formatDate = (date) => date.toISOString().split("T")[0];

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const endpoint = "/usuarios/loginBackOffice";
    console.log(form);

    const payload = {
      email_usuario: form.email || null,
      password: form.password || null,
    };
    try {
      const response = await axiosTaxi.post(endpoint, payload);

      const data = response.data;

      if (mode === "login") {
        // LOGIN
        localStorage.setItem("token", data.token);

        const usuario = {
          ...data.result,
          nombre: data.result.nombre_usuario,
          apellido: data.result.apellido_usuario,
        };

        localStorage.setItem("usuario", JSON.stringify(usuario));

        login({
          token: data.token,
          usuario,
        });

        navigate("/home", { replace: true });
      } else {
        const loginResponse = await axiosTaxi.post(
          "/usuarios/loginBackOffice",
          {
            email_usuario: form.email,
            password: form.password,
          },
        );

        const loginData = loginResponse.data;

        localStorage.setItem("token", loginData.token);

        const usuario = {
          ...loginData.result,
          nombre: loginData.result.nombre_usuario,
          apellido: loginData.result.apellido_usuario,
        };

        localStorage.setItem("usuario", JSON.stringify(usuario));

        login({
          token: loginData.token,
          usuario,
        });

        navigate("/home", { replace: true });
      }
      setMessage("¡Bienvenido a bordo!");
    } catch (err) {
      console.error("ERROR AXIOS:", err);

      // 👇 ACA está el mensaje del backend
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Error en la autenticación.");
      } else {
        setError("No se pudo conectar al servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  useEffect(() => {
    obtenerGeneros();
  }, []);

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "40px auto",
        padding: 24,
        borderRadius: 20,
        boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
        backgroundColor: "#fff",
      }}
    >
      <h1 style={{ marginBottom: 8, fontSize: 32, textAlign: "center" }}>
        {"Iniciar sesión"}
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginBottom: 24,
        }}
      >
        <button
          type="button"
          onClick={() => setMode("login")}
          style={{
            padding: "10px 20px",
            borderRadius: 999,
            border: "2px solid #111",
            backgroundColor: "#111",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Correo</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="correo@dominio.com"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 10,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Contraseña
          </label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="********"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 10,
              border: "1px solid #ccc",
            }}
          />
        </div>

        {error && (
          <div
            style={{
              marginBottom: 14,
              color: "#b00020",
              backgroundColor: "#fdecea",
              padding: 12,
              borderRadius: 10,
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              marginBottom: 14,
              color: "#0f5132",
              backgroundColor: "#d1e7dd",
              padding: 12,
              borderRadius: 10,
            }}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "none",
            backgroundColor: "#111",
            color: "#fff",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Procesando..." : "Ingresar"}
        </button>
      </form>

      <p style={{ marginTop: 18, textAlign: "center", color: "#666" }}>
        ¿No tienes cuenta? Solicitá tu cuenta para poder acceder.
        {/* : "¿Ya tienes cuenta? Inicia sesión con tu correo o Google."} */}
      </p>
    </div>
  );
};
export default Login;
