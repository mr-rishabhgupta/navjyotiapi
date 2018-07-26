const mysql = require('mysql');


// const pool =mysql.createPool({
//     connectionLimit: 100,
//     host: '162.144.133.178',
//     user: 'navjyoti_rishab',
//     password: '123456789',
//     database: 'navjyoti_uma'
// })


const pool =mysql.createPool({
    connectionLimit: 100,
    host: '162.144.133.178',
    user: 'navjyoti_nar',
    password: '&oK6EqrNw@F+',
    database: 'navjyoti_kota'
})

class Global {
    getConnection() {
        return pool
    }
}
module.exports=Global;