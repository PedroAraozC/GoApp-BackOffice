import { Routes, Route, HashRouter } from "react-router-dom";
import { useState } from "react";
import Layout from "./common/Layout";
import Home from "./routes/Home/Home";
import TablaValidacionConductores from "./components/TablaChoferes/TablaChoferes";
import TablaUsuarios from "./components/TablaUsuarios/TablaUsuarios";
import DetalleConductor from "./components/TablaChoferes/DeatalleConductor";
import ConductoresPendientes from "./components/TablaChoferes/ConductoresPendientes";
import CompletarConductor from "./components/TablaChoferes/CompletarConductor";
import Login from "./components/Login/Login";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route
            exact
            path="/home"
            element={
              <PrivateRoute>
                <Layout>
                  <Home />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/validacion-conductores"
            element={
              <PrivateRoute>
                <Layout>
                  <TablaValidacionConductores />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/validacion-conductores/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <DetalleConductor />{" "}
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/conductores-pendientes"
            element={
              <PrivateRoute>
                <Layout>
                  <ConductoresPendientes />{" "}
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/completar/:id_usuario"
            element={
              <PrivateRoute>
                <Layout>
                  <CompletarConductor />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route exact path="/" element={<Login />} />
          <Route
            exact
            path="/usuarios"
            element={
              <Layout>
                <TablaUsuarios />
              </Layout>
            }
          />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
