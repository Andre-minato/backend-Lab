import { BOOLEAN, Sequelize } from "sequelize";
import db from "../db.js";

const UserRepository = db.define("users", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  role: {
    type: Sequelize.STRING
  },
   name: {
    type: Sequelize.STRING,
    allowNull: false,
   },
   email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
   },
   user_type_id: {
    type: Sequelize.STRING,
    allowNull: false
   },
   password: {
    type: Sequelize.STRING,
    allowNull: false
   },
   cpf_cnpj: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
   },
   phone: {
    type: Sequelize.STRING,
    allowNull: true,
   }
}, {paranoid: true, deletedAt: 'is_disabled'});
export default UserRepository;
