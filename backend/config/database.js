const path = require("path");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("chatdb", "root", "password", {
    host: "localhost",
    dialect: "mysql",
});

module.exports = sequelize;
