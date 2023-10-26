import { Sequelize } from "sequelize";
import db from "../db.js";
import users from "./users.js"
import labs from "./labs.js"

export const BookLabRepository = db.define("book_labs", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      lab_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reserva: {
        type: Sequelize.DATE
      },
})
BookLabRepository.belongsTo(users, {
    constraints: true,
    foreignKey: 'user_id'
})
BookLabRepository.belongsTo(labs, {
    constraints: true,
    foreignKey: 'lab_id'
})

export default BookLabRepository;