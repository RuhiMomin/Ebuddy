let { Model, QueryTypes, Op, DataTypes, sequelizeCon } = require("../Init/dbconfig")
class Cart extends Model { }

Cart.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: id
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    qty:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    total_amount:{
        type:DataTypes.INTEGER,
        allowNull:false
    },

},{tableName:"cart", modelName:"Cart", sequelize:sequelizeCon})

module.exports={
    Cart
}