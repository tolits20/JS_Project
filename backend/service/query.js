const connection = require("../config/database");

exports.getAll = async (table) => {
    return result = await connection.query(`SELECT * FROM ${table}`)
  
};

exports.getById= async(id,table)=>{
    return result = await connection.query(`SELECT * FROM ${table} WHERE user_id =${id}`)
}


