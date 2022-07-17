const boardRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const pool = require("../mysql_connector");
const {
	insertColumn,
	insertTask,
	updateBoardDescription,
	updateColumnName,
	updateTaskOrder,
	updateTaskColumn,
	updateTaskTitle,
	updateTaskDescription,
	updateTaskCover,
	updateBoardPrivacity,
	readUserBoards,
	searchUsersByEmail,
	readColumn,
	createBoard,
	readBoard,
	assignBoardToUser,
	deleteTasksFromColumn,
	deleteColumn,
	deleteUserHasBoard,
	readAllUsersFromBoard,
} = require("../operations");

boardRouter.get("/:boardId", async (req, res) => {
	const boardId = req.params.boardId;

	try {
		const response = await readColumn(pool, boardId);
		return res.status(200).json(response);
	} catch (err) {
		console.log(err);
	}
});

boardRouter.get("/", async (req, res) => {
	const token = req.get("authorization");

	let user = {
		id: "",
	};

	try {
		user = jwt.verify(token, process.env.JWT_SECRET);
		const userBoards = await readUserBoards(pool, user.id);
		return res.status(200).json(userBoards);
	} catch (err) {
		return res.json({ status: "error", error: ";))" });
	}
});

boardRouter.get("/all/users/:boardId", async (req, res) => {
	const boardId = req.params.boardId;

	try {
		const allUsers = await readAllUsersFromBoard(pool, boardId);
		return res.status(200).json(allUsers);
	} catch (err) {
		return res.json({ status: "error" });
	}
});

boardRouter.post("/column", async (req, res) => {
	const body = req.body;

	try {
		const data = {
			title: body.title,
			Board_boardId: body.Board_boardId,
		};

		const response = await insertColumn(pool, data);

		return res.status(200).json(response);
	} catch (err) {
		return res.json({ status: "error", error: ";))" });
	}
});

boardRouter.delete("/column/:id", async (req, res) => {
	const id = req.params.id;

	try {
		await deleteTasksFromColumn(pool, id);
		await deleteColumn(pool, id);

		return res.status(200).end();
	} catch (err) {
		return res.json({ status: "error", error: "index error" });
	}
});

boardRouter.post("/task", async (req, res) => {
	const body = req.body;

	try {
		const data = {
			content: body.content,
			idColumn: body.idColumn,
			position: body.position,
		};

		const response = await insertTask(pool, data);

		return res.status(200).json(response);
	} catch (err) {
		return res.json({ status: "error", error: ";))" });
	}
});

boardRouter.put("/task/position", async (req, res) => {
	const body = req.body;
	const idColumn = body[0].idColumn;
	const ids = body[1];

	for (let el of ids) {
		const data = {
			newPosition: el.position,
			taskId: el.taskId,
			idColumn: idColumn,
		};

		try {
			await updateTaskOrder(pool, data);
		} catch (err) {
			console.log(err);
		}
	}

	return res.status(200).end();
});

boardRouter.put("/task/content", async (req, res) => {
	const body = req.body;

	const data = {
		idTask: body.idTask,
		idColumn: body.idColumn,
		newContent: body.newContent,
	};

	try {
		await updateTaskTitle(pool, data);
	} catch (err) {
		console.log(err);
	}

	return res.status(200).end();
});

boardRouter.put("/task/description", async (req, res) => {
	const body = req.body;

	const data = {
		idTask: body.idTask,
		idColumn: body.idColumn,
		newDescription: body.newDescription,
	};

	try {
		await updateTaskDescription(pool, data);
	} catch (err) {
		console.log(err);
	}

	return res.status(200).end();
});

boardRouter.put("/task/cover", async (req, res) => {
	const body = req.body;

	const data = {
		idTask: body.idTask,
		idColumn: body.idColumn,
		newCoverUrl: body.newCoverUrl,
	};

	try {
		await updateTaskCover(pool, data);
	} catch (err) {
		console.log(err);
	}

	return res.status(200).end();
});

boardRouter.put("/task/column", async (req, res) => {
	const data = req.body;

	try {
		await updateTaskColumn(pool, data);
	} catch (err) {
		console.log(err);
	}
});

boardRouter.post("/", async (req, res) => {
	const body = req.body;
	const token = req.get("authorization");

	let user = {
		id: "",
	};

	try {
		user = jwt.verify(token, process.env.JWT_SECRET);

		const data = {
			title: body.title,
			isPrivate: body.isPrivate,
			description: body.description,
			image_url: body.image_url,
		};

		const board = await createBoard(pool, data);

		const assignData = {
			userId: user.id,
			boardId: board.insertId,
		};

		await assignBoardToUser(pool, assignData);

		return res.status(200).json(assignData);
	} catch (err) {
		return res.json({ status: "error", error: ";))" });
	}
});

boardRouter.put("/description", async (req, res) => {
	const body = req.body;

	try {
		const data = {
			description: body.description,
			boardId: body.boardId,
		};

		const result = await updateBoardDescription(pool, data);

		return res.status(200).end();
	} catch (err) {
		console.log(err);
	}
});

boardRouter.put("/column", async (req, res) => {
	const body = req.body;

	try {
		const data = {
			title: body.title,
			idColumn: body.idCol,
		};

		await updateColumnName(pool, data);

		return res.status(200).end();
	} catch (err) {
		console.log(err);
	}
});

boardRouter.put("/column", async (req, res) => {
	const body = req.body;

	try {
		const data = {
			title: body.title,
			idColumn: body.idCol,
		};

		await updateColumnName(pool, data);

		return res.status(200).end();
	} catch (err) {
		console.log(err);
	}
});

boardRouter.put("/privacity", async (req, res) => {
	const body = req.body;

	try {
		const data = {
			boardId: body.boardId,
			newPrivacity: !body.isPrivate,
		};

		await updateBoardPrivacity(pool, data);

		return res.status(200).end();
	} catch (err) {
		console.log(err);
	}
});

boardRouter.get("/users/:string", async (req, res) => {
	const string = req.params.string;

	try {
		const response = await searchUsersByEmail(pool, string);
		return res.status(200).json(response);
	} catch (err) {
		console.log(err);
	}
});

boardRouter.post("/assign", async (req, res) => {
	const body = req.body;

	const assignData = {
		userId: body.userId,
		boardId: body.boardId,
	};

	try {
		await assignBoardToUser(pool, assignData);

		return res.status(200).end();
	} catch (err) {
		return res.json({ status: "error" });
	}
});

boardRouter.delete("/:boardId/:userId", async (req, res) => {
	const boardId = req.params.boardId;
	const userId = req.params.userId;

	const data = {
		userId: userId,
		boardId: boardId,
	};

	try {
		await deleteUserHasBoard(pool, data);
		return res.status(200).end();
	} catch (err) {
		return res.json({ status: "error" });
	}
});

module.exports = boardRouter;
