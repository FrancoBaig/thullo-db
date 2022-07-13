// get the client
const mysql = require("mysql");

require("dotenv").config();

// create the connection to database

const pool = mysql.createPool({
	host: process.env.HOST,
	user: process.env.USER,
	database: process.env.DB,
});

module.exports = pool;
