import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

// Get the correct __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // ✅ Initialize app before using it

// Enable CORS
app.use(cors({ origin: "http://192.168.18.197:5174", credentials: true }));

const PORT = 5001;

// Serve static files in production
if ("production" === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Catch-all route to serve the React app in production
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
