import React, { useState } from "react";
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
    fechaNacimiento: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setMessage(null);
  };

  const validateForm = () => {
    if (!form.email.trim()) return "Ingresa un correo válido.";
    if (mode === "register" && form.password.length < 6)
      return "La contraseña debe tener al menos 6 caracteres.";
    if (mode === "register" && form.password !== form.confirmarPassword)
      return "Las contraseñas no coinciden.";
    if (mode === "register" && !form.nombre.trim()) return "Ingresa tu nombre.";
    return null;
  };

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

    const endpoint =
      mode === "login" ? "/usuarios/login" : "/api/auth/register";
    console.log(form);

    const payload = {
      email: form.email,
      password: form.password,
      ...(mode === "register" && {
        nombre: form.nombre,
        apellido: form.apellido,
        dni: form.dni,
        telefono: form.telefono,
        fechaNacimiento: form.fechaNacimiento,
      }),
    };

    try {
      const response = await axiosTaxi.post(endpoint, payload);

      const data = response.data;

      // LOGIN OK
      console.log(data.result);
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

      setMessage(
        mode === "login"
          ? "¡Bienvenido de nuevo!"
          : "Registro exitoso. ¡Bienvenido a bordo!",
      );
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
        {mode === "login" ? "Iniciar sesión" : "Crear cuenta poderosa"}
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
            border: mode === "login" ? "2px solid #111" : "1px solid #ccc",
            backgroundColor: mode === "login" ? "#111" : "#f8f8f8",
            color: mode === "login" ? "#fff" : "#333",
            cursor: "pointer",
          }}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          style={{
            padding: "10px 20px",
            borderRadius: 999,
            border: mode === "register" ? "2px solid #111" : "1px solid #ccc",
            backgroundColor: mode === "register" ? "#111" : "#f8f8f8",
            color: mode === "register" ? "#fff" : "#333",
            cursor: "pointer",
          }}
        >
          Registro
        </button>
      </div>

      {/* <button
        onClick={handleGoogleLogin}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "12px 16px",
          marginBottom: 20,
          borderRadius: 12,
          border: "1px solid #ddd",
          backgroundColor: "#fff",
          cursor: "pointer",
        }}
      >
        <span>Iniciar sesión con Google</span>
      </button> */}

      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", marginBottom: 6 }}>
                Nombre
              </label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Pedro"
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
                Apellido
              </label>
              <input
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Pérez"
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", marginBottom: 6 }}>DNI</label>
              <input
                name="dni"
                value={form.dni}
                onChange={handleChange}
                placeholder="12345678"
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
                Teléfono
              </label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="+54 9 11 1234 5678"
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
                Fecha de nacimiento
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                value={form.fechaNacimiento}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </>
        )}

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

        {mode === "register" && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", marginBottom: 6 }}>
              Confirmar contraseña
            </label>
            <input
              name="confirmarPassword"
              type="password"
              value={form.confirmarPassword}
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
        )}

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
          {loading
            ? "Procesando..."
            : mode === "login"
              ? "Ingresar"
              : "Registrarse"}
        </button>
      </form>

      <p style={{ marginTop: 18, textAlign: "center", color: "#666" }}>
        {mode === "login"
          ? "¿No tienes cuenta? Regístrate para poder acceder."
          : "¿Ya tienes cuenta? Inicia sesión con tu correo o Google."}
      </p>
    </div>
  );
};
export default Login;
