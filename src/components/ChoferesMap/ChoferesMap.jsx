import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import L from "leaflet";

// 🔥 crear icono rotable
const createCarIcon = (angle = 0) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        transform: rotate(${angle}deg);
        transition: transform 0.3s linear;
        display:flex;
        align-items:center;
        justify-content:center;
      ">
        <div style="
          width: 38px;
          height: 38px;
        //   background: white;
        //   border-radius: 50%;
          drop-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display:flex;
          align-items:center;
          justify-content:center;
        ">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/744/744465.png" 
            width="100%"
            height="100%"
          />
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

const ChoferesMap = () => {
  const { socket } = useAuth();

  const [choferes, setChoferes] = useState([]);
  const choferesRef = useRef({});

  useEffect(() => {
    if (!socket) return;

    socket.on("choferes_ubicacion", (data) => {
      data.forEach((nuevo) => {
        const actual = choferesRef.current[nuevo.id];

        if (!actual) {
          choferesRef.current[nuevo.id] = {
            ...nuevo,
            angle: 0,
          };
        } else {
          animarMovimiento(nuevo.id, actual, nuevo);
        }
      });
    });

    return () => socket.off("choferes_ubicacion");
  }, [socket]);

  useEffect(() => {
    // 🔥 punto inicial (Tucumán)
    let lat = -26.8083;
    let lng = -65.2176;

    const id = 1;

    const interval = setInterval(() => {
      // movimiento random suave
      lat += (Math.random() - 0.5) * 0.001;
      lng += (Math.random() - 0.5) * 0.001;

      const nuevo = { id, lat, lng };

      const actual = choferesRef.current[id];

      if (!actual) {
        choferesRef.current[id] = {
          ...nuevo,
          angle: 0,
        };
        setChoferes(Object.values(choferesRef.current));
      } else {
        animarMovimiento(id, actual, nuevo);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // 🔥 calcular ángulo de dirección
  const calcularAngulo = (from, to) => {
    const dy = to.lat - from.lat;
    const dx = to.lng - from.lng;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    return angle;
  };

  // 🔥 animación PRO
  const animarMovimiento = (id, from, to) => {
    const duration = 1000;
    const steps = 30;
    let currentStep = 0;

    const latStep = (to.lat - from.lat) / steps;
    const lngStep = (to.lng - from.lng) / steps;

    const angle = calcularAngulo(from, to);

    const interval = setInterval(() => {
      currentStep++;

      choferesRef.current[id] = {
        ...to,
        lat: from.lat + latStep * currentStep,
        lng: from.lng + lngStep * currentStep,
        angle,
      };

      setChoferes(Object.values(choferesRef.current));

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, duration / steps);
  };

  return (
    <MapContainer
      center={[-26.8083, -65.2176]}
      zoom={13}
      style={{ height: "80vh", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {choferes.map((c) => (
        <Marker
          key={c.id}
          position={[c.lat, c.lng]}
          icon={createCarIcon(c.angle)}
        />
      ))}
    </MapContainer>
  );
};

export default ChoferesMap;
