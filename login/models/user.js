const Sequelize = require('sequelize') // Class 
const moment = require('moment'); 

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            userid:{
                type:Sequelize.STRING(20),
                allowNull:false,
                unique:true,
            },
            userpw:{
                type:Sequelize.STRING(20),
                allowNull:false,
            },
            username:{
                type:Sequelize.STRING(20),
                allowNull:false,
            },
            userrrn:{
                type:Sequelize.STRING(30),
                allowNull:false,
            },
            gender:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
            },
            userdt:{
                type:Sequelize.DATEONLY,
                allowNull:false,
                defaultValue:Sequelize.NOW,
                get:function(){
                    return moment(this.getDataValue('userdt')).format('YYYY-MM-DD')
                }
            }
        },{
            sequelize,
            timestamps:false,
            underscored:false,
            paranoid:false,
            modelName:"User",
            tableName:"USERS",
            charset:"utf8",
            collate:"utf8_general_ci",
        })
    }
    static associate (db){}
}