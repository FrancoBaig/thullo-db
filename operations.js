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

function readUserBoards(pool, userId) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				`SELECT board.boardId, board.title, board.isPrivate, board.description, board.image_url
				FROM user
				JOIN user_has_board ON user.userId = user_has_board.user_userId
				JOIN board ON user_has_board.Board_boardId = board.boardId
				WHERE user.userId = ?`,
				[userId],
				(err, result) => {
					return err ? reject(err) : resolve(result);
				}
			);
		});
	});
}

function readColumn(pool, boardId) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"SELECT `column`.idColumn, `column`.title,   task.idTask, task.content, task.content, task.coverUrl FROM `column` LEFT JOIN task ON `column`.`idColumn` = task.Column_idColumn WHERE `column`.`Board_boardId` = ?",
				[boardId],
				(err, result) => {
					return err ? reject(err) : resolve(result);
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

module.exports = {
	insertUser,
	readEmail,
	updatePhoto,
	readUserBoards,
	readColumn,
};
