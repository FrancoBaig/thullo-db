const mysql = require("mysql");

function insert(pool, data, callback) {
	let insetQuery =
		"INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
	let query = mysql.format(insetQuery, [
		data.name,
		data.email,
		data.password,
	]);

	pool.getConnection(function (err, connection) {
		if (err) throw err;
		connection.query(query, function (err, result) {
			if (err) throw err;
			callback(result);
			connection.release();
		});
	});
}

function insertUser(pool, data) {
	let insertQuery =
		"INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				insertQuery,
				[data.name, data.email, data.password],
				(err, result) => {
					return err ? reject(err) : resolve(result);
				}
			);
		});
	});
}

function readEmail(pool, email) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"SELECT * FROM `user` WHERE `email`=?",
				[email],
				(err, result) => {
					return err ? reject(err) : resolve(result[0]);
				}
			);
		});
	});
}

function updatePhoto(pool, data) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;

			console.log("data", data);

			connection.query(
				"UPDATE `user` SET `imgUrl`=? WHERE `userId`=?",
				[data.imageId, data.userId],
				(err, result) => {
					return err ? reject(err) : resolve(result[0]);
				}
			);
		});
	});
}

module.exports = { insertUser, readEmail, updatePhoto };
