import { Sequelize } from "sequelize";
import db from "../db.js";

const UserTypeRepository = db.define("user_types", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_type: {
        type: Sequelize.INTEGER,
        allowNullNULL: false,
      },
      user_name: {
        type: Sequelize.STRING,
        allowNull: false
      }
});
export default UserTypeRepository;
