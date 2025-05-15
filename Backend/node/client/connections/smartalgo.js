const mysql = require('mysql');

const smartalgo = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'vLBA}z)/8/>%W/cy',
    database: 'smartalgo_new_app',
    multipleStatements: true
});

smartalgo.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server Smartalgo new app!');
});

module.exports = smartalgo;