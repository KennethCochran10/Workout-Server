
const Sequelize = require('sequelize');
const sequelize = new Sequelize("postgres://postgres:d9618987580c47e5b313758abcc58af0@localhost:5432/Workout-Log-New", {
    dialect: "postgres"
})

module.exports = sequelize;