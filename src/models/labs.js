import { Sequelize } from "sequelize";
import db from "../db.js";

const LabRepository = db.define("labs", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      floor: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lab_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      occupied: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      
},{paranoid: true, deletedAt: 'is_disabled'});

export default LabRepository;