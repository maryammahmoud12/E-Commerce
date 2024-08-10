import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { initApp } from "./src/initapp.js";

const port = process.env.port || 5000;

const app = express();
initApp(app, express);

app.listen(port, () => console.log(`app listening on port ${port}!`));
