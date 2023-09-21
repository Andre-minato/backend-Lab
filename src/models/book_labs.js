// import { Sequelize } from "sequelize";
// import db from "../db.js";

// export const BookLabRepository = db.define("book_lab", {
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true
//       },
//       date: {
//         type: Sequelize.DATE,
//       },
//       idUser: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//             model: "users",
//             key: "id",
//             foreignKey: true
//         },
        
//       },
//       idLab: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//             model: "labs",
//             key: "id",
//             foreignKey: true
//         },
//       }
// });