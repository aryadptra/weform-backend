import dotenv from "dotenv";
import express from "express";
import apiRouter from "./routes/api.js";
import connection from "./connection.js";

const env = dotenv.config().parsed;

const app = express();

// mongodb connection
connection();

// Use request body json instead
app.use(express.json());
// Use requiest body url encoded instead, with object keys
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.listen(env.APP_PORT, () => {
  console.log(`Server listening on port ${env.APP_PORT}`);
});
