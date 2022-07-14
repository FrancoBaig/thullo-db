const boardRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const pool = require("../mysql_connector");
const { readUserBoards, readColumn } = require("../operations");

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

module.exports = boardRouter;
