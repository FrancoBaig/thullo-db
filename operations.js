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

function insertColumn(pool, data) {
	let insertQuery =
		"INSERT INTO `column` (idColumn, title, Board_boardId) VALUES (null, ?, ?)";
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				insertQuery,
				[data.title, data.Board_boardId],
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

function readBoard(pool, boardId) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				`SELECT * from "board" WHERE "board".boardId = ?`,
				[boardId],
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

function updateBoardDescription(pool, data) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"UPDATE `board` SET `description` = ? WHERE `board`.`boardId` = ? ",
				[data.description, data.boardId],
				(err, result) => {
					return err ? reject(err) : resolve(result);
				}
			);
		});
	});
}

function updateColumnName(pool, data) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"UPDATE `column` SET `title` = ? WHERE `column`.`idColumn` = ? ",
				[data.title, data.idColumn],
				(err, result) => {
					return err ? reject(err) : resolve(result);
				}
			);
		});
	});
}

function updateTaskTitle(pool, data) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"UPDATE `task` SET `content` = ? WHERE `task`.`idTask` = ? ",
				[data.content, data.idTask],
				(err, result) => {
					return err ? reject(err) : resolve(result);
				}
			);
		});
	});
}

function createBoard(pool, data) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"INSERT INTO `board` (`boardId`, `title`, `isPrivate`, `description`, `image_url`) VALUES (NULL, ?, ?, ?, ?)",
				[data.title, data.isPrivate, data.description, data.image_url],
				(err, result) => {
					return err ? reject(err) : resolve(result);
				}
			);
		});
	});
}

function assignBoardToUser(pool, data) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"INSERT INTO `user_has_board` (`user_userId`, `Board_boardId`) VALUES (?, ?)",
				[data.userId, data.boardId],
				(err, result) => {
					return err ? reject(err) : resolve(result);
				}
			);
		});
	});
}

module.exports = {
	insertUser,
	insertColumn,
	updateColumnName,
	readEmail,
	updatePhoto,
	updateBoardDescription,
	updateTaskTitle,
	readUserBoards,
	readBoard,
	readColumn,
	createBoard,
	assignBoardToUser,
};
