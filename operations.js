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

function insertTask(pool, data) {
	let insertQuery =
		"INSERT INTO `task` (`idTask`, `content`, `coverUrl`, `Column_idColumn`, `position`) VALUES (NULL, ?, NULL, ?, ?)";
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				insertQuery,
				[data.content, data.idColumn, data.position],
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

function searchUsersByEmail(pool, string) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"SELECT `user`.`userId`, `user`.`name`, `user`.`email`, `user`.`imgUrl`  FROM `user` WHERE INSTR(`user`.`email`, ?) > 0 LIMIT 5",
				[string.toLowerCase()],
				(err, result) => {
					return err ? reject(err) : resolve(result);
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
				"SELECT `column`.idColumn, `column`.title, task.idTask, task.content, task.content, task.coverUrl FROM `column` LEFT JOIN task ON `column`.`idColumn` = task.Column_idColumn WHERE `column`.`Board_boardId` = ? ORDER BY `task`.`position` ASC ",
				[boardId],
				(err, result) => {
					return err ? reject(err) : resolve(result);
				}
			);
		});
	});
}

function readAllUsersFromBoard(pool, boardId) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"SELECT `user`.userId, `user`.name, `user`.email, `user`.imgUrl FROM `user` JOIN `user_has_board` ON `user`.userId = `user_has_board`.user_userId WHERE `user_has_board`.Board_boardId = ?",
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

function updateTaskColumn(pool, data) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"UPDATE `task` SET `Column_idColumn` = ? WHERE `task`.`idTask` = ?",
				[data.idColumn, data.idTask],
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
				"UPDATE `task` SET `task`.`content` = ? WHERE `task`.`idTask` = ? AND `Column_idColumn` = ?",
				[data.newContent, data.idTask, data.idColumn],
				(err, result) => {
					return err ? reject(err) : resolve(result);
				}
			);
		});
	});
}

function updateTaskDescription(pool, data) {
	console.log("data pasada para cambiar description", data);

	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"UPDATE `task` SET `task`.`description` = ? WHERE `task`.`idTask` = ?",
				[data.newDescription, data.idTask],
				(err, result) => {
					return err ? reject(err) : resolve(result);
				}
			);
		});
	});
}

function updateTaskCover(pool, data) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"UPDATE `task` SET `task`.`coverUrl` = ? WHERE `task`.`idTask` = ? AND `Column_idColumn` = ?",
				[data.newCoverUrl, data.idTask, data.idColumn],
				(err, result) => {
					return err ? reject(err) : resolve(result);
				}
			);
		});
	});
}

function updateTaskOrder(pool, data) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"UPDATE `task` SET `position` = ? WHERE `task`.`idTask` = ? AND `task`.`Column_idColumn` = ? ",
				[data.newPosition, data.taskId, data.idColumn],
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

function deleteTasksFromColumn(pool, idColumn) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"DELETE FROM `task` WHERE `task`.Column_idColumn = ?",
				[idColumn],
				(err, result) => {
					return err ? reject(err) : resolve(result);
				}
			);
		});
	});
}

function deleteColumn(pool, idColumn) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"DELETE FROM `column` WHERE `column`.`idColumn` = ?",
				[idColumn],
				(err, result) => {
					return err ? reject(err) : resolve(result);
				}
			);
		});
	});
}

function updateBoardPrivacity(pool, data) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"UPDATE `board` SET `isPrivate` = ? WHERE `board`.`boardId` = ? ",
				[data.newPrivacity, data.boardId],
				(err, result) => {
					return err ? reject(err) : resolve(result);
				}
			);
		});
	});
}

function deleteUserHasBoard(pool, data) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"DELETE FROM `user_has_board` WHERE `user_has_board`.`user_userId` = ? AND `user_has_board`.`Board_boardId` = ?",
				[data.userId, data.boardId],
				(err, result) => {
					return err ? reject(err) : resolve(result);
				}
			);
		});
	});
}

// Labels
function insertNewLabel(pool, data) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"INSERT INTO `label` (`labelId`, `text`, `color`, `Task_idTask`) VALUES (NULL, ?, ?, ?)",
				[data.text, data.color, data.taskId],
				(err, result) => {
					return err ? reject(err) : resolve(result);
				}
			);
		});
	});
}

function readLabelsFromTasks(taskpool, tasksArray) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) throw err;
			connection.query(
				"SELECT * FROM `label` WHERE `label`.`Task_idTask` IN (?)",
				[tasksArray],
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
	insertTask,
	insertNewLabel,
	updateTaskOrder,
	updateColumnName,
	updateTaskColumn,
	updateTaskTitle,
	updateTaskDescription,
	updateTaskCover,
	updateBoardPrivacity,
	readEmail,
	updatePhoto,
	updateBoardDescription,
	readUserBoards,
	readBoard,
	readColumn,
	readAllUsersFromBoard,
	searchUsersByEmail,
	createBoard,
	assignBoardToUser,
	deleteTasksFromColumn,
	deleteColumn,
	deleteUserHasBoard,
};
