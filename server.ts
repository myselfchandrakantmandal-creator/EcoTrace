import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // Sensor Data Simulation
  const sensors = {
    mq135: {
      co2: 400,
      nh3: 15,
      benzene: 2,
      alcohol: 1,
      smoke: 10,
      toluene: 5,
      acetone: 3,
      ch4: 1.8
    },
    mq2: {
      lpg: 200,
      propane: 150,
      h2: 50
    },
    dht22: {
      temp: 24,
      humidity: 45
    }
  };

  // Broadcast sensor updates every second
  setInterval(() => {
    // Add some random noise to sensors
    sensors.mq135.co2 += (Math.random() - 0.5) * 5;
    sensors.mq135.nh3 += (Math.random() - 0.5) * 0.5;
    sensors.mq135.smoke += (Math.random() - 0.5) * 2;
    sensors.mq2.lpg += (Math.random() - 0.5) * 4;
    sensors.dht22.temp += (Math.random() - 0.5) * 0.1;
    sensors.dht22.humidity += (Math.random() - 0.5) * 0.2;

    // Clamp values
    sensors.mq135.co2 = Math.max(350, Math.min(2000, sensors.mq135.co2));
    sensors.dht22.temp = Math.max(15, Math.min(45, sensors.dht22.temp));

    io.emit("sensor_data", {
      ...sensors,
      timestamp: Date.now(),
      status: sensors.mq135.co2 > 1500 || sensors.mq135.smoke > 100 ? "Alert" : "Safe"
    });
  }, 1000);

  // Industrial Site Simulation (Jharkhand Plants & Mines)
  const factories = [
    { id: 'f1', name: "TATA Chemical Plant", lat: 22.7937, lng: 86.1775, category: "Chemical" },
    { id: 'f2', name: "Jharia Deep Mine", lat: 23.7437, lng: 86.4111, category: "Mining" },
    { id: 'f3', name: "Sindri Chemical Unit", lat: 23.6441, lng: 86.5094, category: "Chemical" },
    { id: 'f4', name: "Dhanbad Industrial Core", lat: 23.7957, lng: 86.4304, category: "Industrial" },
    { id: 'f5', name: "Bokaro Power Plant", lat: 23.6693, lng: 86.1511, category: "Power" },
    { id: 'f6', name: "Hazaribagh Coal Fields", lat: 23.9925, lng: 85.3633, category: "Mining" }
  ];

  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.emit("factories_init", factories);
  });

  // API health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
