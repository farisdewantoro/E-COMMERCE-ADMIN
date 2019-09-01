
import mysql from 'mysql';
import keys from './keys';
var con = mysql.createConnection({
    host:keys.database.host,
    user:keys.database.user,
    password:keys.database.password,
    database:keys.database.database,
    multipleStatements: true,
    connectTimeout: 30000
});

con.connect((err) =>{
    if(err) throw err;
    else console.log('MySql connected')
});

export default con;