const express = require("express");
const app = express();
const pool = require("./mysql_connector");
const registerRouter = require("./router/register");

app.listen(3001, () => {
	console.log("Listening port 3001");
});

app.use(express.json());
app.use("/api/register", registerRouter);

app.get("/", (req, res) => {
	const sql = `SELECT * FROM user`;
});

app.get("/nombres", (req, res) => {
	const sql = `SELECT nombre FROM persona`;
});

app.post("/", (req, res) => {
	const sql = `INSERT INTO persona (id, nombre, email) VALUES (${null}, "María", "jmaria@gmail.com")`;
});
