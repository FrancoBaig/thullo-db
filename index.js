const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./mysql_connector");
const registerRouter = require("./router/register");
app.use(cors());

app.listen(3001, () => {
	console.log("Listening port 3001");
});

app.use(express.json());

app.use("/api/register", registerRouter);
