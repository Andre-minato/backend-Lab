import { Sequelize } from "sequelize"; 
import dotenv from "dotenv/config.js"; 

const dbName = process.env.DB_NAME; 
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  dialect: "mysql", 
  host: dbHost, 
});

sequelize.authenticate()
.then(() => {
  console.log("Conexão com o banco de dados ralizada com sucesso!")
}).catch(() => {
  console.log("Não foi possível conectar com banco de dados!")
})

export default sequelize; 
