import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoute from "./route/authRoute.js";
import { initDB } from "./model/intitDB.js";

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1", authRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
