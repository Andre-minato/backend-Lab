import express from "express";
import routes from "./routes.js";
import db from "./src/db.js";
import cors from "cors"

const app = express();
app.use(cors())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

app.use(express.json());
app.use(routes);
db.sync(() => console.log(`Banco de dados conectado: ${process.env.DB_NAME}`));

app.listen(3000, () => console.log("Servidor iniciado na porta 3000"));
