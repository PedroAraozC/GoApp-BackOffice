import { useEffect } from "react";

const useFavicon = (unreadCount) => {
  useEffect(() => {
    const link =
      document.querySelector("link[rel~='icon']") ||
      document.createElement("link");

    link.rel = "icon";

    if (unreadCount > 0) {
      // Crear canvas con el ícono y el puntito rojo
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const size = 50;
      canvas.width = size;
      canvas.height = size;

      const img = new Image();
      img.src = "/app_icon.png"; // tu favicon base
      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size);

        // dibujar circulito rojo arriba a la derecha
        ctx.beginPath();
        ctx.arc(size - 8, 40, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();

        link.href = canvas.toDataURL("image/png");
        document.head.appendChild(link);
      };
    } else {
      // volver al favicon original
      link.href = "/app_icon.png";
      document.head.appendChild(link);
    }
  }, [unreadCount]);
};

export default useFavicon;
