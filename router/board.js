const boardRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const pool = require("../mysql_connector");
const {
	insertColumn,
	insertTask,
	updateBoardDescription,
	updateColumnName,
	updateTaskOrder,
	updateTaskTitle,
	readUserBoards,
	readColumn,
	createBoard,
	readBoard,
	assignBoardToUser,
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

boardRouter.post("/task", async (req, res) => {
	const body = req.body;

	try {
		const data = {
			content: body.content,
			idColumn: body.idColumn,
			position: body.position,
		};

		console.log("data", data);

		const response = await insertTask(pool, data);

		console.log("response new task", response);

		return res.status(200).json(response);
	} catch (err) {
		return res.json({ status: "error", error: ";))" });
	}
});

// necesito tener la columnID
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

		const ress = await assignBoardToUser(pool, assignData);

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

		const result = await updateColumnName(pool, data);

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

		const result = await updateColumnName(pool, data);

		return res.status(200).end();
	} catch (err) {
		console.log(err);
	}
});

module.exports = boardRouter;
