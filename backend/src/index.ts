import "dotenv/config";
import express from "express";
import authRouter from "./routes/authRoutes";
import categoryRouter from "./routes/categoryRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
