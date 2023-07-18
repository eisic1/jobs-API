const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "jobs_api"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    const sql = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255));";
    const sql_2 = "CREATE TABLE IF NOT EXISTS jobs (id INT AUTO_INCREMENT PRIMARY KEY, company VARCHAR(255), position VARCHAR(255), createdAt DATE, status VARCHAR(255), user_id INT, FOREIGN KEY (user_id) REFERENCES users(id));";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Users Table is created.");
        con.query(sql_2, function (err, result) {
            if (err) throw err;
            console.log("Jobs Table is created.");
        });
    });
});

module.exports = con