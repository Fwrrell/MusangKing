import "dotenv/config";
import express from "express";
import cors from "cors";

import apiRouter from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/api`);
});
