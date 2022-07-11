const registerRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../mysql_connector");
const { readEmail, insertUser } = require("../operations");
require("dotenv").config();

registerRouter.post("/signup", async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || typeof name !== "string") {
		return res.json({ status: "error", error: "Invalid username" });
	}

	if (!password || typeof password !== "string") {
		return res.json({ status: "error", error: "Invalid password" });
	}

	if (password.length < 5) {
		return res.json({
			status: "error",
			error: "Password too small. Should be at least 6 characters",
		});
	}

	if (!email || typeof email !== "string") {
		return res.json({ status: "error", error: "Invalid email" });
	}

	const passwordHash = await bcrypt.hash(password, 10);

	try {
		// Create user
		const data = {
			name,
			email,
			password: passwordHash,
		};
		await insertUser(pool, data);
		res.json({ status: "ok" });
	} catch (error) {
		throw error;
	}
});

registerRouter.post("/login", async (req, res) => {
	const { email, password } = req.body;

	// Encontrar usuario
	let user = await readEmail(pool, email);

	if (user == undefined) {
		return res.json({
			status: "error",
			error: "Invalid email or password",
		});
	}

	if (await bcrypt.compare(password, user.password)) {
		const token = jwt.sign(
			{ id: user.id, name: user.name },
			process.env.JWT_SECRET
		);
		return res.json({ status: "ok", data: token });
	}

	return res.json({ status: "error", error: "Invalid email or password" });
});

module.exports = registerRouter;
