// get the client
const mysql = require("mysql");

require("dotenv").config();

// create the connection to database
const pool = mysql.createPool({
	host: process.env.HOSTD,
	user: process.env.USERD,
	database: process.env.DBD,
	password: process.env.PASSWORDD,
	// ssl: {
	// 	rejectUnauthorized: false,
	// },
	waitForConnections: true,
	connectionLimit: 20,
});

module.exports = pool;
