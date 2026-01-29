import { Routes, Route, HashRouter } from "react-router-dom";
import { useState } from "react";
import Layout from "./common/Layout";
import Home from "./routes/Home/Home";
import TablaValidacionConductores from "./components/TablaChoferes/TablaChoferes";
import TablaUsuarios from "./components/TablaUsuarios/TablaUsuarios";
import DetalleConductor from "./components/TablaChoferes/DeatalleConductor";
import ConductoresPendientes from "./components/TablaChoferes/ConductoresPendientes";
import CompletarConductor from "./components/TablaChoferes/CompletarConductor";

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route
            path="/validacion-conductores"
            element={<TablaValidacionConductores />}
          />
          <Route
            path="/validacion-conductores/:id"
            element={<DetalleConductor />}
          />
          <Route
            exact
            path="/conductores-pendientes"
            element={<ConductoresPendientes />}
          />
          <Route
            path="/completar/:id_usuario"
            element={<CompletarConductor />}
          />

          <Route exact path="/Usuarios" element={<TablaUsuarios />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
