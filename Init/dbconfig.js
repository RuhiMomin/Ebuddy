// const sequelize = require('sequelize')
let { Sequelize, Model, DataTypes, Op, QueryTypes } = require("sequelize")
let sequelizeCon = new Sequelize("mysql://root:@localhost/demo1")
sequelizeCon.authenticate().then().catch((err) => {             //connect to db
    console.log("errror", err)
})
module.exports = {
    sequelizeCon,
    Model,
    DataTypes,
    Op,
    QueryTypes
}
















